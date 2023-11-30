#!/bin/sh
cd ~/Desktop/Projects/Other' 'Projects/hygraph-apps || exit

rm -f type.d.ts tsconfig.json tailwind.config.ts README.md postcss.config.js package.json package-lock.json next.config.js next-env.d.ts .gitignore .eslintrc.json .env.production .env.development
rm -r -f app components constants static utils

cd ~/Desktop/Projects/wf-hygraph-cms || exit

cp type.d.ts tsconfig.json tailwind.config.ts README.md postcss.config.js package.json package-lock.json next.config.js next-env.d.ts .gitignore .eslintrc.json .env.production .env.development ~/Desktop/Projects/Other' 'Projects/hygraph-apps
cp -R app components constants static utils ~/Desktop/Projects/Other' 'Projects/hygraph-apps

cd ~/Desktop/Projects/Other' 'Projects/hygraph-apps || exit
sleep 500ms

git add .
message="feat: code update$(date "+%Y%m%d-%H%M%S")"
echo "${message}"
git commit -m "${message}"
git push