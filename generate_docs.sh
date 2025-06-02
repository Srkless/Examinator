#!/bin/bash

cd examinator-server
mvn javadoc:javadoc

if [ $? -eq 0 ]; then
  xdg-open target/site/apidocs/index.html
  cd ..
else
  echo "JavaDoc generation failed." >&2
  cd ..
  exit 1
fi
