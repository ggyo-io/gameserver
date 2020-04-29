# Game Server


Generic game server template for React with Routing and State managment

install:
1. npm install or yarn install
2. npm start or yarn start (automatically open template on port 9100)
3 node version 13



_____________________________________________________________________
Local build and run:
make run

Docker build: 
docker image build and push:
  eval $(minikube docker-env)
  docker build . -t yuval-go:v1
  docker login --username=rimar
  docker tag 604752e6e264 rimar/gowebservice:v1
  docker push rimar/gowebservice

