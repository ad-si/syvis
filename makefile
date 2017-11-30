hiddenPath := ErZoPhsMTcDvGT9pZswo
targetPath := docs/$(hiddenPath)
jsFiles := $(shell find ./source -iname '*.js')
visualizers := $(shell find ./source/visualizers -iname '*.js')
stylFiles := $(shell find ./source -iname '*.styl')
entryPoint := $$(pwd)/source/index.js

all: \
	$(targetPath)/index.html \
	$(targetPath)/index.js \
	$(targetPath)/screen.css


docs/$(hiddenPath)/index.html: public/index.html
	cp $< $@

docs/$(hiddenPath)/index.js: $(jsFiles)
	node buildIndex.js > $@

docs/$(hiddenPath)/screen.css: $(stylFiles)
	npx stylus --compress \
		< source/styles/neo.styl \
		> $@
