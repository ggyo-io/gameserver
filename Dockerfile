#
# React GUI
#
FROM docker.io/library/node as ui-env
WORKDIR ui-build
COPY ./ ./
RUN make ui

#
# lc0
#
FROM docker.io/library/ubuntu as leela-env
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get -yq install \
    gcc g++ clang ninja-build pkg-config \
    python3 python3-pip \
    git
RUN pip3 install meson --user
RUN git clone https://github.com/LeelaChessZero/lc0.git
WORKDIR lc0
RUN CC=clang CXX=clang++ INSTALL_PREFIX=~/.local ./build.sh

#
# Stockfish 
#
FROM docker.io/library/golang AS stockfish-env
RUN git clone https://github.com/official-stockfish/Stockfish.git
WORKDIR Stockfish/src
RUN if [ "$(uname -m)" = "aarch64" ]; \
    then arch=armv8; \
    else arch=x86-64; \
    fi; \
    make build ARCH=$arch

#
# Gameserver
#
FROM docker.io/library/golang AS gameserver-env
WORKDIR server-build
COPY ./ ./
RUN make server

#
# final stage - runtime image
#
FROM docker.io/library/ubuntu AS run-env
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
