#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:4000/v1}"
WEB_BASE_URL="${WEB_BASE_URL:-http://localhost:3000}"
SMOKE_USER_EMAIL="${SMOKE_USER_EMAIL:-mvp-smoke@example.test}"
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/license-base-smoke.XXXXXX")"
PRACTICE_SET_RESPONSE="${TMP_DIR}/practice-set.json"
GRADE_REQUEST="${TMP_DIR}/grade-request.json"
BOOKMARK_REQUEST="${TMP_DIR}/bookmark-request.json"
GRADE_RESPONSE="${TMP_DIR}/grade-response.json"
EMPTY_REQUEST="${TMP_DIR}/empty-request.json"
ATTEMPT_REQUEST="${TMP_DIR}/attempt-request.json"
ATTEMPT_RESPONSE="${TMP_DIR}/attempt.json"
ATTEMPT_ID_FILE="${TMP_DIR}/attempt-id.txt"
SAVE_ANSWERS_RESPONSE="${TMP_DIR}/save-answers.json"
SUBMIT_RESPONSE="${TMP_DIR}/submit.json"
ATTEMPT_RESULT_RESPONSE="${TMP_DIR}/attempt-result.json"
PROGRESS_RESPONSE="${TMP_DIR}/progress.json"
BOOKMARK_RESPONSE="${TMP_DIR}/bookmark.json"
REVIEW_RESPONSE="${TMP_DIR}/review-items.json"
SMOKE_RESPONSE="${TMP_DIR}/response.txt"

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

require_command() {
  local command_name="$1"
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "ERROR: ${command_name} is required for this smoke check." >&2
    exit 127
  fi
}

request() {
  local label="$1"
  local method="$2"
  local url="$3"
  local body_file="${4:-}"
  local output_file="${5:-${SMOKE_RESPONSE}}"

  echo "==> ${label}"
  if [[ "${method}" == "POST" ]]; then
    curl --fail --show-error --silent \
      --request POST \
      --header 'Content-Type: application/json' \
      --data "@${body_file}" \
      "${url}" > "${output_file}"
  elif [[ "${method}" == "GET" ]]; then
    curl --fail --show-error --silent "${url}" > "${output_file}"
  else
    echo "ERROR: unsupported HTTP method: ${method}" >&2
    exit 2
  fi
  head -c 1200 "${output_file}"
  echo
  echo
}

auth_request() {
  local label="$1"
  local method="$2"
  local url="$3"
  local body_file="${4:-}"
  local output_file="${5:-${SMOKE_RESPONSE}}"

  echo "==> ${label}"
  if [[ "${method}" == "POST" ]]; then
    curl --fail --show-error --silent \
      --request POST \
      --header 'Content-Type: application/json' \
      --header "x-user-email: ${SMOKE_USER_EMAIL}" \
      --data "@${body_file}" \
      "${url}" > "${output_file}"
  elif [[ "${method}" == "GET" ]]; then
    curl --fail --show-error --silent \
      --header "x-user-email: ${SMOKE_USER_EMAIL}" \
      "${url}" > "${output_file}"
  else
    echo "ERROR: unsupported HTTP method: ${method}" >&2
    exit 2
  fi
  head -c 1200 "${output_file}"
  echo
  echo
}

require_command curl
require_command node

printf '{}\n' > "${EMPTY_REQUEST}"
printf '{"practiceSetId":"fe-free-sample-set"}\n' > "${ATTEMPT_REQUEST}"

echo "API_BASE_URL=${API_BASE_URL}"
echo "WEB_BASE_URL=${WEB_BASE_URL}"
echo "SMOKE_USER_EMAIL=${SMOKE_USER_EMAIL}"

request 'API health' GET "${API_BASE_URL}/health"
request 'FE course' GET "${API_BASE_URL}/courses/fe-practice-lab"
request 'FE sample practice set' GET "${API_BASE_URL}/practice-sets/fe-free-sample-set" '' "${PRACTICE_SET_RESPONSE}"
request 'Plans' GET "${API_BASE_URL}/plans"
auth_request 'My entitlements' GET "${API_BASE_URL}/me/entitlements"

node --input-type=module - "${PRACTICE_SET_RESPONSE}" "${GRADE_REQUEST}" "${BOOKMARK_REQUEST}" <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs';

const [, , inputPath, gradeOutputPath, bookmarkOutputPath] = process.argv;
const payload = JSON.parse(readFileSync(inputPath, 'utf8'));
const practiceSet = payload?.data;
const questions = practiceSet?.questions ?? [];

if (!practiceSet?.id || !practiceSet?.slug) {
  throw new Error('Practice set response does not include data.id and data.slug.');
}

if (!Array.isArray(questions) || questions.length === 0) {
  throw new Error('Practice set response does not include gradable questions.');
}

for (const question of questions) {
  if (!question.id) {
    throw new Error('A practice question is missing id.');
  }

  if ('explanation' in question || 'correctChoice' in question || 'isCorrect' in question) {
    throw new Error(`Question ${question.id} exposes grading-only fields before submit.`);
  }

  if (!Array.isArray(question.choices) || question.choices.length === 0) {
    throw new Error(`Question ${question.id} does not include choices.`);
  }

  for (const choice of question.choices) {
    if (!choice.id || !choice.label || !choice.body) {
      throw new Error(`Question ${question.id} includes an incomplete choice.`);
    }

    if ('isCorrect' in choice) {
      throw new Error(`Question ${question.id} exposes choice.isCorrect before submit.`);
    }
  }
}

