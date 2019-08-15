#!/bin/bash

echo $PWD

cd test
file_list=$(ls -1 | grep .js)
cd ..
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
