#!/bin/bash

echo $PWD

file_list=$(ls -1 test/*.js)
requires=""

for f in $file_list ; do
  echo "Processing $(basename ${f})"
  requires=$requires"require('../$(basename ${f})');"$'\n'
done

# echo $requires
cat > test/browser/index.js << EOF
// This is a generated file. Do not modify by hand
'use strict';
${requires}
EOF
