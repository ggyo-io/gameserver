#
# Makefile for ggyo.io gameserver
#
IMAGE=ggyo
GKE_IMAGE=gcr.io/$(GCP_PROJECT)/$(IMAGE)
BuildDate = $(shell date -u +'%Y-%m-%dT%H:%M:%SZ')
Commit = $(shell git rev-parse --short HEAD)
TAG=$(shell git log -1 --pretty=format:"%H")
docker-context=docker.context.$$PPID

dbpass=
ifdef DB_PASS
dbpass=-p$(DB_PASS)
endif

#
# Local build
#
all: ui server

clean: ui-clean server-clean docker-clean

npm-deps:
	cd ui && npm install --save "@babel/core" "@babel/polyfill" "@babel/preset-env" "@babel/preset-react" "bootstrap" "bootswatch" "easy-peasy" "ghooks" "jquery" "lodash" "lodash.isequal" "popper.js" "react" "react-bootstrap" "react-dom" "react-resize-detector" "react-router-bootstrap" "react-router-dom" "react-websocket"
	cd ui && npm install --save-dev "@babel/plugin-proposal-class-properties" "@babel/plugin-transform-runtime" "@babel/runtime" "autoprefixer" "babel-loader" "clean-webpack-plugin" "copy-webpack-plugin" "css-loader" "favicons-webpack-plugin" "file-loader" "html-loader" "html-webpack-plugin" "mini-css-extract-plugin" "node-sass" "css-minimizer-webpack-plugin" "path" "postcss-loader" "react-hook-form" "react-svg-loader" "sass-loader" "style-loader" "svg-inline-loader" "svg-url-loader" "terser-webpack-plugin" "url-loader" "webpack" "webpack-cli" "webpack-dev-server" "webpack-manifest-plugin"

ui:
	cd ui && npm install && npm run dev
.PHONY: ui

ui-clean:
	rm -rf ui/dist ui/node_modules

docker-clean:
	rm -rf docker.context.*

server:
	cd server && go build .
.PHONY: server

server-clean:
	rm -f server/gameserver

#
# Docker image and K8S deployment
#
image:
	@rm -rf $(docker-context)
	@mkdir -p $(docker-context)
	@git clone . $(docker-context)
	@docker build --build-arg tag=$(TAG) -t $(IMAGE):$(TAG) --progress plain $(docker-context)
	@docker tag $(IMAGE):$(TAG) $(IMAGE):latest
	@docker tag $(IMAGE):latest $(GKE_IMAGE):$(TAG)
	@docker tag $(GKE_IMAGE):$(TAG) $(GKE_IMAGE):latest
	@rm -rf $(docker-context)
	@echo ✅ BuildDate $(BuildDate) Image $(GKE_IMAGE) Tag $(TAG) Commit $(Commit)


ucitest:
	docker run  $(GKE_IMAGE):$(TAG) ./lc0
	docker run  $(GKE_IMAGE):$(TAG) ./stockfish uci

push: image ucitest
	@docker push $(GKE_IMAGE):$(TAG)
	@docker push $(GKE_IMAGE):latest

cluster-info:
	@kubectl get nodes -o wide

deploy:
	@kubectl apply -f k8s/mail-secret.yaml
	@kubectl apply -f k8s/mysql-pvc.yaml
	@kubectl apply -f k8s/mysql-deployment.yaml
	@kubectl wait --for=condition=ready --timeout=60s pod -l app=ggyo,component=db
	@kubectl apply -f k8s/gs-deployment.yaml
	@kubectl wait --for=condition=ready --timeout=60s pod -l app=ggyo,component=gs
	@kubectl apply -f k8s/gs-svc.yaml

uninstall: cluster-info
	@-kubectl delete -f k8s/gs-svc.yaml
	@-kubectl delete -f k8s/gs-deployment.yaml
	@-kubectl delete -f k8s/mail-secret.yaml
	@-kubectl delete -f k8s/mysql-deployment.yaml
	@-kubectl delete -f k8s/mysql-pvc.yaml

delete-deploy:
	@-kubectl delete -f k8s/gs-deployment.yaml

redeploy: delete-deploy deploy
