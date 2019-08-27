IMAGE=gs
GKE_IMAGE=gcr.io/deductive-reach-207607/gs
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
	go get github.com/gorilla/handlers
	go get github.com/gorilla/mux
	go get github.com/gorilla/sessions
	go get github.com/jinzhu/gorm/dialects/mysql
	go get github.com/gorilla/websocket
	go get github.com/jinzhu/inflection
	go get github.com/satori/go.uuid
	go get github.com/notnil/chess

db:
	mysqladmin -u root $(dbpass) -f drop chess
	mysqladmin -u root $(dbpass) -f create chess

container:
	docker build -t $(IMAGE):$(TAG) .
	docker tag $(IMAGE):$(TAG) $(IMAGE):latest
	docker tag $(IMAGE):latest $(GKE_IMAGE)


push: container
	docker push $(GKE_IMAGE)

gke:


local:

