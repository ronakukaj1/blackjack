const API_BASE = 'http://localhost:3001';

async function request(path, options={}){
    let res;
    try{
        res = await fetch(`${API_BASE}${path}`, options);
    }catch {
        throw new Error(
            'Cannot reach backend - is it running on port 3001?'
        )
    }
    if(!res.ok){
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Request failed');
    }
    return res.json();
    }


window.api = {
    createGame: () => request(`/api/games`, {method: 'POST'}),
    hit: (gameId) => request (`/api/games/${gameId}/hit`, {method: 'POST'}),
    stand: (gameId) => request (`/api/games/${gameId}/stand`, {method: 'POST'}),
};
