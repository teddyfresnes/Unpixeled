import{buildAvatar}from'./avatar.js'
import{makeGrass,makeRoadV,makeRoadPlain,makeSidewalkV,makeSidewalkH,makeCrosswalkH,makeCrosswalkV,makeWall}from'./textures.js'
import{limbsAnim,bounce,breath}from'./animations.js'
import{movement}from'./movement.js'

const makeSand=(s,k='sand')=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),z=64
	g.fillStyle(0xd8c99a,1).fillRect(0,0,z,z)
	for(let i=0;i<250;i++){
		const c=0xe2d4a1+Phaser.Math.Between(-4000,4000)
		g.fillStyle(c,1).fillRect(Phaser.Math.Between(0,z),Phaser.Math.Between(0,z),2,2)
	}
	g.generateTexture(k,z,z);g.destroy();return k
}
const makeWater=(s,k='water')=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),z=64
	g.fillStyle(0x0066cc,1).fillRect(0,0,z,z)
	g.generateTexture(k,z,z);g.destroy();return k
}
const makeWave=(s,k='wave')=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),z=64
	g.fillStyle(0xffffff,.5)
	for(let y=0;y<z;y+=16)g.fillRect(0,y,z,4)
	g.generateTexture(k,z,z);g.destroy();return k
}

