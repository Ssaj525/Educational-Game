
var i = 0;
let isPaused = false;
      let distanceTraveled = 0;
      let currentQuestionIndex = 0;

      // Fetch integration and derivation formulas from the JSON file
      fetch("formulas.json")
        .then((response) => response.json())
        .then((data) => {
          // Concatenate integration and derivation questions and options
          const questionsWithOptions = data.integration.concat(data.derivation);
          // Show overlay for 2 seconds
          setTimeout(function () {
            document.querySelector(".overlay").style.display = "none";
            document.querySelector("#container").style.display = "inline-block"; // Show game container
          }, 2000);
          // Update distance traveled every 100 milliseconds
          setInterval(function () {
            if (!isPaused) {
              distanceTraveled += 1;
              document.getElementById(
                "distance"
              ).textContent = `Distance: ${distanceTraveled} meters`;
              if (distanceTraveled % 100 === 0) {
                // If distance traveled is a multiple of 100, show a question
                const randomColor = getRandomColor();
                document.getElementById("distance").style.color = randomColor;
                showQuestion(questionsWithOptions);
              }
            }
          }, 100);
        })
        .catch((error) => console.error("Error fetching formulas:", error));
      function getRandomColor() {
        // Generate random color in hexadecimal format
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
      }
      function showQuestion(questionsWithOptions) {
        // Pause the game
        isPaused = true;
        // Show a random question
        const question =
          questionsWithOptions[
            Math.floor(Math.random() * questionsWithOptions.length)
          ];
        document.getElementById("question").textContent = question.question;
        const optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = "";
        question.options.forEach((option) => {
          const optionElement = document.createElement("div");
          optionElement.classList.add("option");
          optionElement.textContent = option;
          optionElement.onclick = () => checkAnswer(option, question.answer);
          optionsContainer.appendChild(optionElement);
        });
        document.querySelector(".overlay").style.display = "flex";
      }

      function checkAnswer(answer, correctAnswer) {
        if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
          // Correct answer
          distanceTraveled += 100; // Increment distance traveled
          document.querySelector(".overlay").style.display = "none"; // Hide modal
          isPaused = false; // Resume the game
        } else {
          // Incorrect answer, show retry button
          document.querySelector(".retry-button").style.display = "block";
        }
      }

      // Retry the game
      function retry() {
        distanceTraveled = 0; // Reset distance traveled
        document.querySelector(".overlay").style.display = "none"; // Hide modal
        document.querySelector(".retry-button").style.display = "none"; // Hide retry button
        isPaused = false; // Resume the game
      }
