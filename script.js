let hours = 6;
let minutes = 0;
let rainEndTime = null;
let thunderEndTime = null;
let eventCheckTimeout = null;
let isClockRunning = false;
let gameOverDisplayed = false;

function getGameTime() {
  let paddedHours = hours.toString().padStart(2, '0');
  return `${paddedHours}:${minutes.toString().padStart(2, '0')}`;
}

function changeBackground() {
  const gameTime = getGameTime();
  let backgroundImage;

  if (gameTime >= '06:00' && gameTime <= '06:59') {
    backgroundImage = 'dawn';
  } else if (gameTime >= '07:00' && gameTime <= '08:59') {
    backgroundImage = 'sunrise';
  } else if (gameTime >= '09:00' && gameTime <= '10:59') {
    backgroundImage = 'morning1';
  } else if (gameTime >= '11:00' && gameTime <= '11:59') {
    backgroundImage = 'morning2';
  } else if (gameTime >= '12:00' && gameTime <= '12:59') {
    backgroundImage = 'noon';
  } else if (gameTime >= '13:00' && gameTime <= '16:59') {
    backgroundImage = 'afternoon';
  } else if (gameTime >= '17:00' && gameTime <= '18:59') {
    backgroundImage = 'dusk';
  } else if (gameTime >= '19:00' && gameTime <= '20:59') {
    backgroundImage = 'night1';
  } else if (gameTime >= '21:00' && gameTime <= '23:59') {
    backgroundImage = 'night2';
  } else {
    backgroundImage = 'midnight';
  }

  if (!eventCheckTimeout) {
    const randomEvent = Math.random();
    const isRaining = randomEvent < 0.15;
    const isThunder = randomEvent >= 0.15 && randomEvent < 0.3;

    if (isRaining && !rainEndTime) {
      rainEndTime = gameTime + (0.5 + Math.floor(Math.random() * 1)) * 60;
    }

    if (isThunder && !thunderEndTime) {
      thunderEndTime = gameTime + 15;
    }

    eventCheckTimeout = setTimeout(() => {
      eventCheckTimeout = null;
    }, 36000);
  }

  if (rainEndTime && gameTime >= rainEndTime) {
    rainEndTime = null;
  }

  if (thunderEndTime && gameTime >= thunderEndTime) {
    thunderEndTime = null;
  }

  if (rainEndTime && !thunderEndTime) {
    backgroundImage = 'rain';
  } else if (!rainEndTime && thunderEndTime) {
    backgroundImage = 'thunder';
  } else if (rainEndTime && thunderEndTime) {
    backgroundImage = 'rain2';
  }

  const bodyElement = document.querySelector('body');
  bodyElement.style.backgroundImage = `url(imgs/${backgroundImage}.jpg)`;

  const clockElement = document.querySelector('#clock');
  clockElement.textContent = gameTime;
}

function updateClock() {
  if (isClockRunning) {
    return;
  }

  isClockRunning = true;

  minutes += 1;

  if (minutes >= 60) {
    minutes = 0;
    hours++;
  }

  if (hours >= 24) {
    hours = 0;
  }

  changeBackground();
  updateGreeting();

  const clockElement = document.querySelector('#clock');
  clockElement.textContent = getGameTime();

  setTimeout(function() {
    isClockRunning = false;
    updateClock();
  }, 1000);
}

function stopClock() {
  isClockRunning = false;
}

const feedButton = document.querySelector('.button .feed');
const sleepButton = document.querySelector('.button .sleep');
const pillButton = document.querySelector('.button .pill');
const playButton = document.querySelector('.button .play');

const hungerBar = document.querySelector('#hunger-bar');
const energyBar = document.querySelector('#energy-bar');
const happinessBar = document.querySelector('#happiness-bar');
const healthBar = document.querySelector('#health-bar');

const avatarGif = document.querySelector('#avatar-gif');

let hunger = 50;
let energy = 50;
let happiness = 50;
let health = 50;

// add click event listeners to each button
feedButton.addEventListener('click', function() {
	if (happiness < 10) {
		hunger += 10;
	} else {
		hunger += 15;
	}
	energy -= 2;
	happiness += 1;
	health -= 1;
	updateStatusBar(hunger, hungerBar);
	updateStatusBar(energy, energyBar);
	updateStatusBar(happiness, happinessBar);
	updateStatusBar(health, healthBar);
});
  
