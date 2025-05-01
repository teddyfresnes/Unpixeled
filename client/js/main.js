import * as api from './api.js';
import * as ui  from './ui.js';
import { startGame } from './game/index.js';

ui.logged(!!ui.token());

document.getElementById('login-btn').onclick = async()=>{
	try{
		const {token}=await api.login(
			document.getElementById('login-user').value,
			document.getElementById('login-pass').value
		);
		ui.saveToken(token); ui.logged(true);
	}catch(e){ui.message(e.error)}
};

document.getElementById('reg-btn').onclick = async()=>{
	const pwd=document.getElementById('login-pass').value;
	if(pwd.length<8) return ui.message('Mot de passe ≥ 8 caractères');
	try{
		const {token}=await api.register(
			document.getElementById('login-user').value,pwd
		);
		ui.saveToken(token); ui.logged(true);
	}catch(e){ui.message(e.error)}
};

document.getElementById('logout-btn').onclick = ()=>{ui.clearToken();ui.logged(false)};
document.getElementById('join-btn').onclick   = ()=>{
	if(!ui.token()) return;
	document.getElementById('menu').classList.add('d-none');
	document.getElementById('game-container').classList.remove('d-none');
	startGame(ui.token());
};
