import fs from 'fs'
import path from 'path'
import { Liquid } from 'liquidjs'
import CleanCss from 'clean-css'
import esbuild from 'esbuild'

// es-build of src/index.js
async function js() {
	const result = await esbuild.build({
		entryPoints: ["src/index.js"],
		write: false,
		bundle: true,
	})
	const [indexJs] = result.outputFiles
	return indexJs.text
}

async function liveReloadJs({ debug = false }) {
	if (!debug) return ''

	const result = await esbuild.build({
		entryPoints: ["src/live-reload.js"],
		write: false,
		bundle: true,
	})
	const [liveReloadJs] = result.outputFiles
	return liveReloadJs.text
}

async function css() {
  const directory = await fs.promises.readdir("src/css", {
    withFileTypes: true
  })
  const cssFiles = directory
    .filter(f => f.isFile())
    .map(f => f.name)
    .map(filename => path.join("src/css", filename))

  const cssOutput = await (new CleanCss({
    returnPromise: true
  })).minify([
    "node_modules/reveal.js/dist/reset.css",
    "node_modules/reveal.js/dist/reveal.css",
    ...cssFiles
  ])

  return cssOutput.styles
}

async function generate({debug = false}) {
  try {
    await fs.promises.access("docs", fs.constants.R_OK | fs.constants.W_OK)
  } catch (_) {
    if (debug) console.log("Creating docs directory")
    await fs.promises.mkdir("docs")
  } finally {
    // clean`/docs` folder if exists
    if (debug) console.log("Cleaning docs")
    await fs.promises.rm("docs/index.html", { force: true })
  }

  const liquid = new Liquid({
    root: "src",
    extname: ".html"
  })

  const [INLINE_JS, INLINE_CSS, INLINE_LIVE_RELOAD_JS] = await Promise.all([js(), css(), liveReloadJs({ debug })])
  const htmlStream = await liquid.renderFileToNodeStream("index", { INLINE_CSS, INLINE_JS, INLINE_LIVE_RELOAD_JS })
  await fs.promises.writeFile("docs/index.html", htmlStream)
  if (debug) console.log("Updated docs/index.html")
}

export default generate
