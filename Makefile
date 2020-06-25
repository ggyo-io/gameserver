IMAGE=ggyo
GKE_IMAGE=gcr.io/$(GCP_PROJECT)/$(IMAGE)
BuildDate = $(shell date -u +'%Y-%m-%dT%H:%M:%SZ')
Commit = $(shell git rev-parse --short HEAD)
docker-context=docker.context.$$PPID
TAG=$(shell git log -1 --pretty=format:"%H")

dbpass=
ifdef DB_PASS
dbpass=-p$(DB_PASS)
endif

.PHONY: all clean run db
all: build

npm-build:
	cd src && npm i && npm run build

build:
	go build .

clean:
	rm -f gameserver

run: build
	./gameserver

db-drop:
	mysqladmin -u root $(dbpass) -f drop chess

db-new:
	mysqladmin -u root $(dbpass) -f create chess

container:
	rm -rf $(docker-context)
	mkdir -p $(docker-context)
	git clone . $(docker-context)
	docker build --build-arg tag=$(TAG) -t $(IMAGE):$(TAG) $(docker-context)
	docker tag $(IMAGE):$(TAG) $(IMAGE):latest
	docker tag $(IMAGE):latest $(GKE_IMAGE)
	rm -rf $(docker-context)


push: container
	docker push $(GKE_IMAGE)

gke-redeploy: push
	kubectl get nodes
	kubectl delete -f k8s/gke/gs-deployment.yaml
	kubectl apply -f k8s/gke/gs-deployment.yaml


local:

