export const request = (url,data)=>fetch(url,{
	method:'POST',
	headers:{'Content-Type':'application/json'},
	body:JSON.stringify(data)
}).then(r=>r.ok?r.json():r.json().then(e=>Promise.reject(e)));

export const register = (user,pass)=>request('/api/register',{user,pass});
export const login    = (user,pass)=>request('/api/login'   ,{user,pass});
