#!/bin/bash   
set -e
browserify index.js -t [babelify --presets babel-preset-es2015] | uglifyjs > bundle.js
