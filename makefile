.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


jsFiles := $(shell find ./source -iname '*.js')
stylFiles := $(shell find ./source -iname '*.styl')
entryPoint := $$(pwd)/source/index.js


node_modules: package.json bun.lock
	if test ! -d $@; then bun install --force; fi


# Build all files for deployment
.PHONY: all
all: \
	build/index.html \
	build/index.js \
	build/screen.css \
	build/CNAME


# Build HTML file for deployment
build/index.html: public/index.html | build
	sed 's/{{version}}/$(shell git describe)/' $< > $@


# Build CSS file for deployment
build/screen.css: node_modules $(stylFiles) | build
	bunx stylus --compress \
		< source/styles/main.styl \
		> $@


build/index.js: node_modules source build/shaven.js | build
	bun build $< --outfile $@


build/shaven.js: node_modules/shaven/build/browser.js node_modules
	cp $< $@


build:
	-mkdir -p $@


build/CNAME: | build
	echo "syvis.surge.sh" > $@


# Deploy to surge.sh
.PHONY: deploy
deploy:
	# Execute `cd /syvis && surge` once the docker container runs
	docker run \
		--interactive \
		--tty \
		--volume "$$PWD":/syvis \
		--rm andthensome/alpine-surge-bash


.PHONY: dev
dev: node_modules
	bunx parcel serve public/index.html


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
	-rm -r build
	-rm -r dist
	-rm -r node_modules
