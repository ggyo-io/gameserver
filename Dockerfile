#
# React GUI
#
FROM node as npm-env
WORKDIR npm-build
COPY package*.json webpack.config.js ./
COPY src/  ./src/
RUN npm i && npm run build

#
# lc0
#
FROM ubuntu as leela-env

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get -yq install \
    gcc-8 g++-8 clang-6.0 ninja-build pkg-config \
    python3 python3-pip \
    git
RUN pip3 install meson --user
RUN git clone https://github.com/LeelaChessZero/lc0.git
WORKDIR lc0
RUN CC=clang-6.0 CXX=clang++-6.0 INSTALL_PREFIX=~/.local ./build.sh


#
# stockfish and gameserver
#
FROM golang AS build-env

# Stockfish
RUN git clone https://github.com/official-stockfish/Stockfish.git
WORKDIR Stockfish/src
RUN make build ARCH=x86-64
WORKDIR ../..

# Gameserver
WORKDIR       ./gameserver
COPY *.go     ./
COPY go.*     ./
COPY Makefile ./
COPY notnil/  ./notnil
RUN go build .

# final stage - small image
FROM ubuntu
ARG LC0_NETWORK_URL=https://training.lczero.org/get_network?sha=47e3f899519dc1bc95496a457b77730fce7b0b89b6187af5c01ecbbd02e88398

WORKDIR /app
COPY ./tmpl/ /app/tmpl/
COPY --from=npm-env   /npm-build/dist /app/dist
COPY --from=build-env /go/gameserver /app/
COPY --from=build-env /go/Stockfish/src/stockfish /app/
COPY --from=leela-env /lc0/build/release/lc0 /app/
RUN mkdir networks
ADD $LC0_NETWORK_URL /app/networks/

CMD ./gameserver
