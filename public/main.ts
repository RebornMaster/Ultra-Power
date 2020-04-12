﻿console.log("hello!");

class Player
{
    sprite: Phaser.Physics.Arcade.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string | number)
    {
        this.sprite = scene.physics.add.sprite.bind(scene, [x, y, texture, frame]);
    }
}

class TileMap
{
    map: Phaser.Tilemaps.Tilemap;
    obstacles: Phaser.Tilemaps.StaticTilemapLayer;
    grass: Phaser.Tilemaps.StaticTilemapLayer;

    constructor(scene: Phaser.Scene, config: Phaser.Types.Phaser.Tilemaps.TilemapConfig)
    {
        this.map = scene.make.tilemap.bind(scene, [config]);
    }
}
 

class BootScene extends Phaser.Scene {

	constructor() {
		super('BootScene');
	};

	preload() {
		// map tiles
		this.load.image('tiles', 'assets/map/spritesheet.png');

		// map in json format
		this.load.tilemapTiledJSON('map', 'assets/map/map.json');

		// our two characters
		this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
	};

	create() {
		this.scene.start('WorldScene');
	};
};

class WorldScene extends Phaser.Scene {

    map: Phaser.Tilemaps.Tilemap;
    grass: Phaser.Tilemaps.StaticTilemapLayer;
    obstacles: Phaser.Tilemaps.StaticTilemapLayer;

    player: Player;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor()
    {
		super('WorldScene');
	}

    preload()
    {
	}

    create() {

        this.createMap();

        // Create Animations
        this.createLpcAnimDatabase([
            { name: 'spell_cast', numOfFrames: 7 },
            { name: 'thrust', numOfFrames: 8 },
            { name: 'walk', numOfFrames: 9 },
            { name: 'slash', numOfFrames: 6 },
            { name: 'shoot', numOfFrames: 13},
		]);

        this.player = this.createPlayer();

        this.cursors = this.input.keyboard.createCursorKeys();
	}

    createMap()
    {
        this.map = this.make.tilemap({ key: 'map' });
        const tiles = this.map.addTilesetImage('spritesheet', 'tiles');

        this.grass = this.map.createStaticLayer('Grass', tiles, 0, 0);
        this.obstacles = this.map.createStaticLayer('Obstacles', tiles, 0, 0);
        this.obstacles.setCollisionByExclusion([-1]);
	}

    createPlayer()
    {
        this.player = new Player(this, 50, 100, 'player', 6);

        this.physics.world.bounds.width = this.map.widthInPixels;
        this.physics.world.bounds.height = this.map.heightInPixels;

        this.player.sprite.setCollideWorldBounds(true);

        return this.player; 
	}

    createLpcAnimDatabase(listOfAnims: { name: string, numOfFrames: number }[]) {
		let lpcReels: any = {};

		var maxRowSize = 24;
		var directions = ["up", "right", "down", "left"];

		var lastIndex = 0;
		for (let i = 0; i < listOfAnims.length; i++) {
			let currAnim = listOfAnims[i];
            let newReel: any = {}

			for (let d = 0; d < 4; d++) {
				newReel[directions[d]] = [];
				for (let r = lastIndex; r < lastIndex + maxRowSize; r++) {
                    if (r < currAnim.numOfFrames + lastIndex) {
						newReel[directions[d]].push(r);
					}
				}
				lastIndex += maxRowSize;
            }
            lpcReels[currAnim.name] = newReel;
		}

		return lpcReels;
	}

    update(time: number, delta: number) {

        this.player.setVelocity(0, 0);

		// Horizontal Movement
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-80);
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(80);
		}

		// Vertical Movement
		if (this.cursors.up.isDown) {

		}
	}
};

var config = {
	type: Phaser.AUTO,
	parent: 'content',
	width: 640,
	height: 480,
	zoom: 2,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [
		BootScene,
		WorldScene
	]
};

var game = new Phaser.Game(config);