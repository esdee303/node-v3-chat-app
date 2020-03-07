const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
var geoip = require("geoip-lite");
// const externalip = require("externalip");
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

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

io.on('connection', (socket) => {
	console.log('----new websocket connection----')
	socket.on('join', ({username, room}, callback) => {
		const { error, user } = addUser({ id: socket.id, username, room })
		
		if(error) return callback(error)

		socket.join(user.room)

		socket.emit('message', generateMessage('Admin', 'Welcome'))
		socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`))
		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room)
		})

		callback()
	})

	socket.on('sendMessage', (message, callback) => {
		const user = getUser(socket.id)
		const filter = new Filter()
		if(filter.isProfane(message)) return callback('profanity is not allowed')
		io.to(user.room).emit('message', generateMessage(user.username, message))
		callback()
	})

	socket.on('sendLocation', (ip, callback) => {
		const user = getUser(socket.id)
		const city = new Promise((res, error) => {
			res(geoip.lookup(ip.ip.trim()).city)
		})
		city.then((res) => {
			console.log(res)
			io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, 'near ' + res))
		}).catch((err) => {
			console.log('error', err)
		})
		callback()
	})


	socket.on('disconnect', () => {
		const user = removeUser(socket.id)
		if(user) {
			io.to('user.room').emit('message', generateMessage('Admin', `${user.username} has left`))
			io.to(user.room).emit('roomData', {
				room: user.room,
				users: getUsersInRoom(user.room)
			})
		}
	})
})


server.listen(port, () => {
	console.log(`server is up on port ${port}`)
})

