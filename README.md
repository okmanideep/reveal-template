## A RevealJS Presentation Template

### Installation
* `git clone git@github.com:okmanideep/reveal-template`
* `npm i`

### Usage
* `npm start` - To start the dev server in port - `3333`.
  * Listens to changes in `src` folder and live reloads the page (using `ws://localhost:5353`)
* `npm run build` - To build the webpage

> **Note**: Port 5353 is used for live reload

### How does it work?
#### Markup
`src/index.html` 
```html
<body>
  <div class="reveal">
    <div class="slides">
      <section>Slide 1</section>
      <section>Slide 2</section>
      <!-- More slides -->
    </div>
  </div>

  <!-- ... -->
</body>
```

#### CSS
`src/index.css`

Comes with `src/one-dark.css` theme that [looks like this](https://okmanideep.github.io/compose-slides/). Other [themes can be found here](https://github.com/hakimel/reveal.js/tree/master/dist/theme)

#### JS
`src/index.js`

#### Build
`scripts/build.js` has the entire build script in plain `javascript`. It is ~60 lines . The output is a **single HTML file** - `docs/index.html` with `javascript` and `css` inline. It uses `esbuild` for transpiling JS  and `clean-css` to minify CSS.

#### Dev Server
`scripts/start.js` - dev server, that watches for changes in `src` and rebuilds the `docs/index.html`. This is where you can change the PORT for local dev server.

### Why not use the recommended setup by RevealJS?
The recommended [Full Setup](https://revealjs.com/installation/#full-setup), doesn't work in Windows and has a complicated build workflow which is an overkill for most revealjs presentations.

This template aims to solve that and is compatible with github-pages by default.

