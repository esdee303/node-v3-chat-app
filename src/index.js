const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*')
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
   next()
})

app.use(express.static(publicDirectoryPath))

// let count = 0
io.on('connection', (socket) => {
	socket.emit('message', generateMessage('Welcome'))

	socket.broadcast.emit('message', generateMessage('a new user has joined'))
	
	socket.on('sendMessage', (message, callback) => {
		const filter = new Filter()
		if(filter.isProfane(message)) return callback('profanity is not allowed')
		io.emit('message', generateMessage(message))
		callback()
	})
	// socket.emit('countUpdated', count)
	// socket.on('increment', () => {
	// 	count++
	// 	// socket.emit('countUpdated', count)
	// 	io.emit('countUpdated', count)
	// })

	socket.on('sendLocation', (coords, callback) => {
		io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
		callback()
	})

	socket.on('disconnect', () => {
		io.emit('message', generateMessage('a user has left'))
	})

})

server.listen(port, () => {
	console.log(`server is up on port ${port}`)
})


