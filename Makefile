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
	docker build .
