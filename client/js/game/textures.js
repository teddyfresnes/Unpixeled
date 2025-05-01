export const circleTex = (scene,key,col)=>{
	if(scene.textures.exists(key)) return key;
	const g=scene.make.graphics({add:false});
	g.fillStyle(Phaser.Display.Color.HexStringToColor(col).color,1);
	g.fillCircle(15,15,15);
	g.generateTexture(key,30,30,4); g.destroy(); return key;
};
export const limbTex = (scene,key,col)=>{
	if(scene.textures.exists(key)) return key;
	const g=scene.make.graphics({add:false});
	g.fillStyle(col,1).fillRect(0,0,4,12);
	g.generateTexture(key,4,12); g.destroy(); return key;
};
export const makeGrass = (scene,key='grass')=>{
	if(scene.textures.exists(key)) return key;
	const s=64,g=scene.make.graphics({add:false});
	g.fillStyle(0x3a9d23,1).fillRect(0,0,s,s);
	for(let i=0;i<250;i++){
		const sh=Phaser.Math.Between(-20,20);
		const c=Phaser.Display.Color.GetColor(58+sh,157+sh,35+sh);
		g.fillStyle(c,1).fillRect(Phaser.Math.Between(0,s),Phaser.Math.Between(0,s),2,2);
	}
	g.generateTexture(key,s,s); g.destroy(); return key;
};
