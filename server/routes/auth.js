const fs		= require('fs');
const crypto	= require('crypto');
const express = require('express')
const sha		= v=>crypto.createHash('sha256').update(v).digest('hex');
const token		= ()=>crypto.randomBytes(24).toString('hex');

let DB_FILE;

module.exports = (app, file)=>{
	DB_FILE	= file;
	if(!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE,'[]');
	app.use(express.json());

	app.post('/api/register', (req,res)=>{
		const {user,pass}=req.body;
		if(!user||!pass||pass.length<8) return res.status(400).json({error:'invalid'});
		const db = loadDB();
		if(db.find(u=>u.user===user))   return res.status(409).json({error:'exists'});
		const t	= token();
		db.push({ user, hash:sha(pass), token:t }); saveDB(db);
		res.json({ token:t });
	});
	app.post('/api/login', (req,res)=>{
		const {user,pass}=req.body;
		const db	= loadDB();
		const u		= db.find(x=>x.user===user && x.hash===sha(pass));
		if(!u) return res.status(401).json({error:'bad'});
		res.json({ token:u.token });
	});
};

module.exports.loadDB = loadDB = ()=>JSON.parse(fs.readFileSync(DB_FILE));
const saveDB = d=>fs.writeFileSync(DB_FILE, JSON.stringify(d,null,2));
