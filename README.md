# gowebservice

Boierplate for a web service written in go with REST APIs and db access


docker image build and push:
  eval $(minikube docker-env)
  docker build . -t yuval-go:v1
  docker login --username=rimar
  docker tag 604752e6e264 rimar/gowebservice:v1
  docker push rimar/gowebservice

