.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


node_modules: package.json bun.lock
	bun install
	touch $@


# Build all files for deployment
.PHONY: build
build: node_modules
	bunx vite build


# Deploy to surge.sh
.PHONY: deploy
deploy: build
	surge dist syvis.surge.sh


.PHONY: dev
dev: node_modules
	bunx vite


.PHONY: test
test: node_modules
	bunx tsc --noEmit
	bun test


.PHONY: postinstall
postinstall: node_modules
	cp node_modules/shaven/shaven.js public


.PHONY: clean
clean:
	-rm -r dist
	-rm -r node_modules