sleepButton.addEventListener('click', function() {
	if (health < 10) {
		energy += 10;
	} else {
		energy += 15;
	}
	hunger -= 2;
	happiness -= 1;
	health += 1;
	updateStatusBar(energy, energyBar);
	updateStatusBar(hunger, hungerBar);
	updateStatusBar(happiness, happinessBar);
	updateStatusBar(health, healthBar);
});
  
pillButton.addEventListener('click', function() {
	if (hunger < 10) {
		health += 5;
	} else {
		health += 10;
	}
	hunger += 1;
	energy -= 1;
	happiness -= 2;
	updateStatusBar(health, healthBar);
	updateStatusBar(hunger, hungerBar);
	updateStatusBar(energy, energyBar);
	updateStatusBar(happiness, happinessBar);
});

// Update the status bar function
function updateStatusBar(newValue, statusBar) {
	if (newValue > 100) {
	  newValue = 100;
	}
  
	statusBar.value = newValue;
}

// Add a function to change the avatar GIF
function changeAvatarGif(avatarValue, loopCount, avatarEvolution) {
	const avatarSrc = `imgs/${avatarValue}-${avatarEvolution}.gif`;
	avatarGif.src = avatarSrc;
  
	if (loopCount > 0) {
	  avatarGif.addEventListener('animationiteration', () => {
		loopCount--;
		if (loopCount === 0) {
		  avatarGif.src = `imgs/${avatarValue}-${avatarEvolution}.gif`;
		}
	  });
	}
}

function initGame() {
	const startScreen = document.querySelector('#start-screen');
	const gameScreen = document.querySelector('#game-screen');
	
	if (!startScreen || !gameScreen) {
		setTimeout(initGame, 100);
		return;
	}

	startScreen.style.display = 'block';
	gameScreen.style.display = 'none';
}

function startGame() {
	const startScreen = document.querySelector('#start-screen');
	const gameScreen = document.querySelector('#game-screen');
	const bodyElement = document.querySelector('body');
	const level = document.querySelector('#level');

	// Get the selected avatar and its evolution
	const selectedAvatarInput = document.querySelector('input[name="avatar"]:checked');
	const avatarValue = selectedAvatarInput.value;
	const avatarEvolution = selectedAvatarInput.getAttribute('data-evolution');
	avatarGif.src = `imgs/${avatarValue}-${avatarEvolution}.gif`;
  
	startScreen.style.display = 'none';
	gameScreen.style.display = 'block';
	bodyElement.classList.add('game-background');
	
	level.textContent = `Level ${avatarEvolution}`

	// Reset the gameTime
	hours = 6;
	minutes = 0;
  
	changeBackground();
	updateClock(); // Call the updateClock function here
	decayStatusBars();
	updateGreeting(); // Display the initial greeting
	startIntervals(); // Start the intervals
}

function evolveAvatar() {
	const selectedAvatarInput = document.querySelector('input[name="avatar"]:checked');
	const avatarValue = selectedAvatarInput.value;
	const currentEvolution = parseInt(selectedAvatarInput.getAttribute('data-evolution'), 10);
	const level = document.querySelector('#level');

	// Check if the avatar can evolve further (max 3 evolutions)
	if (currentEvolution < 3) {
	  // Update the avatar's evolution
	  const newEvolution = currentEvolution + 1;
	  selectedAvatarInput.setAttribute('data-evolution', newEvolution);
	  level.textContent = `Level ${newEvolution}`;
	  // Change the avatar gif based on the new evolution
	  changeAvatarGif(avatarValue, 0, newEvolution);
	}
}

// Update the decayStatusBars function
function decayStatusBars() {
	if (gameOverDisplayed == true) {
		return;
	}

	hunger = Math.max(hunger - 5, 0);
	energy = Math.max(energy - 5, 0);
	happiness = Math.max(happiness - 5, 0);
	health = Math.max(health - 5, 0);
  
	// Health decay if any of the other bars are at 0
	if (hunger === 0 || energy === 0 || happiness === 0) {
		health = Math.max(health - 1, 0);
	  } else {
		health = Math.max(health - 5, 0);
	}
	
	// End the game when health reaches 0
	if (health === 0) {
		displayGameOver(); // Function to display game over text and restart button
		stopGame();
		gameOverDisplayed = true;
	}

	updateStatusBar(hunger, hungerBar);
	updateStatusBar(energy, energyBar);
	updateStatusBar(happiness, happinessBar);
	updateStatusBar(health, healthBar);
}
  
function startIntervals() {
	// Decay the status bars every 5 seconds
	setInterval(decayStatusBars, 5000);
	// Evolve the avatar every 6 minutes
	setInterval(evolveAvatar, 360000);
}

