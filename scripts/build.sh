#!/bin/bash
set -euo pipefail
[ -f docker-compose.yml ] || exit 1
docker-compose build "$@"
