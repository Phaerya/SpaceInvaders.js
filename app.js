const grid = document.querySelector('.grid')
const resultDisplay = document.querySelector('.results')
const width = 15
const aliensRemoved = []
let currentShooterIndex = 202
let invadersId = []
let isGoingRight = true
let direction = 1
let results = 0

// Creating grid squares and storing them in an array
for (let i = 0; i < width * width; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

// Defining the initial positions of the alien invaders
const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

// Function to draw the alien invaders on the grid
function draw () {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader') // classList = add css property
    }
  }
}
draw()

// Function to remove the alien invaders from the grid
function remove () {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader') // Removing invader class from grid squares
  }
}

// Adding the shooter to the grid at the initial position
squares[currentShooterIndex].classList.add('shooter')

// Function to move the shooter based on keyboard input
function moveShooter (e) {
  squares[currentShooterIndex].classList.remove('shooter')
  switch (e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
      break
    case 'ArrowRight':
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
      break
  }
  squares[currentShooterIndex].classList.add('shooter')
}

// Event listener to handle shooter movement
document.addEventListener('keydown', moveShooter)

// Function to move the alien invaders and handle game over / win conditions
function moveInvaders () {
  const leftEdge = alienInvaders[0] % width === 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
  remove()

  if (rightEdge && isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1
      direction = -1
      isGoingRight = false
    }
  }

  if (leftEdge && !isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1
      direction = 1
      isGoingRight = true
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction
  }
  draw()

  if (squares[currentShooterIndex].classList.contains('invader')) {
    resultDisplay.innerHTML = 'GAME OVER'
    clearInterval(invadersId)
  }

  if (aliensRemoved.length === alienInvaders.length) {
    resultDisplay.innerHTML = 'YOU WON'
    clearInterval(invadersId)
  }
}

// Setting interval to move the invaders at regular intervals
invadersId = setInterval(moveInvaders, 500)

// Function to handle shooting behavior
function shoot (e) {
  let laserId
  let currentLaserIndex = currentShooterIndex

  // Function to move the laser and handle collision with invaders
  function moveLaser () {
    squares[currentLaserIndex].classList.remove('laser')
    currentLaserIndex -= width
    squares[currentLaserIndex].classList.add('laser')

    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser')
      squares[currentLaserIndex].classList.remove('invader')
      squares[currentLaserIndex].classList.add('boom')

      // Resetting the 'boom' class after a short delay
      setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
      clearInterval(laserId)

      // Updating game state and display upon successful hit
      const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
      aliensRemoved.push(alienRemoved)
      results++
      resultDisplay.innerHTML = results
    }
  }

  // Initiating laser movement upon 'ArrowUp' key press

  if (e.key === 'ArrowUp') {
    laserId = setInterval(moveLaser, 100)
  }
}

// Event listener to handle shooting

document.addEventListener('keydown', shoot)