const answers = questions.map((question) => ({
  questionId: question.id,
  choiceId: question.choices[0].id
}));

writeFileSync(gradeOutputPath, JSON.stringify({ answers }, null, 2));
writeFileSync(bookmarkOutputPath, JSON.stringify({ questionId: questions[0].id }, null, 2));
NODE

request 'FE practice grading' POST "${API_BASE_URL}/practice-sets/fe-free-sample-set/grade" "${GRADE_REQUEST}" "${GRADE_RESPONSE}"

node --input-type=module - "${GRADE_RESPONSE}" <<'NODE'
import { readFileSync } from 'node:fs';

const [, , inputPath] = process.argv;
const payload = JSON.parse(readFileSync(inputPath, 'utf8'));
const result = payload?.data;

if (!result) {
  throw new Error('Grade response does not include data.');
}

if (!Array.isArray(result.results) || result.results.length === 0) {
  throw new Error('Grade response does not include result rows.');
}

if (result.totalCount !== result.results.length) {
  throw new Error('Grade response totalCount does not match result row count.');
}

const calculatedCorrectCount = result.results.filter((row) => row.isCorrect).length;
if (result.correctCount !== calculatedCorrectCount) {
  throw new Error('Grade response correctCount does not match result rows.');
}

if (typeof result.scorePercent !== 'number' || result.scorePercent < 0 || result.scorePercent > 100) {
  throw new Error('Grade response scorePercent is outside the expected range.');
}

for (const row of result.results) {
  if (!row.questionId || !row.submittedChoiceId) {
    throw new Error('A grade result row is missing questionId or submittedChoiceId.');
  }

  if (!row.correctChoice?.id || !row.correctChoice?.label || !row.correctChoice?.body) {
    throw new Error(`Grade result for ${row.questionId} does not include correct choice details.`);
  }

  if (!row.explanation?.bodyMd) {
    throw new Error(`Grade result for ${row.questionId} does not include explanation.`);
  }
}
NODE

auth_request 'Start attempt' POST "${API_BASE_URL}/attempts" "${ATTEMPT_REQUEST}" "${ATTEMPT_RESPONSE}"

node --input-type=module - "${ATTEMPT_RESPONSE}" "${ATTEMPT_ID_FILE}" <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs';

const [, , inputPath, outputPath] = process.argv;
const payload = JSON.parse(readFileSync(inputPath, 'utf8'));
const attempt = payload?.data;

if (!attempt?.id || attempt.status !== 'IN_PROGRESS') {
  throw new Error('Attempt response does not include an in-progress attempt id.');
}

writeFileSync(outputPath, attempt.id);
NODE

ATTEMPT_ID="$(cat "${ATTEMPT_ID_FILE}")"
auth_request 'Save attempt answers' POST "${API_BASE_URL}/attempts/${ATTEMPT_ID}/answers" "${GRADE_REQUEST}" "${SAVE_ANSWERS_RESPONSE}"
auth_request 'Submit attempt' POST "${API_BASE_URL}/attempts/${ATTEMPT_ID}/submit" "${EMPTY_REQUEST}" "${SUBMIT_RESPONSE}"
auth_request 'Attempt result' GET "${API_BASE_URL}/attempts/${ATTEMPT_ID}/result" '' "${ATTEMPT_RESULT_RESPONSE}"
auth_request 'My progress' GET "${API_BASE_URL}/me/progress" '' "${PROGRESS_RESPONSE}"
auth_request 'Add bookmark' POST "${API_BASE_URL}/me/bookmarks" "${BOOKMARK_REQUEST}" "${BOOKMARK_RESPONSE}"
auth_request 'My review items' GET "${API_BASE_URL}/me/review-items" '' "${REVIEW_RESPONSE}"

node --input-type=module - "${SUBMIT_RESPONSE}" "${ATTEMPT_RESULT_RESPONSE}" "${PROGRESS_RESPONSE}" "${REVIEW_RESPONSE}" <<'NODE'
import { readFileSync } from 'node:fs';

const [, , submitPath, resultPath, progressPath, reviewPath] = process.argv;
const submit = JSON.parse(readFileSync(submitPath, 'utf8'))?.data;
const result = JSON.parse(readFileSync(resultPath, 'utf8'))?.data;
const progress = JSON.parse(readFileSync(progressPath, 'utf8'))?.data;
const reviewItems = JSON.parse(readFileSync(reviewPath, 'utf8'))?.data;

if (!submit || submit.status !== 'SUBMITTED' || !Array.isArray(submit.results) || submit.results.length === 0) {
  throw new Error('Submit response does not include submitted results.');
}

if (!result || result.status !== 'SUBMITTED' || result.attemptId !== submit.attemptId) {
  throw new Error('Attempt result response does not match the submitted attempt.');
}

if (!Array.isArray(progress) || progress.length === 0) {
  throw new Error('Progress response does not include any progress snapshot after submit.');
}

if (!Array.isArray(reviewItems) || reviewItems.length === 0) {
  throw new Error('Review response does not include any item after manual bookmark.');
}
NODE

request 'Web FE top' GET "${WEB_BASE_URL}/engineer-license-lab/fe"
request 'Web FE practice' GET "${WEB_BASE_URL}/engineer-license-lab/fe/practice/fe-free-sample-set"
request 'Web FE dashboard' GET "${WEB_BASE_URL}/engineer-license-lab/fe/dashboard"

echo 'Smoke checks completed.'
