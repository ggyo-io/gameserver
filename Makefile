default: all

all:
	go build .

clean: 
	rm gameserver

run:
	./gameserver

deps:
	go get -d ./...