#
# React GUI
#
FROM node as ui-env
WORKDIR ui-build
COPY ./ ./
RUN make ui

#
# lc0
#
FROM ubuntu as leela-env
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get -yq install \
    gcc-8 g++-8 clang-6.0 ninja-build pkg-config \
    python3 python3-pip \
    libeigen3-dev \
    git
RUN pip3 install meson --user
RUN git clone https://github.com/LeelaChessZero/lc0.git
WORKDIR lc0
RUN CC=clang-6.0 CXX=clang++-6.0 INSTALL_PREFIX=~/.local ./build.sh


#
# Stockfish 
#
FROM golang AS stockfish-env
RUN git clone https://github.com/official-stockfish/Stockfish.git
WORKDIR Stockfish/src
RUN make build ARCH=x86-64

#
# Gameserver
#
FROM golang AS gameserver-env
WORKDIR server-build
COPY ./ ./
RUN make server

#
# final stage - runtime image
#
FROM ubuntu AS run-env
ARG LC0_NETWORK_URL=https://training.lczero.org/get_network?sha=47e3f899519dc1bc95496a457b77730fce7b0b89b6187af5c01ecbbd02e88398
ARG tag

WORKDIR /app
RUN echo $tag > tag
COPY --from=ui-env   /ui-build/ui/dist /app/dist
COPY --from=gameserver-env /go/server-build/server/gameserver /app/
COPY --from=stockfish-env /go/Stockfish/src/stockfish /app/
COPY --from=leela-env /lc0/build/release/lc0 /app/
RUN mkdir networks
ADD $LC0_NETWORK_URL /app/networks/

CMD ./gameserver
