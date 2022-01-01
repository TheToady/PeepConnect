import { io } from 'socket.io-client'

const testDiv = document.getElementById('test-div')
const searchButton = document.getElementById('search-button')
const stopButton = document.getElementById('stop-button')
const testText = document.getElementById('test-text')
const testButton = document.getElementById('test-button')
const myVideo = document.getElementById('my-video')
const otherVideo = document.getElementById('other-video')

const socket = io('http://localhost:3000')

//Video Chat
let localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
let remoteStream = new MediaStream();

//vars
var matchedUser = null;

//setting up
searchButton.style.visibility = 'visible'
stopButton.style.visibility = 'hidden'

//incomming connection

socket.on('connect', () => {
    console.log(`You connected with the id: ${socket.id}`)
    displayMessage(`You connected with the id: ${socket.id}`)
})

socket.on('receive-message', message => {
    displayMessage(message)
})

socket.on('receive-test', users => {
    users.forEach(user => {
        displayMessage(`The User ${user.id} joined the parameter searching is: ${user.searching}`)
    });
    console.log(users)
})

socket.on('receive-search', () => {
    displayMessage('Searching')
    searchButton.style.visibility = 'hidden'
    stopButton.style.visibility = 'visible'
})

socket.on('receive-stop', () => {
    displayMessage('Stopped')
    searchButton.style.visibility = 'visible'
    stopButton.style.visibility = 'hidden'
})

socket.on('receive-matched', (_matchedUser) => {
    console.log(`Matched with ${_matchedUser}`)
    displayMessage(`Matched with ${_matchedUser}`)
    matchedUser = _matchedUser

    
})

//Buttons

testButton.addEventListener('click', e => {
    console.log('test')
    e.preventDefault()

    socket.emit('send-test')
})

searchButton.addEventListener('click', e => {
    console.log('search')
    e.preventDefault()

    socket.emit('send-search')
})

stopButton.addEventListener('click', e => {
    console.log('search')
    e.preventDefault()

    socket.emit('send-stop')
})
//functions

function displayMessage(message) {
    testText.textContent = message
}