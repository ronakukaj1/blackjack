const {useState} = React;
function Card({card}){
    if(card.hidden){
        return (
            <div className = "card card-back" aria-label = "Hidden card">
                <div className="card-back-inner">
                    <span className ="card-back-icon">♠</span>
                </div>
                </div>
        );
    }
    return (
        <img
        className = "card card-face"
        src={card.image}
        alt={card.code}
        draggable={false}

        />
    );
}


function Hand({ label, cards, total, visibleTotal}){
    const displayTotal = total !== null && total!== undefined ? total : visibleTotal;

    return(
        <section className = "hand-panel">
            <div className="hand-header">
                <span className = "hand-label">{label}</span>
                {displayTotal !== null && displayTotal !== undefined && (
                    <span className="total-badge">{displayTotal}</span>
                )}
            </div>
            <div className="cards-row">
                {cards.map((card, index) => (
                    <Card key={index} card={card} />
                ))}
            </div>
        </section>
    )

}
function getResultClass(result){
    if(!result) return '';
    const r = result.toLowerCase();
    if (r.includes('you win') || r.includes('blackjack!')) return 'win';
    if (r.includes('you lose') || r.includes('you bust')) return 'lose';
    return 'push';
}

function App(){
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleNewGame(){
        setLoading (true);
        setError(null);
        try{
            const newGame = await window.api.createGame();
            setGame(newGame);
        } catch (err){
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    async function runAction(action){
        setLoading(true);
        setError(null);
        try{
            const nextGame = await action();
            setGame(nextGame);
        }catch (err){
            setError(err.message);
        } finally{ 
            setLoading(false);
        }
        }
    
        function handleHit(){
            runAction(() => window.api.hit(game.id));
        }
        function handleStand(){
            runAction(() => window.api.stand(game.id));
        }

return (
    <div className = "page">
        <main className = "app">
            <header className = "header">
                <p className = "tagline"> Beat the dealer. Don&apos;t bust.</p>
            </header>
            {error && <div className = "error-banner">{error}</div>}

            <div className = "table">
                {!game ?(
                    <div className="idle-state">
                        <div className = "idle-icon">
                            ♠ ♥ ♦ ♣
                        </div>
                        <p>Ready for a new hand?</p>
                    </div>
                ) : (
                    <>
                      <Hand
                        label="Dealer"
                        cards={game.dealerHand}
                        total={game.dealerTotal}
                        visibleTotal={game.visibleDealerTotal}
                      />
                      <div className="table-divider">
                        <span>{game.status === 'player_turn' ? 'Your move' : 'Final hand'}</span>
                      </div>
                      <Hand
                        label="You"
                        cards={game.playerHand}
                        total={game.playerTotal}
                      />
                    </>
                )}
            </div>
             

            <div className="controls">
  {!game ? (
    <button
      type="button"
      className="btn btn-primary"
      onClick={handleNewGame}
      disabled={loading}
    >
      {loading ? 'Dealing...' : 'New Game'}
    </button>
  ) : game.status === 'player_turn' ? (
    <div className="controls controls-split">
      <button
        type="button"
        className="btn btn-hit"
        onClick={handleHit}
        disabled={loading}
      >
        Hit
      </button>
      <button
        type="button"
        className="btn btn-stand"
        onClick={handleStand}
        disabled={loading}
      >
        Stand
      </button>
    </div>
   ) : (
    <div className="controls controls-finished">
      <div className={`result-banner ${getResultClass(game.result)}`}>
        {game.result}
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleNewGame}
        disabled={loading}
      >
        {loading ? 'Dealing...' : 'Play Again'}
      </button>
    </div>
  )}
  </div>
 </main>
 
 </div>
);


}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);