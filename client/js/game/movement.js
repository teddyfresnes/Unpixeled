export function movement(player, cursorWorld, pointerMoved) {
	const scene = this
	const dt = scene.game.loop.delta
	const base = 150
	const accel = 2200
	const k = scene.keys
	const c = scene.cursors
	const key = c.left.isDown || c.right.isDown || c.up.isDown || c.down.isDown ||
		k.W.isDown || k.A.isDown || k.S.isDown || k.D.isDown

	const spr = (k.SHIFT.isDown && key) || scene.mouseSprint
	scene.sprint = Phaser.Math.Clamp((scene.sprint || 1) + dt * (spr ? .002 : -.0025), 1, 2)
	const max = base * scene.sprint

	let mv = new Phaser.Math.Vector2()

	if (cursorWorld && scene.input.activePointer.isDown && !key) {
		const dx = cursorWorld.x - player.x
		const dy = cursorWorld.y - player.y
		const d = Math.hypot(dx, dy)
		if (d < 15) {
			player.body.setAcceleration(0, 0).setVelocity(0, 0)
			return mv
		}
		if (d) mv.set(dx / d, dy / d)
		const velScale = scene.mouseSprint ? 1 : (d < 20 ? .2 + (d / 20) * .8 : 1)
		player.body
			.setMaxVelocity(max, max)
			.setAcceleration(0, 0)
			.setVelocity(mv.x * max * velScale, mv.y * max * velScale)
	} else {
		if (c.left.isDown || k.A.isDown) mv.x = -1
		if (c.right.isDown || k.D.isDown) mv.x = 1
		if (c.up.isDown || k.W.isDown) mv.y = -1
		if (c.down.isDown || k.S.isDown) mv.y = 1
		if (mv.lengthSq()) mv.normalize()
		const diag = mv.x && mv.y
		const axisMax = diag ? max / Math.SQRT2 : max
		player.body
			.setMaxVelocity(axisMax, axisMax)
			.setAcceleration(mv.x * accel, mv.y * accel)
	}

	return mv
}
