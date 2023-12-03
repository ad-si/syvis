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

Start development environment:

```shell
docker run \
  --interactive \
  --tty \
  --volume "$PWD":/syvis \
  --rm \
  node bash
```

```shell
chokidar source/styles \
  --initial \
  --polling \
  --command 'stylus < source/styles/main.styl > public/screen.css'
```


## User Interface

- [muuri] - Responsive, sortable, filterable and drag-able grid layouts

[muuri]: https://haltu.github.io/muuri


## Advantages Over Normal Code

1. Easier readable - Humans are made to recognize visual patterns.
1. Customizable
  - Consumer is not dependent on the author to choose appropriate formatting
  - Uncommon formatting preferences can be satisfied
1. Less error prone -
  Erroneous and dangerous code can be additionally highlighted
1. Better storage possibilities
  - Code could be stored and transmitted in a minified format
    (all insignificant whitespace removed)
1.


## Abstract

In most programming languages
the semantic meaning of a program is disconnected from
the formatting of the code and the naming of variables and keywords.
This means semantically equivalent code can be written in a vastly
different textual representations.
This poses problems in terms of readability and understandability
of code.
Even minor modifications of punctuation or formatting in comparison to
a developers familiar style can drastically decrease the performance.
In order to mitigate these problems I propose to visualize code
in a graphical and deterministic way.
Instead of relying on the author of the code to format it in a acceptable
manner, each developer can choose a visualization of their liking.
This has the potential to decrease the error rate and
increase the development speed of programmers.


## Future Work

- Touch based
- Drag and drop


---

## Related Work

### Misc

