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
	sed 's/{{version}}/$(shell git describe)/' $< > $@

docs/$(hiddenPath)/index.js: $(jsFiles)
	node buildIndex.js | npx minify > $@

docs/$(hiddenPath)/screen.css: $(stylFiles)
	npx stylus --compress \
		< source/styles/main.styl \
		> $@
