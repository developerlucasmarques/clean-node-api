FROM node:21
WORKDIR /usr/src/clean-node-api
COPY ./package.json .
RUN npm install --omit=dev --ignore-scripts
COPY ./dist ./dist
EXPOSE 5000
CMD npm start