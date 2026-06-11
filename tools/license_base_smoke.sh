#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:4000/v1}"
WEB_BASE_URL="${WEB_BASE_URL:-http://localhost:3000}"
TMP_DIR="${TMPDIR:-/tmp}"
PRACTICE_SET_RESPONSE="${TMP_DIR}/license-base-practice-set.json"
GRADE_REQUEST="${TMP_DIR}/license-base-grade-request.json"
SMOKE_RESPONSE="${TMP_DIR}/license-base-smoke-response.json"

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
  else
    curl --fail --show-error --silent "${url}" > "${output_file}"
  fi
  cat "${output_file}"
  echo
}

request 'API health' GET "${API_BASE_URL}/health"
request 'FE course' GET "${API_BASE_URL}/courses/fe-practice-lab"
request 'FE sample practice set' GET "${API_BASE_URL}/practice-sets/fe-free-sample-set" '' "${PRACTICE_SET_RESPONSE}"

node --input-type=module - "${PRACTICE_SET_RESPONSE}" "${GRADE_REQUEST}" <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs';

const [, , inputPath, outputPath] = process.argv;
const payload = JSON.parse(readFileSync(inputPath, 'utf8'));
const questions = payload?.data?.questions ?? [];
const answers = questions
  .map((question) => ({ questionId: question.id, choiceId: question.choices?.[0]?.id }))
  .filter((answer) => Boolean(answer.questionId && answer.choiceId));

if (answers.length === 0) {
  throw new Error('No gradable questions were returned from the sample practice set.');
}

writeFileSync(outputPath, JSON.stringify({ answers }));
NODE

request 'FE practice grading' POST "${API_BASE_URL}/practice-sets/fe-free-sample-set/grade" "${GRADE_REQUEST}"
request 'Web FE top' GET "${WEB_BASE_URL}/engineer-license-lab/fe"
request 'Web FE practice' GET "${WEB_BASE_URL}/engineer-license-lab/fe/practice/fe-free-sample-set"

echo 'Smoke checks completed.'
