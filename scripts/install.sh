#!/bin/bash

OK="OK"
ERROR="ERROR"
yarnRegistry="https://registry.yarnpkg.com"
npmRegistry="https://registry.npmjs.org"

yarnStatus=`curl $yarnRegistry -k -s -f -o /dev/null && echo $OK || echo $ERROR`
npmStatus=`curl $npmRegistry -k -s -f -o /dev/null && echo $OK || echo $ERROR`

echo "yarn registry status: $yarnStatus"
echo "npm registry status: $yarnStatus"

if [ $yarnStatus = $OK ]; then
   yarn install --cwd ../

else if [ $npmStatus = $OK ]; then
   npm install

else
   echo "Network failure"

fi
fi
