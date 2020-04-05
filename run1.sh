docker run -it --rm --volume ${PWD}:/app --name office-api --workdir /app --publish 3000:3000 node:10.15.0 npm run dev
