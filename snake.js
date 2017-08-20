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
    context.fillRect(x, y, bodySize, bodySize);
  }

  function addBody(position) {
    snake.push({
      x: position.x + velocity.x * -1,
      y: position.y + velocity.y * -1,
    });
  }

  function hasHitTarget(target, object) {
    return object.x === target.x && object.y === target.y;
  }

  function hasHitOwnTail(snake) {
    return !!snake.find((body, index) => index && hasHitTarget(body, snake[0]));
  }

  function isOutOfBounds({minX, maxX, minY, maxY}, target) {
    return target.x < minX || target.x > maxX || target.y < minY || target.y > maxY;
  }

  function onKeyDown(event) {
    if (!velocity.x && (event.keyCode === 37 || event.keyCode === 39)) {
      velocity.x = event.keyCode === 37 ? -1 : 1;
      velocity.y = 0;
    }

    if (!velocity.y && (event.keyCode === 38 || event.keyCode === 40)) {
      velocity.x = 0;
      velocity.y = event.keyCode === 38 ? -1 : 1;
    }
  }

  init();
})(document);
