# Syvis

[![Build Status][]][syvis]

[Build Status]:
  https://travis-ci.com/adius/feram_syvis.svg?token=o8saMqgg3F8qbjfsyJiu&branch=master
[syvis]: https://travis-ci.com/adius/feram_syvis

Syntax visualization instead of syntax highlighting.

A graphical representation of code.

Bring Javascript code reviews to the next level.
Stop dealing with badly formatted syntax and start reasoning about semantic.

- Formatting independent
- Partially language agnostic
- Better overview
- Simplifies reasoning over code


## Usage

```shell
npm start -- path/to/javascript/file.js
```


## Development

```shell
chokidar source/styles \
  --initial \
  --polling \
  --command 'stylus < source/styles/neo.styl > public/screen.css'
```


## User Interface

- https://haltu.github.io/muuri


---

## Related

- [Barista] - Implementation toolkit for AST editors.
- [Citrus] - Programming language and user interface toolkit.
  (https://youtu.be/YIlYJCwIXLs)
- [Codemirror Blocks] - Drag-and-drop editing for functional languages.
- [CodeWorld] - Educational computer programming environment using Haskell.
- [Future Programming Webassembly Life After JavaScript][FWA]
- [Glance] - Visual syntax for Haskell.
- [Lamdu] -
- [Mbeddr]
- [Moonchild] - Projection editor (https://vimeo.com/97711824).
- [Programming Beyond Text: The Parsing Problem][Parsing Problem]
- [Treeline] - Develop backend apps in your web browser.
- [Unison]

[Barista]: https://www.youtube.com/watch?v=gAxjUh9d2YI
[Citrus]: https://github.com/andyjko/citrus-barista
[CodeWorld]: https://github.com/google/codeworld
[FWA]: http://sitepoint.com/future-programming-webassembly-life-after-javascript
[Glance]: https://github.com/rgleichman/glance
[Lamdu]: http://www.lamdu.org
[Mbeddr]: http://mbeddr.com
[Moonchild]: https://github.com/harc/moonchild
[Parsing Problem]: http://joshondesign.com/2016/06/13/the_parsing_problem
[Treeline]: https://treeline.io
[Unison]: http://unisonweb.org
[Codemirror Blocks]: http://bootstrapworld.github.io/codemirror-blocks


### Visual Programming

- [Node-RED] - Flow-based programming for the Internet of Things

[Node-RED]:https://nodered.org


### Mobile Coding

Links on how to code on mobile/touch devices

- [Working Copy] - A Git client for iOS that clones, edits, commits, pushes, …
- [Ask HN: Who writes code on smartphones?][Ask HN]

[Working Copy]: http://workingcopyapp.com
[Ask HN]: https://news.ycombinator.com/item?id=11697029


### Code Visualization

- [js2flowchart] - Convert JavaScript code into SVG flowchart.
- [flux] - Visualize Haskell programs as data-flow diagrams.

[js2flowchart]: https://github.com/Bogdan-Lyashenko/js-code-to-svg-flowchart
[flux]: https://www.uni-ulm.de/en/in/pm/research/projects/flux/


## Talks

- [The Future of Programming][future-of-programming]

[future-of-programming]: https://vimeo.com/71278954


## TODO

- Search for more information about "Projection editor"
- Checkout marco röders project "codb"
- https://stackoverflow.com/questions/26848419/syntax-highlighting-with-text-style-instead-of-colors
- https://softwareengineering.stackexchange.com/questions/87077/how-can-a-code-editor-effectively-hint-at-code-nesting-level-without-using-ind
- jGRASP
- http://www.andrewbragdon.com/codebubbles_site.asp
- https://www.touchdevelop.com
- https://harc.github.io/seymour-live2017
- `lively.openComponentInWindow('my-component')`
- `lively.html.registerButtons`
- Make histogram of line lengths => find 90% percentile and use for formatting
- Hierarchy of code interaction:
  1. Reading
  2. Patches (e.g. change a string)
  3. Minor changes (e.g. write a function)
  4. Major changes (e.g. restructure code)
- https://meemoo.org/

  => Code editor should be optimized for this interaction pattern
- Minimap
- Feature flags
- https://github.com/livecode/livecode


### Visual Programming Languages for Haskell or Haskell-like Languages

- [Visual Haskell](http://ptolemy.eecs.berkeley.edu/~johnr/papers/thesis.html)
- [Viskell](https://github.com/viskell/viskell)
- [FunBlocks](http://stefanj.me/funblocks/)
- The Gem Cutter – A Graphical Tool for Creating Functions
  in the Strongly-typed Lazy Functional Language CAL
  ([pdf](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.133.428&rep=rep1&type=pdf))
- Vital ([archive.org link](http://web.archive.org/web/20140715033114/http://www.cs.kent.ac.uk/projects/vital))
- A Visual Programming Environment for Functional Languages
  ([pdf](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.85.1317&rep=rep1&type=pdf))


### Other Functional Visual Programming Languages

- [Luna](http://www.luna-lang.org/)
- [Sifflet](http://pages.iu.edu/~gdweber/software/sifflet/home.html)
- [Autodesk 3ds Max Creation Graph](
  http://area.autodesk.com/blogs/the-3ds-max-blog/mcg-visual-functional-programming)
- [Skov](https://github.com/nicolas-p/skov)


### Links, Papers and Resources

- Instant playful access to serious programming for non-programmers with a visual functional programming language
  ([pdf](http://www.cs.ru.nl/P.Achten/IFL2013/symposium_proceedings_IFL2013/ifl2013_submission_8.pdf))
- The “Physics” of Notations: Towards a Scientific Basis for Constructing Visual Notations in Software Engineering_
  ([pdf](http://dev.dama.org.au/wp-content/uploads/2013/02/IEEE-TSE-35-5-November-December-2009-The-Physics-of-Notations-D.L.Moody_.pdf))
- I know what you did last summer: an investigation of how developers spend their time
  ([pdf](http://www.inf.usi.ch/faculty/lanza/Downloads/Mine2015b.pdf))
  ([papers that cite it](https://scholar.google.com/scholar?cites=14130154900663939563&as_sdt=2005&sciodt=0,5&hl=en))
- [Evidence-based programming language design](https://www.quorumlanguage.com/evidence.html)


### People

- [Monoid Musician] - I wish I had time and skillz to make my AST editor
  actually happen (https://github.com/MonoidMusician/purescript-datagen)
- [Andres J. Ko] - Associate Professor at University of Washington
- [Patrick Dubory] - Programmer and interaction designer based in Munich.

[Monoid Musician]: monoidmusician
[Patrick Dubory]: https://dubroy.com
[Andres J. Ko]: https://faculty.washington.edu/ajko
