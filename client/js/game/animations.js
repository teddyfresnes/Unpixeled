export const limbsAnim = (scene,l,speed)=>{
	const t=scene.time.now/1000,ph=Math.sin((speed>200?9:6)*t);
	const r=Phaser.Math.Clamp(speed/160,0,1);
	const leg=r*(speed>200?3:2.2),arm=leg*1.4+1,base=6*r;
	l.leftLeg .y=base+ph*leg;
	l.rightLeg.y=base-ph*leg;
	l.leftArm .y=-2-ph*arm;
	l.rightArm.y=-2+ph*arm;
};
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
