import { circleTex, limbTex } from './textures.js';
export function buildAvatar(scene,color){
	const bodyT=circleTex(scene,'body_'+color,color);
	const limbT=limbTex(scene,'limb',0xffffff);
	const body	= scene.add.image(0,0,bodyT);
	const LA	= scene.add.image(-12,-2,limbT).setOrigin(.5,0);
	const RA	= scene.add.image( 12,-2,limbT).setOrigin(.5,0);
	const LL	= scene.add.image( -3, 6,limbT).setOrigin(.5,0);
	const RL	= scene.add.image(  3, 6,limbT).setOrigin(.5,0);
	const c		= scene.add.container(0,0,[LA,RA,LL,RL,body]);
	c.limbs		= { leftArm:LA,rightArm:RA,leftLeg:LL,rightLeg:RL };
	c.bodySprite= body;
	return c;
}
