hiddenPath := ErZoPhsMTcDvGT9pZswo
targetPath := docs/$(hiddenPath)
jsFiles := $(shell find ./source -iname '*.js')
stylFiles := $(shell find ./source -iname '*.styl')
entryPoint := $$(pwd)/source/index.js


# Build all files for deployment
.PHONY: all
all: \
	$(targetPath)/index.html \
	$(targetPath)/index.js \
	$(targetPath)/screen.css \
	docs/CNAME


# Build HTML file for deployment
docs/$(hiddenPath)/index.html: public/index.html | docs/ErZoPhsMTcDvGT9pZswo
	sed 's/{{version}}/$(shell git describe)/' $< > $@


# Build JavaScript file for deployment
docs/$(hiddenPath)/index.js: node_modules build $(jsFiles) | docs/ErZoPhsMTcDvGT9pZswo
	node build/buildIndex.js > $@
# 	node build/buildIndex.js > | npx minify > $@


# Build CSS file for deployment
docs/$(hiddenPath)/screen.css: $(stylFiles) | docs/ErZoPhsMTcDvGT9pZswo
	npx stylus --compress \
		< source/styles/main.styl \
		> $@


node_modules:
	yarn install

build: source
	yarn flow-remove-types \
		--out-dir $@ \
		$<


docs/ErZoPhsMTcDvGT9pZswo:
	-mkdir -p $@


docs/CNAME: | docs/ErZoPhsMTcDvGT9pZswo
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



.PHONY: clean
clean:
	-rm -r node_modules
	-rm -r build
	-rm -r docs
