const CANVAS_SIZE = {
    width: 800,
    height: 600
}

class MainMenu extends Phaser.Scene
    {
        init() {
            this.addCustomFont();
        }

        preload ()
        {
            this.load.image('sky', 'assets/space3.png');
            this.load.image('red', 'assets/red.png');
            this.load.image('ballRed', 'assets/orb-red.png');
        }

        create ()
        {
            this.add.image(400, 300, 'sky');

            const particles = this.add.particles(0, 0, 'red', {
                speed: 100,
                scale: { start: 0.25, end: 0 },
                blendMode: 'ADD',
                lifespan: 250,
            });

            const ball = this.physics.add.image(16, 16, 'ballRed');
            ball.setVelocity(100, 200);
            ball.setBounce(1, 1);
            ball.setCollideWorldBounds(true);
            particles.startFollow(ball);

            const pos = {x: 0, y: CANVAS_SIZE.height / 2};
            
            const title = this.add.text(pos.x, pos.y, 'PONG',
                {   fontFamily: 'Plaza-Bold', 
                    fontSize: 150,
                    color: '#00FFFF' 
                });
                
            this.tweens.add({
                targets: title,
                x: CANVAS_SIZE.width / 3,
                ease: 'Power1',
                duration: 2000
            });
        }

        addCustomFont() {
            const element = document.createElement('style');

            document.head.appendChild(element);
    
            const sheet = element.sheet;
    
            let styles = '@font-face { font-family: "Plaza-Bold"; src: url("assets/fonts/Plaza-Bold.otf") format("opentype"); }\n';
    
            sheet.insertRule(styles, 0);
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
                gravity: { y: 200 }
            }
        }
    };

    const game = new Phaser.Game(config);