// Greet the player based on time
function updateGreeting() {
	const gameTime = getGameTime();
	let greeting;
	const username = document.querySelector('#username-input').value;
  
	if (gameTime >= '06:00' && gameTime < '12:00') {
	  greeting = `Good morning, ${username}!`;
	} else if (gameTime >= '12:00' && gameTime < '16:59') {
	  greeting = `Good afternoon, ${username}!`;
	} else if (gameTime >= '17:00' && gameTime < '22:00') {
	  greeting = `Good evening, ${username}!`;
	} else {
	  greeting = `Goodnight, ${username}!`;
	}
  
	const greetingElement = document.querySelector('#greeting');
	greetingElement.textContent = greeting;
}
  
// Call the updateClock function
updateClock();

let minigameCanvas;
let minigameCtx;
let minigameInterval;
let snake;
let star;

function initMinigame() {
	minigameCanvas = document.getElementById('minigame');
	minigameCtx = minigameCanvas.getContext('2d');
	snake = [
		{ x: minigameCanvas.width / 2, y: minigameCanvas.height / 2 },
	];
	star = newStar();

	minigameInterval = setInterval(() => {
		updateMinigame();
		drawMinigame();
	}, 500);
	document.addEventListener('keydown', handleKeydown);
}

function updateMinigame() {
    const newHead = {
        x: snake[0].x,
        y: snake[0].y,
    };

    switch (direction) {
        case 'left':
            newHead.x -= 10;
            break;
        case 'up':
            newHead.y -= 10;
            break;
        case 'right':
            newHead.x += 10;
            break;
        case 'down':
            newHead.y += 10;
            break;
    }

    // Check if the snake hit the border or collided with itself
    if (newHead.x < 0 || newHead.x >= minigameCanvas.width ||
        newHead.y < 0 || newHead.y >= minigameCanvas.height ||
        isCollidingWithItself(newHead)) {
        closeMinigame();
        return;
    }

    snake.unshift(newHead);

    if (newHead.x === star.x && newHead.y === star.y) {
        star = newStar();
        eatStar();
    } else {
        snake.pop();
    }
}

function isCollidingWithItself(head) {
    for (const segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            return true;
        }
    }
    return false;
}


function drawMinigame() {
	minigameCtx.clearRect(0, 0, minigameCanvas.width, minigameCanvas.height);

	minigameCtx.fillStyle = 'lime';
	for (const segment of snake) {
		minigameCtx.fillRect(segment.x, segment.y, 10, 10);
	}

	minigameCtx.fillStyle = 'red';
	minigameCtx.fillRect(star.x, star.y, 10, 10);
}

let direction = 'right';

function handleKeydown(event) {
	const key = event.key;

	switch (key) {
		case 'w':
			if (direction !== 'down') direction = 'up';
			break;
		case 'a':
			if (direction !== 'right') direction = 'left';
			break;
		case 's':
			if (direction !== 'up') direction = 'down';
			break;
		case 'd':
			if (direction !== 'left') direction = 'right';
			break;
	}
}

function newStar() {
	return {
		x: Math.floor(Math.random() * (minigameCanvas.width / 10)) * 10,
		y: Math.floor(Math.random() * (minigameCanvas.height / 10)) * 10,
	};
}

function eatStar() {
	if (energy < 10) {
		happiness += 10;
	} else {
		happiness += 25;
	}
	hunger -= 1;
	energy -= 2;
	health += 1;
	updateStatusBar(happiness, happinessBar);
	updateStatusBar(hunger, hungerBar);
	updateStatusBar(energy, energyBar);
	updateStatusBar(health, healthBar);
}

function closeMinigame() {
	// Hide the minigame container
	const minigameContainer = document.getElementById("minigame-container");
	minigameContainer.style.display = "none";

	// Clear the minigame interval
	clearInterval(minigameInterval);
}


playButton.addEventListener('click', function () {
	// Show the minigame container
	const minigameContainer = document.getElementById("minigame-container");
	minigameContainer.style.display = "block";

	// Initialize the minigame
	initMinigame();
});

function displayGameOver() {
	const gameOverOverlay = document.querySelector('#game-over-overlay');
	gameOverOverlay.style.display = 'flex';
  
	const restartButton = document.querySelector('#restart-btn');
	restartButton.addEventListener('click', function () {
	  location.reload();
	});
}

function stopGame() {
	stopClock();
	disableButtons();
}

function disableButtons() {
	feedButton.disabled = true;
	sleepButton.disabled = true;
	pillButton.disabled = true;
	playButton.disabled = true;
}

