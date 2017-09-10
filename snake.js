((document) => {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const speed = 100;
  const bodySize = 10;
  const bounds = { minX: 0, maxX: canvas.width - bodySize, minY: 0, maxY: canvas.height - bodySize};
  
  let velocity = {};
  let snake = [];
  let food = {};

  function init() {
    document.addEventListener('keydown', onKeyDown);
    reset();
    update();
  }

  function reset() {
    velocity = { x: 1, y: 0 };
    snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
    food = {};
    addBody(snake[0]);
    addBody(snake[0]);
    addBody(snake[0]);
    spawnFood();
  }

  function update() {
    for (let i = snake.length - 1; i >= 1; i--) {
      snake[i] = Object.assign({}, snake[i - 1]);
    }

    snake[0].x += velocity.x * bodySize;
    snake[0].y += velocity.y * bodySize;

    draw();

    if (hasHitTarget(food, snake[0])) {
      addBody(food);
      spawnFood();
    }

    if (isOutOfBounds(bounds, snake[0]) || hasHitOwnTail(snake)) {
      reset();
    }

    setTimeout(update, speed);
  }

  function spawnFood() {
    const x = Math.floor(Math.random() * canvas.width / bodySize) * bodySize;
    const y = Math.floor(Math.random() * canvas.height / bodySize) * bodySize;
    food = { x, y };
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(food.x, food.y, bodySize, bodySize, '#999');
    snake.forEach(({ x, y }) => drawRect(x, y, bodySize, bodySize, '#fff'));
  }

  function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
  }

  function addBody({ x, y }) {
    snake.push({ x: x + velocity.x * -1, y: y + velocity.y * -1 });
  }

  function hasHitTarget({ x: x1, y: y1 }, { x: x2, y: y2 }) {
    return x2 === x1 && y2 === y1;
  }

  function hasHitOwnTail(snake) {
    return !!snake.find((body, index) => index && hasHitTarget(body, snake[0]));
  }

  function isOutOfBounds({ minX, maxX, minY, maxY }, { x, y }) {
    return x < minX || x > maxX || y < minY || y > maxY;
  }

  function onKeyDown({ keyCode }) {
    if (!velocity.x && (keyCode === 37 || keyCode === 39)) {
      velocity.x = keyCode === 37 ? -1 : 1;
      velocity.y = 0;
    }

    if (!velocity.y && (keyCode === 38 || keyCode === 40)) {
      velocity.x = 0;
      velocity.y = keyCode === 38 ? -1 : 1;
    }
  }

  init();
})(document);
