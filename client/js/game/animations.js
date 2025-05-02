export const limbsAnim = (scene, l, speed) => {
	const t = scene.time.now / 1000
	const ph = Math.sin((speed > 200 ? 9 : 6) * t)
	const r = Phaser.Math.Clamp(speed / 160, 0, 1)
	const leg = r * (speed > 200 ? 3 : 2.2)
	const arm = leg * 1.4 + 1
	const base = 6 * r

	const tgtLL = base + ph * leg
	const tgtRL = base - ph * leg
	const tgtLA = -2 - ph * arm
	const tgtRA = -2 + ph * arm

	const s = .15

	l.leftLeg.y = Phaser.Math.Linear(l.leftLeg.y, tgtLL, s)
	l.rightLeg.y = Phaser.Math.Linear(l.rightLeg.y, tgtRL, s)
	l.leftArm.y = Phaser.Math.Linear(l.leftArm.y, tgtLA, s)
	l.rightArm.y = Phaser.Math.Linear(l.rightArm.y, tgtRA, s)
}

export const bounce = (scene,p,speed)=>{
	const walk=speed>10;
	if(walk&&!p.bounceT){
		const a=speed>200?.1:.07,d=speed>200?90:160;
		p.bounceT=scene.tweens.add({targets:p,scale:1-a,yoyo:true,repeat:-1,duration:d,ease:'Sine.easeInOut'});
	}else if(!walk&&p.bounceT){
		p.bounceT.stop();p.bounceT.remove();p.bounceT=null;p.setScale(1);
	}
};
export const breath = (scene,p,speed)=>{
	const idle=speed<5;
	if(idle&&!p.breath){
		p.breath=scene.tweens.add({targets:p.bodySprite,scale:1.04,yoyo:true,repeat:-1,duration:2000,ease:'Sine.easeInOut'});
	}else if(!idle&&p.breath){
		p.breath.stop();p.breath.remove();p.breath=null;p.bodySprite.setScale(1);
	}
};
