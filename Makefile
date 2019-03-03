dbpass=
ifdef DB_PASS
dbpass=-p$(DB_PASS)
endif

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
	mysqladmin -u root $(dbpass) -f drop test
	mysqladmin -u root $(dbpass) -f create test
