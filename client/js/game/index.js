import { buildAvatar } from './avatar.js'
import { makeGrass } from './textures.js'
import { limbsAnim, bounce, breath } from './animations.js'
import { movement } from './movement.js'

export function startGame(token) {
	;(() => {
		const cfg = {
			type: Phaser.AUTO,
			parent: 'game-container',
			backgroundColor: '#000',
			physics: { default: 'arcade' },
			scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
			scene: { preload, create, update }
		}
		new Phaser.Game(cfg)

		let socket, player, pointerMoved = false
		const others = {}
		const baseZoom = 3, dezoom = .7
		let worldW = 5000, worldH = 5000

		function preload() {}

		function create() {
			this.otherPlayers = this.physics.add.group()
			this.lastClick = 0
			this.mouseSprint = false
			this.sprint = 1

			socket = io({ auth: { token } })

			this.cursors = this.input.keyboard.createCursorKeys()
			this.keys = this.input.keyboard.addKeys({
				W: Phaser.Input.Keyboard.KeyCodes.W,
				A: Phaser.Input.Keyboard.KeyCodes.A,
				S: Phaser.Input.Keyboard.KeyCodes.S,
				D: Phaser.Input.Keyboard.KeyCodes.D,
				SHIFT: Phaser.Input.Keyboard.KeyCodes.SHIFT
			})

			this.input.on('pointerdown', p => {
				const now = this.time.now
				if (p.button === 0 && now - this.lastClick < 400) {
					this.mouseSprint = true
					this.sprint = 2
				}
				this.lastClick = now
				pointerMoved = true
			})
			this.input.on('pointermove', () => pointerMoved = true)
			this.input.on('pointerup', p => {
				if (p.button === 0) this.mouseSprint = false
			})

			socket.on('worldSettings', d => {
				worldW = d.width
				worldH = d.height
				this.physics.world.setBounds(0, 0, worldW, worldH)
				this.physics.world.setBoundsCollision(true, true, true, true)
				const cam = this.cameras.main
				cam.setBounds(0, 0, worldW, worldH).setZoom(baseZoom)
				cam.roundPixels = true
				this.add.tileSprite(0, 0, worldW, worldH, makeGrass(this)).setOrigin(0)
			})

			socket.on('currentPlayers', ps => {
				Object.entries(ps).forEach(([id, info]) =>
					id === socket.id
						? addMe.call(this, info)
						: addOther.call(this, id, info)
				)
			})

			socket.on('newPlayer', d => addOther.call(this, d.id, d))
			socket.on('playerMoved', d => {
				if (!others[d.id]) return
				others[d.id].setPosition(d.x, d.y)
				if (d.r !== undefined) others[d.id].rotation = d.r
			})
			socket.on('playerDisconnected', id => {
				others[id]?.destroy()
				this.otherPlayers.remove(others[id])
				delete others[id]
			})
		}

		function update() {
			if (!player) return

			const cam = this.cameras.main
			const ptr = this.input.activePointer
			const cw = cam.getWorldPoint(ptr.x, ptr.y)
			const key = this.cursors.left.isDown || this.cursors.right.isDown ||
				this.cursors.up.isDown || this.cursors.down.isDown ||
				this.keys.W.isDown || this.keys.A.isDown ||
				this.keys.S.isDown || this.keys.D.isDown

			const mv = movement.call(this, player, cw, pointerMoved)
			const pm = pointerMoved
			pointerMoved = false

			if (pm && !key && !ptr.isDown) player.rotation = Phaser.Math.Angle.Between(player.x, player.y, cw.x, cw.y) - Math.PI / 2
			else if (mv.lengthSq() && !ptr.isDown) player.rotation = Phaser.Math.Angle.Between(0, 0, mv.x, mv.y) - Math.PI / 2
			else if (ptr.isDown) player.rotation = Phaser.Math.Angle.Between(player.x, player.y, cw.x, cw.y) - Math.PI / 2

			const spd = player.body.velocity.length()
			limbsAnim(this, player.limbs, spd)
			bounce(this, player, spd)
			breath(this, player, spd)

			cam.setZoom(Phaser.Math.Linear(cam.zoom, baseZoom - (this.sprint - 1) * dezoom, .05))

			Object.values(others).forEach(o => {
				const dx = o.x - o.prevX
				const dy = o.y - o.prevY
				const s = Math.hypot(dx, dy) * 60
				if (s > .1) o.rotation = Phaser.Math.Angle.Between(0, 0, dx, dy) - Math.PI / 2
				limbsAnim(this, o.limbs, s)
				o.prevX = o.x
				o.prevY = o.y
			})

			if (!player.oldPos || player.x !== player.oldPos.x || player.y !== player.oldPos.y || player.rotation !== player.oldRot) {
				socket.emit('playerMovement', { x: player.x, y: player.y, r: player.rotation })
				player.oldPos = { x: player.x, y: player.y }
				player.oldRot = player.rotation
			}
		}

		function addMe(info) {
			player = buildAvatar(this, info.color).setPosition(info.x, info.y)
			this.physics.add.existing(player)
			player.body.setCircle(15).setOffset(-15, -15).setDrag(900).setMaxVelocity(150).setCollideWorldBounds(true)
			player.rotation = info.r || 0
			this.physics.add.collider(player, this.otherPlayers)
			this.cameras.main.startFollow(player)
		}

		function addOther(id, info) {
			const a = buildAvatar(this, info.color).setPosition(info.x, info.y)
			this.physics.add.existing(a)
			a.body.setCircle(15).setOffset(-15, -15).setImmovable(true).setCollideWorldBounds(true)
			a.rotation = info.r || 0
			this.otherPlayers.add(a)
			a.prevX = info.x
			a.prevY = info.y
			others[id] = a
		}
	})()
}
