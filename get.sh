#!/bin/sh

rm -rf .git
composer update && cd app && mkdir themes
git clone https://github.com/Automattic/_s.git && rm -rf _s/.git && mv _s themes/
cd themes/_s
mkdir -p dev/styles
mkdir -p dev/images
mkdir -p dev/scripts
mkdir scripts
mkdir images
mv ../../../package.json . && mv ../../../gulpfile.js . && mv ../../../bower.json .
npm install && bower install && gulp build
cd ../../../
