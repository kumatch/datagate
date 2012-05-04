CWD := $(shell pwd)
LIB := $(CWD)/lib
BUILD := $(CWD)/dist


all: init browserbuild grunt clean

clean:
	rm -rf $(BUILD)

init:
	rm -rf $(BUILD)
	mkdir -p $(BUILD)

browserbuild:
	browserbuild -b $(LIB)/ -m datagate -g datagate $(LIB) > $(BUILD)/datagate.js

grunt:
	grunt
