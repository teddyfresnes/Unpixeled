// client/js/game/textures.js
export const circleTex=(s,k,c)=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false})
	g.fillStyle(Phaser.Display.Color.HexStringToColor(c).color,1)
	g.fillCircle(15,15,15)
	g.generateTexture(k,30,30,4)
	g.destroy()
	return k
}
export const limbTex=(s,k,c)=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false})
	g.fillStyle(c,1).fillRect(0,0,4,12)
	g.generateTexture(k,4,12)
	g.destroy()
	return k
}
export const makeGrass=(s,k='grass')=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),z=64
	g.fillStyle(0x3a9d23,1).fillRect(0,0,z,z)
	for(let i=0;i<250;i++){
		const sh=Phaser.Math.Between(-20,20)
		const c=Phaser.Display.Color.GetColor(58+sh,157+sh,35+sh)
		g.fillStyle(c,1).fillRect(Phaser.Math.Between(0,z),Phaser.Math.Between(0,z),2,2)
	}
	g.generateTexture(k,z,z)
	g.destroy()
	return k
}
export const makeRoadV=(s,w=200)=>{
	const k='roadV_'+w
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),h=64,cx=w/2
	g.fillStyle(0x404040,1).fillRect(0,0,w,h)
	g.lineStyle(2,0xffffff,.6)
	for(let y=0;y<h;y+=64)g.lineBetween(cx,y,cx,y+48)
	g.generateTexture(k,w,h)
	g.destroy()
	return k
}
export const makeRoadH=(s,h=200)=>{
	const k='roadH_'+h
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),w=64,cy=h/2
	g.fillStyle(0x404040,1).fillRect(0,0,w,h)
	g.lineStyle(2,0xffffff,.6)
	g.lineBetween(0,8,w,8)
	g.lineBetween(0,h-8,w,h-8)
	for(let x=0;x<w;x+=64)g.lineBetween(x,cy,x+48,cy)
	g.generateTexture(k,w,h)
	g.destroy()
	return k
}
export const makeRoadPlain=(s,k='roadPlain')=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),z=64
	g.fillStyle(0x404040,1).fillRect(0,0,z,z)
	g.generateTexture(k,z,z)
	g.destroy()
	return k
}
export const makeSidewalkV=(s,k='sidewalkV')=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),z=64
	g.fillStyle(0x777777,1).fillRect(0,0,z,z)
	g.lineStyle(1,0x999999,1)
	for(let y=0;y<z;y+=16)g.lineBetween(0,y,z,y)
	g.generateTexture(k,z,z)
	g.destroy()
	return k
}
export const makeSidewalkH=(s,k='sidewalkH')=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),z=64
	g.fillStyle(0x777777,1).fillRect(0,0,z,z)
	g.lineStyle(1,0x999999,1)
	for(let x=0;x<z;x+=16)g.lineBetween(x,0,x,z)
	g.generateTexture(k,z,z)
	g.destroy()
	return k
}
export const makeCrosswalkH=(s,k='crossH')=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),z=64
	g.fillStyle(0x404040,1).fillRect(0,0,z,z)
	g.fillStyle(0xffffff,1)
	for(let x=0;x<z;x+=16)g.fillRect(x,0,8,z)
	g.generateTexture(k,z,z)
	g.destroy()
	return k
}
export const makeCrosswalkV=(s,k='crossV')=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),z=64
	g.fillStyle(0x404040,1).fillRect(0,0,z,z)
	g.fillStyle(0xffffff,1)
	for(let y=0;y<z;y+=16)g.fillRect(0,y,z,8)
	g.generateTexture(k,z,z)
	g.destroy()
	return k
}
export const makeWall=(s,k='wall')=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),z=64
	g.fillStyle(0x666666,1).fillRect(0,0,z,z)
	g.generateTexture(k,z,z)
	g.destroy()
	return k
}
// client/js/game/textures.js
export const makeSand=(s,k='sand')=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),z=64
	g.fillStyle(0xdcc183,1).fillRect(0,0,z,z)
	for(let i=0;i<120;i++){
		const c=Phaser.Display.Color.GetColor(220+Phaser.Math.Between(-10,10),190+Phaser.Math.Between(-10,10),140)
		g.fillStyle(c,.4).fillCircle(Phaser.Math.Between(0,z),Phaser.Math.Between(0,z),Phaser.Math.Between(1,3))
	}
	g.generateTexture(k,z,z);g.destroy();return k
}
export const makeWater=(s,k='water')=>{
	if(s.textures.exists(k))return k
	const g=s.make.graphics({add:false}),z=64
	g.fillStyle(0x1976d2,1).fillRect(0,0,z,z)
	g.lineStyle(3,0x5dade2,.6)
	for(let y=0;y<z;y+=16)g.lineBetween(0,y,z,y)
	g.generateTexture(k,z,z);g.destroy();return k
}
