var canvas = document.getElementById('gameCanvas')
var ctx = canvas.getContext('2d')

var difficulty = 1

// Ball variables
var ballRadius = 10
var x = canvas.width / 2
var y = canvas.height - 30

// 200 pixels per second
var initialSpeed = (200 / 1000)
var currentSpeed = initialSpeed

var dx = currentSpeed
var dy = -currentSpeed

// Paddle variables
var paddleHeight = 10
var paddleWidth = 75
var paddleX = (canvas.width - paddleWidth) / 2
var rightPressed = false
var leftPressed = false
var paddleSpeed = 0

// 300 pixels per second
var paddleMaxSpeed = (300 / 1000)

// 8 pixels per second per second
var paddleAcceleration = (8 / 1000)

// 2 pixels per second per second
var paddleRetardation = (2 / 1000)

//  Brick variables
var brickRowCount = 3
var brickColumnCount = 5
var brickWidth = 75
var brickHeight = 20
var brickPadding = 10
var brickOffsetTop = 30
var brickOffsetLeft = 30

var score = 0
var rPressed = false

var bricks = []
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = []
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }
  }
}

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)
document.addEventListener('mousemove', mouseMoveHandler, false)

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

function drawBricks () {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = '#0095DD'
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function collisionDetection () {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r]
      if (b.status === 1) {
        if (x - ballRadius > b.x && x - ballRadius < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
          dy = -dy
          b.status = 0
          score += 1
        }
      }
    }
  }
}

function paddleMove (dt) {
  if (rightPressed) {
    paddleSpeed = Math.min(paddleSpeed + paddleAcceleration * dt, paddleMaxSpeed)
  }

  if (leftPressed) {
    paddleSpeed = Math.max(paddleSpeed - paddleAcceleration * dt, -paddleMaxSpeed)
  }

  if (!rightPressed && !leftPressed) {
    if (paddleSpeed > 0) {
      paddleSpeed = Math.max(0, paddleSpeed - paddleRetardation * dt)
    } else if (paddleSpeed < 0) {
      paddleSpeed = Math.min(0, paddleSpeed + paddleRetardation * dt)
    }
  }

  paddleX = Math.min(Math.max(paddleX + paddleSpeed * dt, 0), canvas.width - paddleWidth)
}

function ballMove (dt) {
  x += dx * dt
  y += dy * dt
}

function mouseMoveHandler (e) {
  var relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2
  }
}

function wallBounce () {
  if (y + dy < ballRadius) {
    dy = -dy
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else if (y + dy > canvas.height - ballRadius) {
      bricks = []
      for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = []
        for (var r = 0; r < brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 }
        }
      }
      x = canvas.width / 2
      y = canvas.height - 30
      currentSpeed = initialSpeed
      dx = currentSpeed
      dy = -currentSpeed
      score = 0
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
  } else if (e.keyCode === 82) {
    rPressed = true
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 39) {
    rightPressed = false
  } else if (e.keyCode === 37) {
    leftPressed = false
  } else if (e.keyCode === 82) {
    rPressed = false
  }
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall()
  drawPaddle()
  drawBricks()

  // ctx.font = '20px sans-serif'
  // ctx.fillText('Speed: ' + paddleSpeed, 10, 30) // Speed not accurate?
  ctx.textAlign = 'center'
  ctx.font = '20px sans-serif'
  ctx.fillText('Score: ' + score, 43, 23)
  ctx.fillText('Difficulty: ' + difficulty, 150, 23)
  if (score === brickRowCount * brickColumnCount) {
    ctx.fillText('YOU WON!', canvas.width / 2, canvas.height / 2)
    ctx.fillText('Press R to play next difficulty!', canvas.width / 2, canvas.height * 2 / 3)
    dx = 0
    dy = 0
    if (rPressed) {
      bricks = []
      for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = []
        for (var r = 0; r < brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 }
        }
      }
      x = canvas.width / 2
      y = canvas.height - 50

      // Add 100 pixels per second to the speed
      currentSpeed = currentSpeed + (100 / 1000)

      dx = currentSpeed
      dy = -currentSpeed
      score = 0
    }
  }
}

var lastTime = null
function gameLoop (currentTime) {
  if (lastTime !== null) {
    var dt = (currentTime - lastTime)

    paddleMove(dt)
    ballMove(dt)

    wallBounce()
    collisionDetection()
  }

  draw()

  lastTime = currentTime
  window.requestAnimationFrame(gameLoop)
}

window.requestAnimationFrame(gameLoop)
