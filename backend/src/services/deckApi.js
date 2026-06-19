const BASE='https://deckofcardsapi.com/api';

export async function shuffleDeck(){
    const res=await fetch(`${BASE}/deck/new/shuffle`);
    const data=await res.json();
    if(!data.success) throw new Error(data.error || 'Failed to shuffle deck');
    return data.deck_id;
}

export async function drawCards(deckId, count){
    const res=await fetch (`${BASE}/deck/${deckId}/draw/?count=${count}`);
    const data= await res.json();
    if(!data.success) throw new Error (data.error || 'Failed to draw cards');
    return data.cards;
}