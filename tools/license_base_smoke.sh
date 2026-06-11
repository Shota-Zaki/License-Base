#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:4000/v1}"
WEB_BASE_URL="${WEB_BASE_URL:-http://localhost:3000}"

request() {
  local label="$1"
  local method="$2"
  local url="$3"
  local body="${4:-}"

  echo "==> ${label}"
  if [[ "${method}" == "POST" ]]; then
    curl --fail --show-error --silent \
      --request POST \
      --header 'Content-Type: application/json' \
      --data "${body}" \
      "${url}" > /tmp/license-base-smoke-response.json
  else
    curl --fail --show-error --silent "${url}" > /tmp/license-base-smoke-response.json
  fi
  cat /tmp/license-base-smoke-response.json
  echo
}

request 'API health' GET "${API_BASE_URL}/health"
request 'FE course' GET "${API_BASE_URL}/courses/fe-practice-lab"
request 'FE sample practice set' GET "${API_BASE_URL}/practice-sets/fe-free-sample-set"
request 'FE practice grading' POST "${API_BASE_URL}/practice-sets/fe-free-sample-set/grade" '{"answers":[]}'
request 'Web FE top' GET "${WEB_BASE_URL}/engineer-license-lab/fe"
request 'Web FE practice' GET "${WEB_BASE_URL}/engineer-license-lab/fe/practice/fe-free-sample-set"

echo 'Smoke checks completed.'
