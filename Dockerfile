FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --chown=node:node package.json app.js ./

USER node
EXPOSE 3000

CMD ["npm", "start"]
