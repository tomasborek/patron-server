FROM node:18-alpine


WORKDIR /app

COPY package*.json ./ 

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx prisma db seed

CMD ["npm", "run", "start"]

EXPOSE 3030