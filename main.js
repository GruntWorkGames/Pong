

const CANVAS_SIZE = {
    width: 800,
    height: 600
}

class MainMenu extends Phaser.Scene
    {
        initVars() {
            this.brickObjects = [];
            this.brickData = {};
            this.brickColors = ['red','blue','green','purple','silver','yellow'];
        }

        buildBrickData() {
            this.brickColors.forEach((color, index)=>{
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
            objects.forEach((filename, index, _) => {
                const name = keys[index];
                this.load.image(name, filename);
            });
        }

        init() {
            this.initVars();
            this.addCustomFont();
            this.buildBrickData();
        }

        preload ()
        {
            this.load.image('sky', 'assets/space3.png');
            this.load.image('red', 'assets/red.png');
            this.load.image('ballRed', 'assets/orb-red.png');
            this.preloadBricks();
        }

        create ()
        {
            this.add.image(400, 300, 'sky');
            this.addBall();
            const pos = {x: CANVAS_SIZE.width / 2, y: 0};
            const title = this.add.text(pos.x, pos.y, 'Breakout',
                {   fontFamily: 'Plaza-Bold', 
                    fontSize: 100,
                    color: '#00FFFF' 
                });
            title.setOrigin(0.5,0.5);
                
            this.tweens.add({
                targets: title,
                y: CANVAS_SIZE.height - 250,
                ease: 'Power1',
                duration: 2000
            });

            const startBtn = this.add.text(title.x, CANVAS_SIZE.height, 'Start', {
                fontSize: 50
            });
            startBtn.setOrigin(0.5,0);
            startBtn.setInteractive();
            startBtn.on('pointerup', () => {
                console.log('clicked text object');
            });
            this.tweens.add({
                targets: startBtn,
                y: CANVAS_SIZE.height - 150,
                ease: 'Power1',
                duration: 2000
            });

            this.addBricks();
        }

        addCustomFont() {
            const element = document.createElement('style');
            document.head.appendChild(element);
            const sheet = element.sheet;
            let styles = '@font-face { font-family: "Plaza-Bold"; src: url("assets/fonts/Plaza-Bold.otf") format("opentype"); }\n';
            sheet.insertRule(styles, 0);
        }

        addBricks() {
            for(var x=0;x<12;x++) {
                for(var y=0;y<5;y++){
                    const bricks = Object.keys(this.brickData);
                    const rand = Phaser.Math.Between(0, bricks.length-1);
                    const name = bricks[rand];
                    this.addBrick(x, y, name);
                }
            }
        }

        addBrick(x, y, name) {
            const width = 64;
            const height = 32;
            const brick = this.physics.add.image(x * width, y * height, name);
            brick.x += 15;
            brick.y += 15;
            brick.setOrigin(0,0);
            brick.setGravity(0,0);
            brick.setImmovable(true);
            const collider = this.physics.add.collider(brick, this.ball);
            this.brickObjects.push(brick);
            collider.collideCallback = (_object1, _object2) => {
                const index = this.brickObjects.indexOf(brick);
                this.brickObjects.splice(index, 1);
                brick.disableBody(true, true);
                const length = this.brickObjects.length;
                if(length == 0) {
                    console.log('you won!');
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

            const ball = this.physics.add.image(CANVAS_SIZE.width/2, CANVAS_SIZE.height - 60, 'ballRed');
            ball.setVelocity(500, 500);
            ball.setBounce(1, 1);
            ball.setCollideWorldBounds(true);
            particles.startFollow(ball);
            this.ball = ball;
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