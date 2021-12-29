const testDiv = document.getElementById('test-div')
const testText = document.getElementById('test-text')
const testButton = document.getElementById('test-button')


testDiv.addEventListener('submit', e => {
    e.preventDefault()
    const testMessage = "test"

    if (testMessage === "") return
    displayMessage(testMessage)
})

function displayMessage(message) {
    testText.textContent = message
}