- [Barista] - Implementation toolkit for AST editors.
- [Citrus] - Programming language and user interface toolkit.
  (https://youtu.be/YIlYJCwIXLs)
- [Codemirror Blocks] - Drag-and-drop editing for functional languages.
- [CodeWorld] - Educational computer programming environment using Haskell.
- [Dhall PureScript] - Structural editor for Dhall written in PureScript.
- [Future Programming Webassembly Life After JavaScript][FWA]
- [Glance] - Visual syntax for Haskell.
- [Lamdu] -
- [Mbeddr]
- [Moonchild] - Projection editor (https://vimeo.com/97711824).
- [Programming Beyond Text: The Parsing Problem][Parsing Problem]
- [PureScript Datagen] - Generating data types in a live-coding environment.
- [Treeline] - Develop backend apps in your web browser.
- [Unison]
- [Braces be gone] - Moves braces in Java to the edge of the code.

[Barista]: https://www.youtube.com/watch?v=gAxjUh9d2YI
[Braces be gone]: https://github.com/ollef/braces-be-gone
[Citrus]: https://github.com/andyjko/citrus-barista
[CodeWorld]: https://github.com/google/codeworld
[Dhall PureScript]: https://monoidmusician.github.io/dhall-purescript
[FWA]: http://sitepoint.com/future-programming-webassembly-life-after-javascript
[Glance]: https://github.com/rgleichman/glance
[Lamdu]: http://www.lamdu.org
[Mbeddr]: http://mbeddr.com
[Moonchild]: https://github.com/harc/moonchild
[Parsing Problem]: http://joshondesign.com/2016/06/13/the_parsing_problem
[PureScript Datagen]: https://github.com/MonoidMusician/purescript-datagen
[Treeline]: https://treeline.io
[Unison]: http://unisonweb.org
[Codemirror Blocks]: http://bootstrapworld.github.io/codemirror-blocks


### Visual Programming

- [Alice] - Object based educational programming language plus IDE.
- [Node-RED] - Flow-based programming for the Internet of Things
- [Greenfoot Frames] - Frame based editing environment.

[Alice]: http://www.alice.org
[Node-RED]:https://nodered.org
[Greenfoot Frames]: https://www.greenfoot.org/frames/


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


### Talks

- [The Future of Programming][future-of-programming]

[future-of-programming]: https://vimeo.com/71278954


### Online IDEs

- [CodeSandbox] - Online editor that helps you create web applications.
- [observablehq] - Interactive notebooks for data analysis, visualization, and exploration
- [Onelang] - Cross compile/transpile code to several languages online.
- [runkit] - Interactive notebooks with very version of every npm package pre-installed.
- [meemoo] - Online flow based creative tool maker.
- [livecode] - Develop apps "live", using a visual workflow language syntax.
- [touchdevelop] - Adaptive editor with support for drag & drop but also normal code.

[touchdevelop]: https://www.touchdevelop.com
[livecode]: https://github.com/livecode/livecode
[meemoo]: https://meemoo.org
[CodeSandbox]: https://codesandbox.io
[observablehq]: https://beta.observablehq.com
[Onelang]: https://ide.onelang.io
[runkit]: https://runkit.com/home


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
- https://github.com/pkamenarsky/typedraw - Visually describe Haskell/Purescript/Elm types



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
- [Language design for programming reliability]
  > semicolon as separator is about ten times more prone to error
  > than semicolon as terminator
- [Code Bubbles] - Rethinking the User Interface Paradigm of Integrated Development Environments.

[Code Bubbles]: http://www.andrewbragdon.com/codebubbles_site.asp
[Language design for programming reliability]: http://ieeexplore.ieee.org/document/6312838


## People

- [Andres J. Ko] - Associate Professor at University of Washington.
- [Chaim Gingold] - Turns technology into delightful experiences and transformative tools.
- [Monoid Musician] - Developer of [purescript-datagen].
- [Patrick Dubory] - Programmer and interaction designer based in Munich.
- [Paul Chiusano] - Founder of [Unison].
- [Steve Krouse] - Author of Future of Coding.

[Andres J. Ko]: https://faculty.washington.edu/ajko
[Chaim Gingold]: http://chaim.io
[Monoid Musician]: monoidmusician
[Patrick Dubory]: https://dubroy.com
[Paul Chiusano]: https://pchiusano.github.io
[Steve Krouse]: http://futureofcoding.org


## More Resources

- https://github.com/ivanreese/visual-programming-codex
- https://github.com/hypotext/notation
- http://chaim.io/download/Gingold%20(2017)%20Gadget%20(1)%20Survey.pdf
- http://blog.interfacevision.com/design/design-visual-progarmming-languages-snapshots


## TODO

- Search for more information about "Projection editor"
- Checkout marco röders project "codb"
- https://stackoverflow.com/questions/26848419/syntax-highlighting-with-text-style-instead-of-colors
- https://softwareengineering.stackexchange.com/questions/87077/how-can-a-code-editor-effectively-hint-at-code-nesting-level-without-using-ind
- jGRASP
- https://harc.github.io/seymour-live2017
- `lively.openComponentInWindow('my-component')`
- `lively.html.registerButtons`
- Make histogram of line lengths => find 90% percentile and use for formatting
- Hierarchy of code interaction:
  1. Reading
  2. Patches (e.g. change a string)
  3. Minor changes (e.g. write a function)
  4. Major changes (e.g. restructure code)
  5. Create a new project
  => Code editor should be optimized for this interaction pattern
- Minimap
- Feature flags
- http://www.esterel-technologies.com/products/scade-suite/software-prototyping-desgin/scade-suite-advanced-modeler/
- https://www.ansys.com/products/embedded-software/ansys-scade-suite
- https://blog.janestreet.com/putting-the-i-back-in-ide-towards-a-github-explorer/
- http://futureofcoding.org -
- https://codeocean.com - cloud-based computational reproducibility platform
- http://glench.github.io/fuzzyset.js/ui/ - A Human-Readable Interactive Representation of a Code Library
- http://penrose.ink/ - Create diagrams by typing mathematical notation in plain text.
- https://github.com/SamyPesse/codemirror-widgets
- https://github.com/LivelyKernel/lively4-projectional-editor
- http://bl.ocks.org/jasongrout/5378313

