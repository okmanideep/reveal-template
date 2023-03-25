import express from 'express'
import fs from 'fs'
import generate from './generate.js'
import { WebSocketServer } from 'ws'

let clients = []

// watch `src` and build on update
async function watchAndBuild() {
	try {
		const changes = fs.promises.watch("src", {
			recursive: true,
		})

		for await (const _ of changes) {
			await generate({ debug: true })
			clients.forEach((ws) => ws.send(JSON.stringify({ type: 'reload' })))
		}
	} catch (error) {
		if (error.name === "AbortError"){
			return;
		}

		throw error
	}
}

const wss = new WebSocketServer({ port: 5353 })
wss.on('connection', (ws) => {
	clients = [...clients, ws]
	ws.onclose = () => {
		clients = clients.filter((client) => client !== ws)
	}
})
const app = express()
app.use(express.static("docs"))
app.listen("3333")
// build once
await generate({ debug: true })
// start watching for changes and build on change
await watchAndBuild()
