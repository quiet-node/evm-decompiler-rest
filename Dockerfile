### BUILDER ###
FROM node:alpine AS builder

WORKDIR /usr/src/evm-decompiler-res

COPY . .

COPY package*.json ./

RUN npm install

RUN npx tsc

### HEIMDALL INSTALLER ###
FROM rust:latest AS heimdall-installer

RUN apt-get update \ 
    && apt-get install -y curl 

# get bifrost - heimdall's installation manager
RUN curl -L http://get.heimdall.rs | bash

# run bifrost to install heimdall
RUN ./root/.bifrost/bin/bifrost

### PRODUCTION ###
FROM ubuntu:latest AS production

RUN apt-get update \
    && apt-get install -y nodejs \
    && apt-get install -y git

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/evm-decompiler-res

COPY --from=builder /usr/src/evm-decompiler-res/dist ./server

COPY --from=heimdall-installer /root/.bifrost/bin/heimdall ./heimdall-rs/

COPY --from=builder /usr/src/evm-decompiler-res/node_modules ./server/node_modules

EXPOSE 7639

CMD ["node", "server/server.js"]
