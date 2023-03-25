const ws = new WebSocket('ws://localhost:5353')

ws.onopen = () => {
	console.log("Connected")
}
ws.onmessage = (event) => {
	console.log({ event })
	const payload = JSON.parse(event.data)
	if (payload.type === 'reload') {
		window.location.reload()
	}
}
