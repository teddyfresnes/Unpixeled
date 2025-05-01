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

const WORLD_WIDTH = 5000, WORLD_HEIGHT = 5000
const players = {}

io.on('connection', socket => {
	const tok = socket.handshake.auth?.token
	const db = require('./routes/auth').loadDB()
	if (!db.find(u => u.token === tok)) { socket.disconnect(); return }
	players[socket.id] = {
		x: Math.random() * WORLD_WIDTH,
		y: Math.random() * WORLD_HEIGHT,
		r: 0,
		color: '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')
	}
	socket.emit('worldSettings', { width: WORLD_WIDTH, height: WORLD_HEIGHT })
	socket.emit('currentPlayers', players)
	socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] })
	socket.on('playerMovement', d => {
		if (!players[socket.id]) return
		players[socket.id].x = d.x
		players[socket.id].y = d.y
		players[socket.id].r = d.r
		socket.broadcast.emit('playerMoved', { id: socket.id, x: d.x, y: d.y, r: d.r })
	})
	socket.on('disconnect', () => {
		delete players[socket.id]
		io.emit('playerDisconnected', socket.id)
	})
})

server.listen(process.env.PORT || 3000, () => console.log('Server ON'))
