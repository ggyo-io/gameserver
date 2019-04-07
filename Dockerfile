# FROM python:3.7-alpine as leela-env
# RUN apk add -q --update \
#     && apk add -q \
#             bash \
#             git \
#             curl \
#             g++ \
#             libpcap-dev \
#             make \
#     && rm -rf /var/cache/apk/*

# # Leela
# RUN pip3 install meson
# RUN pip3 install setuptools
# RUN pip3 install pyautogui
# RUN pip3 install ninja
# RUN git clone https://github.com/LeelaChessZero/lc0.git
# WORKDIR lc0
# RUN ./build.sh

FROM golang:alpine AS build-env
RUN apk add -q --update \
    && apk add -q \
            bash \
            git \
            curl \
            g++ \
            make \
    && rm -rf /var/cache/apk/*

# Stockfish
RUN git clone https://github.com/official-stockfish/Stockfish.git
WORKDIR Stockfish/src
RUN make build ARCH=x86-64
WORKDIR ../..

# Gameserver
WORKDIR ./gameserver
COPY *.go ./
COPY Makefile ./
RUN make deps
RUN make

# final stage - small image
FROM alpine
RUN apk add -q --update \
    && apk add -q \
            libstdc++ \
    && rm -rf /var/cache/apk/*

WORKDIR /app
COPY ./static/ /app/static/
COPY ./tmpl/ /app/tmpl/
COPY --from=build-env /go/gameserver /app/
COPY --from=build-env /go/Stockfish/src/stockfish /app/
CMD ./gameserver
