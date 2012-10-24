CWD := $(shell pwd)
LIB := $(CWD)/lib

all: clean grunt

clean:
	rm -rf $(CWD)/minify/*.min.js

grunt:
	grunt

test:
	mocha -r should --reporter spec --recursive $(CWD)/test

.PHONY: test
