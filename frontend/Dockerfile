FROM node:24-alpine
WORKDIR /app
COPY ./package*.json ./
RUN npm install
RUN npm install next
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
