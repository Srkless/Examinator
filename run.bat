@echo off
setlocal enabledelayedexpansion

for /f "tokens=2 delims==" %%I in ('"wmic os get localdatetime /value"') do set datetime=%%I
set timestamp=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%-%datetime:~10,2%-%datetime:~12,2%

if not exist "log" mkdir log

set LOG_FILE=log\log-%timestamp%.log

echo 🔧 Building React app...
cd examinator-react
npm run build > "..\%LOG_FILE%" 2>&1

echo 📦 Copying React build to Spring Boot static directory...
rmdir /s /q ..\examinator-server\src\main\resources\static
xcopy /e /i /h dist\* ..\examinator-server\src\main\resources\static\

cd ..\examinator-server

echo 🚀 Starting Spring Boot server...
echo 📝 Logging to %LOG_FILE%

start /b "" mvn spring-boot:run > "..\%LOG_FILE%" 2>&1

echo 🚀 Spring Boot server started
pause
