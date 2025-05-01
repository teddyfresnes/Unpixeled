const $ = id=>document.getElementById(id);
const key='world2d_token';
export const token		= ()=>localStorage.getItem(key);
export const saveToken	= t=>localStorage.setItem(key,t);
export const clearToken	= ()=>localStorage.removeItem(key);
export const message	= txt=>$('msg').textContent=txt;

export function logged(state){
	$('forms').style.display = state?'none':'block';
	$('join-section').style.display = state?'block':'none';
}
