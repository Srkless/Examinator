#!/bin/bash

cd examinator-react
npm run build

cp -r dist/* ../examinator-server/src/main/resources/static 

cd ../examinator-server
mvn spring-boot:run
