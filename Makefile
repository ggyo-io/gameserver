default: all

all:
	go build .

clean:
	rm gameserver

run:
	./gameserver

deps:
	go get -d ./...

db:
	mysqladmin -u root -f drop test
	mysqladmin -u root -f create test
