const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
var geoip = require("geoip-lite");
const externalip = require("externalip");

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
		
	socket.on('join', ({username, room}) => {
		socket.join(room)
		socket.emit('message', generateMessage('Welcome'))
		socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`))
	})

	socket.on('sendMessage', (message, callback) => {
		const filter = new Filter()
		if(filter.isProfane(message)) return callback('profanity is not allowed')
		io.to('Z').emit('message', generateMessage(message))
		callback()
	})

/*	socket.on('sendLocation', (coords, callback) => {
		// var url = codeLatLng(coords.latitude, coords.longitude)
		console.log(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
		io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
		// io.emit('locationMessage', generateLocationMessage(url))
		callback()
	})*/

	socket.on('sendLocation', (ip, callback) => {
		const city = new Promise((res, error) => {
			res(geoip.lookup(ip.ip.trim()).city)
		})
		city.then((res) => {
  			console.log(res)
  			io.emit("locationMessage", generateLocationMessage('near ' + res));
		}).catch((err) => {
			console.log('error', err)
		})
		callback()
	})


	socket.on('disconnect', () => {
		io.emit('message', generateMessage('a user has left'))
	})

})


server.listen(port, () => {
	console.log(`server is up on port ${port}`)
})


const city = new Promise((res, error) => {

})

