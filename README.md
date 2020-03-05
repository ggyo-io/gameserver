# Game Server


Generic game server for turn based games such as chess
Local build and run:
make run

Docker build: 
docker image build and push:
  eval $(minikube docker-env)
  docker build . -t yuval-go:v1
  docker login --username=rimar
  docker tag 604752e6e264 rimar/gowebservice:v1
  docker push rimar/gowebservice

