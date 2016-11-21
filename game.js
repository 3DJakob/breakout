var canvas = document.getElementById('gameCanvas')
var ctx = canvas.getContext('2d')

// Ball variables
var ballRadius = 10
var x = canvas.width / 2
var y = canvas.height - 30
var dx = 2
var dy = -2

// Paddle variables
var paddleHeight = 10
var paddleWidth = 75
var paddleX = (canvas.width - paddleWidth) / 2
var rightPressed = false
var leftPressed = false
var paddleSpeed = 0
var paddleMaxSpeed = 3
var paddleAcceleration = 0.5

function drawBall () {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function drawPaddle () {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function paddleMove () {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    if (paddleSpeed < paddleMaxSpeed) {
      paddleSpeed += paddleAcceleration
    }
    paddleX += paddleSpeed
  } else if (leftPressed && paddleX > 0) {
    if (paddleSpeed > -paddleMaxSpeed) {
      paddleSpeed -= paddleAcceleration
    }
  } else {
    if (paddleSpeed > 0) {
      paddleSpeed -= paddleAcceleration
    } else if (paddleSpeed < 0) {
      paddleSpeed += paddleAcceleration
    }
  }
  paddleX += paddleSpeed
}

function wallBounce () {
  if (y + dy < ballRadius) {
    dy = -dy
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      alert('GAME OVER')
      document.location.reload()
    }
  }
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx
  }
}

function keyDownHandler (e) {
  if (e.keyCode === 39) {
    rightPressed = true
  } else if (e.keyCode === 37) {
    leftPressed = true
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 39) {
    rightPressed = false
  } else if (e.keyCode === 37) {
    leftPressed = false
  }
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall()
  drawPaddle()
  paddleMove()
  x += dx
  y += dy
  wallBounce()

  // ctx.font = '20px sans-serif'
  // ctx.fillText('Speed: ' + paddleSpeed, 10, 30) // Speed not accurate?
}

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)
setInterval(draw, 10)
