const CANVAS_SIZE = {width: 800, height: 600};

class MainMenu extends Phaser.Scene {
    
    topLabel = null;
    button = null;
    timer = null;
    particles = null;
    isRunning = false;
    brickObjects = [];
    brickData = {}; // { name : string, filepath : string}
    loadingProgress = 0.0;
    brickColors = ['red', 'blue', 'green', 'purple', 'silver', 'yellow'];

    init() {
        this.addCustomFont();
        this.buildBrickData();
    }

    preload() {
        this.load.image('sky', 'assets/space3.png');
        this.load.image('red', 'assets/red.png');
        this.load.image('ballRed', 'assets/orb-red.png');
        this.load.image('paddle', 'assets/paddle2.png');
        this.preloadBricks();
    }

    create() {
        this.addWorldInteractions();
        const sky = this.add.image(0, 0, 'sky');
        sky.setOrigin(0, 0);
        this.showTopLabel('Breakout');
        this.showButton('START', () => { this.startGame(); });
    }

    update(time, delta) {
        if (!this.isRunning) {
            return;
        }

        const pointer = this.input.activePointer;
        this.paddle.x = pointer.x;

        if (this.ball.y > CANVAS_SIZE.height + 100) {
            this.isRunning = false;
            this.gameOver();
        }
    }

    gameOver() {
        this.ball.disableBody(true, true);
        this.paddle.disableBody(true, true);
        this.showGameOver();
        this.removeBricks();
    }

    clearLabels() {
        this.topLabel.destroy();
        this.button.destroy();
    }

    cleanup() {
        this.removeAllBricks();
    }

    showGameOver() {
        this.showTopLabel('Game Over');
        this.showButton('Reset', () => {
            this.cleanup();
            this.clearLabels();
            this.init();
            this.create();
        });
    }

    startGame() {
        this.clearLabels();
        this.addBall();
        this.addBricks();
        this.addPaddle();

        this.isRunning = true;
    }

    buildBrickData() {
        this.brickColors.forEach((color) => {
            const filepath = `assets/${color}1.png`;
            const filepath2 = `assets/${color}2.png`;
            const name = `${color}1`;
            const name2 = `${color}2`;
            this.brickData[name] = filepath;
            this.brickData[name2] = filepath2;
        });
    }

    preloadBricks() {
        const objects = Object.values(this.brickData);
        const keys = Object.keys(this.brickData);
        objects.forEach((filename, index) => {
            const name = keys[index];
            this.load.image(name, filename);
        });
    }

    addPaddle() {
        this.paddle = this.physics.add.image(CANVAS_SIZE.width / 2, CANVAS_SIZE.height - 30, 'paddle');
        this.paddle.setPushable(false);
        this.paddle.setCollideWorldBounds(true);
        this.paddle.setInteractive({ draggable: true });
        this.physics.add.collider(this.paddle, this.ball);
    }

    addCustomFont() {
        const element = document.createElement('style');
        document.head.appendChild(element);
        const sheet = element.sheet;
        let styles = '@font-face { font-family: "Plaza-Bold"; src: url("assets/fonts/Plaza-Bold.otf") format("opentype"); }\n';
        sheet.insertRule(styles, 0);
    }

    addBricks() {
        for (var x = 0; x < 12; x++) {
            for (var y = 0; y < 5; y++) {
                const bricks = Object.keys(this.brickData);
                const rand = Phaser.Math.Between(0, bricks.length - 1);
                const name = bricks[rand];
                this.addBrick(x, y, name);
            }
        }
    }

    removeBricks() {
        const repeatCount = this.brickObjects.length - 1;
        this.timer = this.time.addEvent({
            repeat: repeatCount, delay: 150, callback: () => {
                this.removeRandomBrick();
            }
        });
    }

    removeAllBricks() {
        this.timer.destroy();
        for (var x = 0; x < this.brickObjects.length; x++) {
            const brick = this.brickObjects[x];
            brick.disableBody(true, true);
        }
        this.brickObjects = [];
        this.brickData = [];
    }

    removeRandomBrick() {
        const index = Phaser.Math.Between(0, this.brickObjects.length - 1);
        const brick = this.brickObjects[index];
        brick.disableBody(true, true);
        this.brickObjects.splice(index, 1);
    }

    gameWin() {
        this.isRunning = false;
        this.particles.destroy();
        this.paddle.disableBody(true, true);
        this.ball.disableBody(true, true);
        this.showTopLabel('YOU WON!');
        this.showButton('RESET', () => {
            this.clearLabels();
            this.init();
            this.create();
        });
    }

    addBrick(x, y, name) {
        const width = 64;
        const height = 32;
        const brick = this.physics.add.image(x * width, y * height, name);
        brick.x += 15;
        brick.y += 15;
        brick.setOrigin(0, 0);
        brick.setGravity(0, 0);
        brick.setImmovable(true);
        const collider = this.physics.add.collider(brick, this.ball);
        this.brickObjects.push(brick);
        collider.collideCallback = (_object1, _object2) => {
            const index = this.brickObjects.indexOf(brick);
            this.brickObjects.splice(index, 1);
            brick.disableBody(true, true);
            const length = this.brickObjects.length;
            if (length == 0) {
                this.gameWin();
            }
        };
    }

    addBall() {
        const particles = this.add.particles(0, 0, 'red', {
            speed: 100,
            scale: { start: 0.25, end: 0 },
            blendMode: 'ADD',
            lifespan: 250,
        });
        const ball = this.physics.add.image(CANVAS_SIZE.width / 2, CANVAS_SIZE.height - 60, 'ballRed');
        ball.setVelocity(500, 500);
        ball.setBounce(1, 1);
        ball.setCollideWorldBounds(true);
        particles.startFollow(ball);
        this.ball = ball;
        this.particles = particles;
    }

    addWorldInteractions() {
        this.physics.world.setBoundsCollision(true, true, true, false);
    }

    showTopLabel(textString) {
        const pos = { x: CANVAS_SIZE.width / 2, y: 0 };
        const label = this.add.text(pos.x, pos.y, textString,
            {
                fontFamily: 'Plaza-Bold',
                fontSize: 100,
                color: '#00FFFF'
            });
        label.setOrigin(0.5, 0.5);
        this.tweens.add({
            targets: label,
            y: CANVAS_SIZE.height - 250,
            ease: 'Power1',
            duration: 2000
        });
        this.topLabel = label;
    }

    showButton(textString, func) {
        const button = this.add.text(CANVAS_SIZE.width / 2, CANVAS_SIZE.height, textString, {
            fontSize: 50
        });
        button.setOrigin(0.5, 0);
        button.setInteractive();
        button.on('pointerup', () => {
            func();
        });
        this.tweens.add({
            targets: button,
            y: CANVAS_SIZE.height - 150,
            ease: 'Power1',
            duration: 2000
        });
        this.button = button;
    }
}

const config = {
    type: Phaser.AUTO,
    width: CANVAS_SIZE.width,
    height: CANVAS_SIZE.height,
    scene: MainMenu,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);