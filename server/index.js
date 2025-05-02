const express = require('express')
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')
const authRoutes = require('./routes/auth')

const app = express()
authRoutes(app, path.join(__dirname, 'db/users.json'))

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: true } })

app.use(express.static(path.join(__dirname, '../client')))

const WORLD_WIDTH = 12000
const WORLD_HEIGHT = 6000
const INNER_MARGIN = 320

const players = {}

io.on('connection', socket => {
	// Auth
	const tok = socket.handshake.auth?.token
	const db = require('./routes/auth').loadDB()
	if (!db.find(u => u.token === tok)) {
		socket.disconnect()
		return
	}

	// Spawn within inner bounds
	players[socket.id] = {
		x: INNER_MARGIN + Math.random() * (WORLD_WIDTH - 2 * INNER_MARGIN),
		y: INNER_MARGIN + Math.random() * (WORLD_HEIGHT - 2 * INNER_MARGIN),
		r: 0,
		color: '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')
	}

	// Send world settings and current players
	socket.emit('worldSettings', {
		width: WORLD_WIDTH,
		height: WORLD_HEIGHT,
		margin: INNER_MARGIN
	})
	socket.emit('currentPlayers', players)
	socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] })

	// Handle movement updates
	socket.on('playerMovement', data => {
		if (!players[socket.id]) return
		players[socket.id].x = data.x
		players[socket.id].y = data.y
		players[socket.id].r = data.r
		socket.broadcast.emit('playerMoved', {
			id: socket.id,
			x: data.x,
			y: data.y,
			r: data.r
		})
	})

	// Cleanup on disconnect
	socket.on('disconnect', () => {
		delete players[socket.id]
		io.emit('playerDisconnected', socket.id)
	})
})

server.listen(process.env.PORT || 3000, () => {
	console.log('Server ON')
})