function random(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function randomChoice(array) {
  return array[Math.round(random(0, array.length - 1))];
}

var InfiniteRunner = Sketch.create({
  fullscreen: false,
  width: 640,
  height: 360,
  container: document.getElementById("container"),
});

/*******************/
/*****VECTOR2*******/
/******************/

function Vector2(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.previousX = 0;
  this.previousY = 0;
}

Vector2.prototype.setPosition = function (x, y) {
  this.previousX = this.x;
  this.previousY = this.y;

  this.x = x;
  this.y = y;
};

Vector2.prototype.setX = function (x) {
  this.previousX = this.x;
  this.x = x;
};

Vector2.prototype.setY = function (y) {
  this.previousY = this.y;
  this.y = y;
};

Vector2.prototype.insercects = function (obj) {
  if (
    obj.x < this.x + this.width &&
    obj.y < this.y + this.height &&
    obj.x + obj.width > this.x &&
    obj.y + obj.height > this.y
  ) {
    return true;
  }

  return false;
};

Vector2.prototype.insercectsLeft = function (obj) {
  if (obj.x < this.x + this.width && obj.y < this.y + this.height) {
    return true;
  }

  return false;
};

/****************/
/*****PLAYER****/
/**************/

function Player(options) {
  this.setPosition(options.x, options.y);
  this.width = options.width;
  this.height = options.height;
  this.velocityX = 0;
  this.velocityY = 0;
  this.jumpSize = -13;
  this.color = "#181818";
}

Player.prototype = new Vector2();

Player.prototype.update = function () {
  // Check if the game is paused
  if (isPaused) {
    return; // Exit the function without updating the player's position
  }

  // Update the player's velocity and position
  this.velocityY += 1;
  this.setPosition(this.x + this.velocityX, this.y + this.velocityY);

  // Reset player's position if it falls off the screen
  if (this.y > InfiniteRunner.height || this.x + this.width < 0) {
    this.x = 150;
    this.y = 50;
    this.velocityX = 0;
    this.velocityY = 0;
    InfiniteRunner.jumpCount = 0;
    InfiniteRunner.aceleration = 0;
    InfiniteRunner.acelerationTweening = 0;
    distanceTraveled = 0;
    InfiniteRunner.scoreColor = "#181818";
    InfiniteRunner.platformManager.maxDistanceBetween = 350;
    InfiniteRunner.platformManager.updateWhenLose();
  }

  // Adjust player's velocity when jumping
  if (
    (InfiniteRunner.keys.UP ||
      InfiniteRunner.keys.SPACE ||
      InfiniteRunner.keys.W ||
      InfiniteRunner.dragging) &&
    this.velocityY < -8
  ) {
    this.velocityY += -0.75;
  }
};

Player.prototype.draw = function () {
  InfiniteRunner.fillStyle = this.color;
  InfiniteRunner.fillRect(this.x, this.y, this.width, this.height);
};

/*******************/
/*****platform****/
/******************/

function Platform(options) {
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.height = options.height;
  this.previousX = 0;
  this.previousY = 0;
  this.color = options.color;
}

Platform.prototype = new Vector2();

Platform.prototype.draw = function () {
  InfiniteRunner.fillStyle = this.color;
  InfiniteRunner.fillRect(this.x, this.y, this.width, this.height);
};

/*******************PLATFORM MANAGER*************/

function PlatformManager() {
  this.maxDistanceBetween = 300;
  this.colors = ["#2ca8c2", "#98cb4a", "#f76d3c", "#f15f74", "#5481e6"];

  this.first = new Platform({
    x: 300,
    y: InfiniteRunner.width / 2,
    width: 400,
    height: 70,
  });
  this.second = new Platform({
    x:
      this.first.x +
      this.first.width +
      random(this.maxDistanceBetween - 150, this.maxDistanceBetween),
    y: random(this.first.y - 128, InfiniteRunner.height - 80),
    width: 400,
    height: 70,
  });
  this.third = new Platform({
    x:
      this.second.x +
      this.second.width +
      random(this.maxDistanceBetween - 150, this.maxDistanceBetween),
    y: random(this.second.y - 128, InfiniteRunner.height - 80),
    width: 400,
    height: 70,
  });

  this.first.height = this.first.y + InfiniteRunner.height;
  this.second.height = this.second.y + InfiniteRunner.height;
  this.third.height = this.third.y + InfiniteRunner.height;
  this.first.color = randomChoice(this.colors);
  this.second.color = randomChoice(this.colors);
  this.third.color = randomChoice(this.colors);

  this.colliding = false;

  this.platforms = [this.first, this.second, this.third];
}

PlatformManager.prototype.update = function () {
  this.first.x -= 3 + InfiniteRunner.aceleration;
  if (this.first.x + this.first.width < 0) {
    this.first.width = random(450, InfiniteRunner.width + 200);
    this.first.x =
      this.third.x +
      this.third.width +
      random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
    this.first.y = random(this.third.y - 32, InfiniteRunner.height - 80);
    this.first.height = this.first.y + InfiniteRunner.height + 10;
    this.first.color = randomChoice(this.colors);
  }

  this.second.x -= 3 + InfiniteRunner.aceleration;
  if (this.second.x + this.second.width < 0) {
    this.second.width = random(450, InfiniteRunner.width + 200);
    this.second.x =
      this.first.x +
      this.first.width +
      random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
    this.second.y = random(this.first.y - 32, InfiniteRunner.height - 80);
    this.second.height = this.second.y + InfiniteRunner.height + 10;
    this.second.color = randomChoice(this.colors);
  }

  this.third.x -= 3 + InfiniteRunner.aceleration;
  if (this.third.x + this.third.width < 0) {
    this.third.width = random(450, InfiniteRunner.width + 200);
    this.third.x =
      this.second.x +
      this.second.width +
      random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
    this.third.y = random(this.second.y - 32, InfiniteRunner.height - 80);
    this.third.height = this.third.y + InfiniteRunner.height + 10;
    this.third.color = randomChoice(this.colors);
  }
};
// Add touch event listeners to handle touch input
document.addEventListener("touchstart", function (event) {
  InfiniteRunner.keys.UP = true; // Simulate jump when touch begins
});

document.addEventListener("touchend", function (event) {
  InfiniteRunner.keys.UP = false; // Release jump when touch ends
});

// Add touchmove event listener to handle dragging
document.addEventListener("touchmove", function (event) {
  // Get touch position relative to the container
  var touchX = event.touches[0].clientX - InfiniteRunner.container.offsetLeft;
  var touchY = event.touches[0].clientY - InfiniteRunner.container.offsetTop;

  // Check if touch position is within the player's bounding box
  if (
    touchX > InfiniteRunner.player.x &&
    touchX < InfiniteRunner.player.x + InfiniteRunner.player.width &&
    touchY > InfiniteRunner.player.y &&
    touchY < InfiniteRunner.player.y + InfiniteRunner.player.height
  ) {
    // If touch is within player's bounding box, set dragging to true
    InfiniteRunner.dragging = true;
  } else {
    InfiniteRunner.dragging = false;
  }
});

// Disable default touch behaviors to prevent scrolling and zooming
document.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);

PlatformManager.prototype.updateWhenLose = function () {
  this.first.x = 300;
  this.first.color = randomChoice(this.colors);
  this.first.y = InfiniteRunner.width / random(2, 3);
  this.second.x =
    this.first.x +
    this.first.width +
    random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
  this.third.x =
    this.second.x +
    this.second.width +
    random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
};

