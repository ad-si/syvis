.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


jsFiles := $(shell find ./source -iname '*.js')
stylFiles := $(shell find ./source -iname '*.styl')
entryPoint := $$(pwd)/source/index.js


node_modules: package.json bun.lock
	bun install
	touch $@


# Build all files for deployment
.PHONY: build
build: \
	dist/index.html \
	dist/index.js \
	dist/screen.css


# Build HTML file for deployment
dist/index.html: public/index.html | dist
	sed 's/{{version}}/$(shell git describe)/' $< > $@


# Build CSS file for deployment
dist/screen.css: node_modules $(stylFiles) | dist
	bunx stylus --compress \
		< source/styles/main.styl \
		> $@


dist/index.js: node_modules source dist/shaven.js | dist
	bun dist $< --outfile $@


dist/shaven.js: node_modules/shaven/dist/browser.js node_modules
	cp $< $@


dist:
	-mkdir -p $@


# Deploy to surge.sh
.PHONY: deploy
deploy: dist
	surge $< syvis.surge.sh


.PHONY: dev
dev: node_modules
	bunx parcel serve --no-autoinstall public/index.html


.PHONY: test
test: node_modules
	bunx tsc --noEmit
	bun test


.PHONY: postinstall
postinstall: node_modules
	cp node_modules/shaven/shaven.js public


.PHONY: clean
clean:
	-rm -r .parcel-cache
	-rm -r dist
	-rm -r node_modules
