#!/bin/bash

set -e

TIMESTAMP=$(date "+%Y-%m-%d_%H-%M-%S")

mkdir -p log

LOG_FILE="log/log-$TIMESTAMP.log"

touch "$LOG_FILE"

echo "🔧 Building React app..."
cd examinator-react
npm run build > "../$LOG_FILE" 2>&1

echo "📦 Copying React build to Spring Boot static directory..."
rm -rf ../examinator-server/src/main/resources/static/*
cp -r dist/* ../examinator-server/src/main/resources/static/

cd ../examinator-server

echo "🚀 Starting Spring Boot server..."
echo "📝 Logging to $LOG_FILE"

nohup mvn spring-boot:run > "../$LOG_FILE" 2>&1 &

PID=$!

echo "🚀 Spring Boot server started with PID: $PID"