/*******************PARTICLE SYSTEM*************/

function Particle(options) {
  this.x = options.x;
  this.y = options.y;
  this.size = 10;
  this.velocityX =
    options.velocityX ||
    random(
      -(InfiniteRunner.aceleration * 3) + -8,
      -(InfiniteRunner.aceleration * 3)
    );
  this.velocityY =
    options.velocityY ||
    random(
      -(InfiniteRunner.aceleration * 3) + -8,
      -(InfiniteRunner.aceleration * 3)
    );
  this.color = options.color;
}

Particle.prototype.update = function () {
  this.x += this.velocityX;
  this.y += this.velocityY;
  this.size *= 0.89;
};

Particle.prototype.draw = function () {
  InfiniteRunner.fillStyle = this.color;
  InfiniteRunner.fillRect(this.x, this.y, this.size, this.size);
};

/************************************************/

InfiniteRunner.setup = function () {
  this.jumpCount = 0;
  this.aceleration = 0;
  this.acelerationTweening = 0;

  this.player = new Player({ x: 150, y: 30, width: 32, height: 32 });

  this.platformManager = new PlatformManager();

  this.particles = [];
  this.particlesIndex = 0;
  this.particlesMax = 20;
  this.collidedPlatform = null;
  this.scoreColor = "#181818";
  this.jumpCountRecord = 0;
};

InfiniteRunner.update = function () {
  this.player.update();
  if (isPaused) {
    return; // Exit the function without updating the player's position
  }
  switch (this.jumpCount) {
    case 10:
      this.acelerationTweening = 1;
      this.platformManager.maxDistanceBetween = 430;
      this.scoreColor = "#076C00";
      break;
    case 25:
      this.acelerationTweening = 2;
      this.platformManager.maxDistanceBetween = 530;
      this.scoreColor = "#0300A9";
      break;
    case 40:
      this.acelerationTweening = 3;
      this.platformManager.maxDistanceBetween = 580;
      this.scoreColor = "#9F8F00";
      break;
  }

  this.aceleration += (this.acelerationTweening - this.aceleration) * 0.01;

  for (i = 0; i < this.platformManager.platforms.length; i++) {
    if (this.player.insercects(this.platformManager.platforms[i])) {
      this.collidedPlatform = this.platformManager.platforms[i];
      if (this.player.y < this.platformManager.platforms[i].y) {
        this.player.y = this.platformManager.platforms[i].y;
        this.player.velocityY = 0;
      }

      this.player.x = this.player.previousX;
      this.player.y = this.player.previousY;

      this.particles[this.particlesIndex++ % this.particlesMax] = new Particle({
        x: this.player.x,
        y: this.player.y + this.player.height,
        color: this.collidedPlatform.color,
      });

      if (this.player.insercectsLeft(this.platformManager.platforms[i])) {
        this.player.x = this.collidedPlatform.x - 64;
        for (i = 0; i < 10; i++) {
          this.particles[this.particlesIndex++ % this.particlesMax] =
            new Particle({
              x: this.player.x + this.player.width,
              y: random(this.player.y, this.player.y + this.player.height),
              velocityY: random(-30, 30),
              color: randomChoice([
                "#181818",
                "#181818",
                this.collidedPlatform.color,
              ]),
            });
        }
        this.player.velocityY = -10 + -(this.aceleration * 4);
        this.player.velocityX = -20 + -(this.aceleration * 4);
        // this.jumpCount = 0;
        // this.aceleration = 0;
        // this.acelerationTweening = 0;
        // this.scoreColor = '#181818';
        // this.platformManager.maxDistanceBetween = 350;
        // this.platformManager.updateWhenLose();
      } else {
        if (this.dragging || this.keys.SPACE || this.keys.UP || this.keys.W) {
          this.player.velocityY = this.player.jumpSize;
          this.jumpCount++;
          if (this.jumpCount > this.jumpCountRecord) {
            this.jumpCountRecord = this.jumpCount;
          }
        }
      }
    }
  }

  for (i = 0; i < this.platformManager.platforms.length; i++) {
    this.platformManager.update();
  }

  for (i = 0; i < this.particles.length; i++) {
    this.particles[i].update();
  }
};

InfiniteRunner.draw = function () {
  this.player.draw();

  for (i = 0; i < this.platformManager.platforms.length; i++) {
    this.platformManager.platforms[i].draw();
  }

  for (i = 0; i < this.particles.length; i++) {
    this.particles[i].draw();
  }

  this.font = "12pt Arial";
  this.fillStyle = "#181818";
  this.fillText(
    "RECORD: " + this.jumpCountRecord,
    this.width - (150 + this.aceleration * 4),
    33 - this.aceleration * 4
  );
  this.fillStyle = this.scoreColor;
  this.font = 12 + this.aceleration * 3 + "pt Arial";
  this.fillText(
    "JUMPS: " + this.jumpCount,
    this.width - (150 + this.aceleration * 4),
    50
  );
};

InfiniteRunner.resize = function () {};
