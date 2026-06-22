import { Router } from 'express';
import { shuffleDeck, drawCards } from '../services/deckApi.js';
import { handTotal, isBlackjack, determineResult } from '../services/gameLogic.js';
import { saveGame, getGame} from '../store/games.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

function toClientGame(game) {
  const finished = game.status === 'finished';

  return {
    id: game.id,
    status: game.status,
    result: game.result,
    playerHand: game.playerHand,
    playerTotal: handTotal(game.playerHand),

    dealerHand: finished
      ? game.dealerHand
      : [game.dealerHand[0], { hidden: true }],
    dealerTotal: finished ? handTotal(game.dealerHand) : null,
    visibleDealerTotal: finished ? null : handTotal([game.dealerHand[0]]),
  };
}

router.post('/', async (req, res) => {
   try {
    const deckId = await shuffleDeck();
    const cards = await drawCards(deckId, 4);
    const [p1, d1, p2, d2] = cards;
    const playerHand = [p1, p2];
    const dealerHand = [d1, d2];

    let status = 'player_turn';
    let result = null;

    if (isBlackjack(playerHand) || isBlackjack(dealerHand)) {
      status = 'finished';
      result = determineResult(playerHand, dealerHand);
    }

    const game = {
      id: uuidv4(),
      deckId,
      playerHand,
      dealerHand,
      status,
      result,
    };

    saveGame(game);
    res.status(201).json(toClientGame(game));
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

router.post('/:id/hit', async (req, res)=>{
    const game = getGame(req.params.id);

    if(!game){
        return res.status(404).json({error: 'Game not found'})
    }
     if(game.status !== 'player_turn'){
        return res.status(400).json({error: 'Game is not in player turn'})
     }

     try{
        const [card]= await drawCards(game.deckId, 1);
        game.playerHand.push(card);

        if(handTotal(game.playerHand)>21){
            game.status = 'finished';
            game.result = 'YOU BUST. You Lose!';
        }

        saveGame(game);
        res.json(toClientGame(game));
    }catch(error){
        res.status(502).json({error: error.message});
    }
     });


     router.post('/:id/stand', async (req, res)=>{
        const game=getGame(req.params.id);

        if(!game){
            return res.status(404).json({error: 'Game not found'});
        }
        if(game.status !=='player_turn'){
            return res.status(400).json({error: 'Game is not in player turn'});
        }
        try{
            while(handTotal(game.dealerHand)<17){
                const [card] = await drawCards(game.deckId, 1);
                game.dealerHand.push(card);
            }
            game.status='finished';
            game.result=determineResult(game.playerHand, game.dealerHand);
            saveGame(game);
            res.json(toClientGame(game));
        }catch(error){
            res.status(502).json({error: error.message});
        }
     });

export default router;