const socket = io()

// socket.on('countUpdated', (count) => {
// 	console.log('the count has been updated', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
// 	console.log('clicked')
// 	socket.emit('increment')
// })

// server (emit) -> client (receive) --acknowledgement -> server
// client (emit) -> server (receive) --acknowledgement -> client


// Elements
const $messageForm = document.getElementById('message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.getElementById('messages')

// Templates
const $messageTemplate = document.getElementById('message-template').innerHTML

socket.on('message', (message) => {
	console.log(message)
	const html = Mustache.render($messageTemplate, {
		message: message
	})
	$messages.insertAdjacentHTML('beforeend', html)
})


$messageForm.addEventListener('submit', (e) => {
	e.preventDefault()
	
	// disable form button
	$messageFormButton.setAttribute('disabled', 'disabled')

	const message = e.target.elements.message.value
	socket.emit('sendMessage', message, (error) => {
		// enable form button after message has been sent
		$messageFormButton.removeAttribute('disabled')
		// clear input field
		$messageFormInput.value = ''
		// cursor in input field
		$messageFormInput.focus()
		if(error) return console.log(error)
		console.log('message delivered')
	})
})

const $locationButton = document.getElementById('loc')
$locationButton.addEventListener('click', () => {
	if(!navigator.geolocation) return alert('Geolocation not supported by browser')
	$locationButton.setAttribute('disabled', 'disabled')
	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit('sendLocation', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		}, () => {
			console.log('location shared')
			$locationButton.removeAttribute('disabled')
		})
	})
})