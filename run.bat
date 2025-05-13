@echo off
echo Building React app...

cd examinator-react
call npm run build

echo Copying React build to Spring Boot static directory...

xcopy /E /Y /I dist\* ..\examinator-server\src\main\resources\static\

cd ..\examinator-server

echo Starting Spring Boot server...
call mvn spring-boot:run
