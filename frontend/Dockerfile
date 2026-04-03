from node:alpine

workdir /app

copy ./src ./src
copy ./index.html ./package.json ./package-lock.json ./vite.config.js .

run npm install && npm run build

cmd npm run preview -- --host 0.0.0.0 --port 3000
