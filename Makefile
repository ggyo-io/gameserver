IMAGE=gs
TAG = $(shell git describe --abbrev=0)
BuildDate = $(shell date -u +'%Y-%m-%dT%H:%M:%SZ')
Commit = $(shell git rev-parse --short HEAD)

dbpass=
ifdef DB_PASS
dbpass=-p$(DB_PASS)
endif

.PHONY: all clean run deps db
all: build

build:
	go build .

clean:
	rm -f gameserver

run: build
	./gameserver

deps:
	go get -d ./...

db:
	mysqladmin -u root $(dbpass) -f drop test
	mysqladmin -u root $(dbpass) -f create test

container:
	docker build -t $(IMAGE):$(TAG) .
	docker tag $(IMAGE):$(TAG) $(IMAGE):latest
	docker tag $(IMAGE):latest gcr.io/deductive-reach-207607/gs