export function startGame(token){
	;(()=>{
		const cfg={type:Phaser.AUTO,parent:'game-container',backgroundColor:'#000',physics:{default:'arcade'},scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},scene:{preload,create,update}}
		new Phaser.Game(cfg)

		let socket,player,pointerMoved=false
		const others={}
		const baseZoom=3,dezoom=.7
		let worldW=12000,worldH=6000,margin=320,waterTile,waveTile

		function preload(){}

		function create(){
			this.otherPlayers=this.physics.add.group()
			this.lastClick=0
			this.mouseSprint=false
			this.sprint=1

			socket=io({auth:{token}})

			this.cursors=this.input.keyboard.createCursorKeys()
			this.keys=this.input.keyboard.addKeys({W:Phaser.Input.Keyboard.KeyCodes.W,A:Phaser.Input.Keyboard.KeyCodes.A,S:Phaser.Input.Keyboard.KeyCodes.S,D:Phaser.Input.Keyboard.KeyCodes.D,SHIFT:Phaser.Input.Keyboard.KeyCodes.SHIFT})

			this.input.on('pointerdown',p=>{const n=this.time.now;if(p.button===0&&n-this.lastClick<400){this.mouseSprint=true;this.sprint=2}this.lastClick=n;pointerMoved=true})
			this.input.on('pointermove',()=>pointerMoved=true)
			this.input.on('pointerup',p=>{if(p.button===0)this.mouseSprint=false})

			socket.on('worldSettings',d=>{
				worldW=d.width;worldH=d.height;margin=d.margin
				const beachW=320
				const waterStart=worldW-margin
				this.physics.world.setBounds(margin,margin,waterStart-margin,worldH-2*margin)
				this.physics.world.setBoundsCollision(true,true,true,true)

				const cam=this.cameras.main
				cam.setBounds(0,0,worldW,worldH).setZoom(baseZoom)
				cam.roundPixels=true
				this.add.tileSprite(0,0,worldW,worldH,makeGrass(this)).setOrigin(0)

				const sandX=waterStart-beachW
				const sandShape=this.add.graphics()
				sandShape.fillStyle(0xd8c99a,1)
				sandShape.beginPath()
				sandShape.moveTo(sandX,0)
				for(let y=0;y<=worldH;y+=20){
					const amp=50
					const x=sandX+amp*Math.sin(y/60)+Phaser.Math.Between(-15,15)
					sandShape.lineTo(x,y)
				}
				sandShape.lineTo(waterStart,worldH)
				sandShape.lineTo(waterStart,0)
				sandShape.closePath()
				sandShape.fillPath()

				this.add.tileSprite(sandX,0,beachW,worldH,makeSand(this)).setOrigin(0)

				waterTile=this.add.tileSprite(waterStart,0,margin*3,worldH,makeWater(this)).setOrigin(0)
				waveTile=this.add.tileSprite(waterStart,0,margin*3,worldH,makeWave(this)).setOrigin(0).setAlpha(.4)

				const roadW=200,sideW=40,crossW=40
				const v1=worldW/3-roadW/2
				const v2=2*worldW/3-roadW/2
				const hY=worldH/2-roadW/2
				const off=sideW+crossW

				this.add.tileSprite(v1,0,roadW,worldH,makeRoadV(this)).setOrigin(0)
				this.add.tileSprite(v1-sideW,0,sideW,worldH,makeSidewalkV(this)).setOrigin(0)
				this.add.tileSprite(v1+roadW,0,sideW,worldH,makeSidewalkV(this)).setOrigin(0)

				this.add.tileSprite(v2,0,roadW,worldH,makeRoadV(this)).setOrigin(0)
				this.add.tileSprite(v2-sideW,0,sideW,worldH,makeSidewalkV(this)).setOrigin(0)
				this.add.tileSprite(v2+roadW,0,sideW,worldH,makeSidewalkV(this)).setOrigin(0)

				this.add.tileSprite(0,hY,worldW,roadW,makeRoadPlain(this)).setOrigin(0)

				const seg1=v1-sideW
				const seg2=v2-(v1+roadW+sideW)
				const seg3=waterStart-(v2+roadW+sideW)

				this.add.tileSprite(0,hY-sideW,seg1,sideW,makeSidewalkH(this)).setOrigin(0)
				this.add.tileSprite(v1+roadW+sideW,hY-sideW,seg2,sideW,makeSidewalkH(this)).setOrigin(0)
				this.add.tileSprite(v2+roadW+sideW,hY-sideW,seg3,sideW,makeSidewalkH(this)).setOrigin(0)

				this.add.tileSprite(0,hY+roadW,seg1,sideW,makeSidewalkH(this)).setOrigin(0)
				this.add.tileSprite(v1+roadW+sideW,hY+roadW,seg2,sideW,makeSidewalkH(this)).setOrigin(0)
				this.add.tileSprite(v2+roadW+sideW,hY+roadW,seg3,sideW,makeSidewalkH(this)).setOrigin(0)

				this.add.tileSprite(v1,hY,roadW,roadW,makeRoadPlain(this)).setOrigin(0)
				this.add.tileSprite(v2,hY,roadW,roadW,makeRoadPlain(this)).setOrigin(0)

				this.add.tileSprite(v1,hY-off,roadW,crossW,makeCrosswalkH(this)).setOrigin(0)
				this.add.tileSprite(v1,hY+roadW+sideW,roadW,crossW,makeCrosswalkH(this)).setOrigin(0)
				this.add.tileSprite(v1-off,hY,crossW,roadW,makeCrosswalkV(this)).setOrigin(0)
				this.add.tileSprite(v1+roadW+sideW,hY,crossW,roadW,makeCrosswalkV(this)).setOrigin(0)

				this.add.tileSprite(v2,hY-off,roadW,crossW,makeCrosswalkH(this)).setOrigin(0)
				this.add.tileSprite(v2,hY+roadW+sideW,roadW,crossW,makeCrosswalkH(this)).setOrigin(0)
				this.add.tileSprite(v2-off,hY,crossW,roadW,makeCrosswalkV(this)).setOrigin(0)
				this.add.tileSprite(v2+roadW+sideW,hY,crossW,roadW,makeCrosswalkV(this)).setOrigin(0)

				const g=this.add.graphics()
				g.lineStyle(2,0xffffff,.6)
				g.lineBetween(0,hY+8,v1-off,hY+8)
				g.lineBetween(v1+roadW+sideW+off,hY+8,v2-off,hY+8)
				g.lineBetween(v2+roadW+sideW+off,hY+8,waterStart,hY+8)
				g.lineBetween(0,hY+roadW-8,v1-off,hY+roadW-8)
				g.lineBetween(v1+roadW+sideW+off,hY+roadW-8,v2-off,hY+roadW-8)
				g.lineBetween(v2+roadW+sideW+off,hY+roadW-8,waterStart,hY+roadW-8)
				const dashLen=48,dashGap=16
				for(let x=0;x<waterStart;x+=dashLen+dashGap){g.lineBetween(x,hY+roadW/2,Math.min(x+dashLen,waterStart),hY+roadW/2)}

				const wallT=makeWall(this),bw=16
				this.add.tileSprite(margin-bw,margin,bw,worldH-2*margin,wallT).setOrigin(0)
				this.add.tileSprite(margin-bw,margin-bw,worldW-2*margin+2*bw,bw,wallT).setOrigin(0)
				this.add.tileSprite(margin-bw,worldH-margin,worldW-2*margin+2*bw,bw,wallT).setOrigin(0)
			})

			socket.on('currentPlayers',ps=>Object.entries(ps).forEach(([id,i])=>id===socket.id?addMe.call(this,i):addOther.call(this,id,i)))
			socket.on('newPlayer',d=>addOther.call(this,d.id,d))
			socket.on('playerMoved',d=>{if(!others[d.id])return;others[d.id].setPosition(d.x,d.y);if(d.r!==undefined)others[d.id].rotation=d.r})
			socket.on('playerDisconnected',id=>{others[id]?.destroy();this.otherPlayers.remove(others[id]);delete others[id]})
		}

		function update(){
			if(!player)return
			const cam=this.cameras.main,ptr=this.input.activePointer,cw=cam.getWorldPoint(ptr.x,ptr.y)
			const key=this.cursors.left.isDown||this.cursors.right.isDown||this.cursors.up.isDown||this.cursors.down.isDown||this.keys.W.isDown||this.keys.A.isDown||this.keys.S.isDown||this.keys.D.isDown
			const mv=movement.call(this,player,cw,pointerMoved);pointerMoved=false
			if(!key&&!ptr.isDown)player.rotation=Phaser.Math.Angle.Between(player.x,player.y,cw.x,cw.y)-Math.PI/2
			else if(mv.lengthSq()&&!ptr.isDown)player.rotation=Phaser.Math.Angle.Between(0,0,mv.x,mv.y)-Math.PI/2
			else if(ptr.isDown)player.rotation=Phaser.Math.Angle.Between(player.x,player.y,cw.x,cw.y)-Math.PI/2
			const spd=player.body.velocity.length();limbsAnim(this,player.limbs,spd);bounce(this,player,spd);breath(this,player,spd)
			cam.setZoom(Phaser.Math.Linear(cam.zoom,baseZoom-(this.sprint-1)*dezoom,.05))
			if(waterTile){waterTile.tilePositionY+=0.3;waveTile.tilePositionY+=0.5}
			Object.values(others).forEach(o=>{const dx=o.x-o.prevX,dy=o.y-o.prevY,s=Math.hypot(dx,dy)*60;if(s>.1)o.rotation=Phaser.Math.Angle.Between(0,0,dx,dy)-Math.PI/2;limbsAnim(this,o.limbs,s);o.prevX=o.x;o.prevY=o.y})
			if(!player.oldPos||player.x!==player.oldPos.x||player.y!==player.oldPos.y||player.rotation!==player.oldRot){socket.emit('playerMovement',{x:player.x,y:player.y,r:player.rotation});player.oldPos={x:player.x,y:player.y};player.oldRot=player.rotation}
		}

		function addMe(i){player=buildAvatar(this,i.color).setPosition(i.x,i.y);this.physics.add.existing(player);player.body.setCircle(15).setOffset(-15,-15).setDrag(900).setMaxVelocity(150).setCollideWorldBounds(true);player.rotation=i.r||0;this.physics.add.collider(player,this.otherPlayers);this.cameras.main.startFollow(player)}
		function addOther(id,i){const a=buildAvatar(this,i.color).setPosition(i.x,i.y);this.physics.add.existing(a);a.body.setCircle(15).setOffset(-15,-15).setImmovable(true).setCollideWorldBounds(true);a.rotation=i.r||0;this.otherPlayers.add(a);a.prevX=i.x;a.prevY=i.y;others[id]=a}
	})()
}
