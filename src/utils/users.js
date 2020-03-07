const users = []

// add user
const addUser = ({ id, username, room }) => {
	// clean the data
	username = username.trim()
	room = room.trim().toLowerCase()

	// validate the data
	if(!username || !room) {
		return {
			error: 'username and room are required'
		}
	}

	// check for existing user
	const existingUser = users.find((user) => {
		return user.room === room && user.username === username
	})

	// validate username
	if(existingUser) {
		return {
			error: 'username already taken'
		}
	}

	// store user
	const user = { id, username, room }
	users.push(user)
	return { user }
}


// remove user
const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id)
	if(index !== -1) {
		return users.splice(index, 1)[0]
	}
}

// get user
const getUser = (id) => {
	return users.find((user) => user.id === id)
}

// get users in room
const getUsersInRoom = (room) => {
	room = room.trim().toLowerCase()
	return users.filter((user) => user.room === room)
}

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom
}



// testing
// addUser({
// 	id: 22,
// 	username: 'steven',
// 	room: 'Z'
// })

// addUser({
// 	id: 33,
// 	username: 'deferme',
// 	room: 'Z'
// })

// addUser({
// 	id: 44,
// 	username: 'esdee',
// 	room: 'X'
// })



// // const res = addUser({
// // 	id: 33,
// // 	username: 'steven',
// // 	room: 'A'
// // })

// // const removedUser = removeUser(22)
// // console.log(removedUser)
// const user = getUser(44)
// console.log(user)

// const userList = getUsersInRoom('Z')
// console.log(userList)

// console.log(users)
