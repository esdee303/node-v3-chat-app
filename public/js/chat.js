const socket = io()

// Elements
const $messageForm = document.getElementById('message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.getElementById('messages')
const $locationButton = document.getElementById("loc");

// Templates
const $messageTemplate = document.getElementById('message-template').innerHTML
const $locationMessageTemplate = document.getElementById('location-message-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
	const html = Mustache.render($messageTemplate, {
		message: message.text,
		createdAt: moment(message.createdAt).format('H:mm')
	})
	$messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
	const html = Mustache.render($locationMessageTemplate, {
		url: message.url,
		createdAt: moment(message.createdAt).format('H:mm')
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
	})
})

$locationButton.addEventListener('click', () => {
	$locationButton.setAttribute('disabled', 'disabled')
	var myIp = myIP()
	socket.emit('sendLocation', {
		ip: myIp
	}, () => {
		$locationButton.removeAttribute('disabled')
	})
})

socket.emit('join', { username, room }, (error) => {
	if(error) {
		alert(error)
		location.href = '/'
	}
})

/*
$locationButton.addEventListener('click', () => {
	if(!navigator.geolocation) return alert('Geolocation not supported by browser')
	$locationButton.setAttribute('disabled', 'disabled')
	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit('sendLocation', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		}, () => {
			$locationButton.removeAttribute('disabled')
		})
	})
})*/


function myIP() {
  if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
  else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

  xmlhttp.open("GET", "http://api.hostip.info/get_html.php", false);
  xmlhttp.send();

  hostipInfo = xmlhttp.responseText.split("\n");

  for (i = 0; hostipInfo.length >= i; i++) {
    ipAddress = hostipInfo[i].split(":");
    if (ipAddress[0] == "IP") {
		console.log(ipAddress[0])
		return ipAddress[1];
	}
  }

  return false;
}