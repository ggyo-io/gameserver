FROM golang:alpine AS build-env
RUN apk add -q --update \
    && apk add -q \
            bash \
            git \
            curl \
            g++ \
            libpcap-dev \
            make \
    && rm -rf /var/cache/apk/*


# RUN go get -u github.com/google/gopacket

COPY *.go ./
COPY Makefile .

# RUN sed -i 's/#cgo linux LDFLAGS: -lpcap/#cgo linux LDFLAGS: \/usr\/lib\/libpcap.a/g' src/github.com/google/gopacket/pcap/pcap.go
RUN make deps
RUN go build -o gameserver

# final stage
FROM alpine
WORKDIR /app
COPY ./static/ /app/static/
COPY ./tmpl/ /app/tmpl/
COPY --from=build-env /go/gameserver /app/
CMD ./gameserver
