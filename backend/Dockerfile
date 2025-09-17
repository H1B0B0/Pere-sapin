FROM node:24-alpine
WORKDIR /app
COPY ./package*.json ./
RUN npm install
RUN npm install nest
COPY . .
RUN npm run build
EXPOSE 5042
CMD ["npm", "run", "start"]
