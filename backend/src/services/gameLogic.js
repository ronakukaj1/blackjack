function cardValue(value) {
    if (['JACK', 'QUEEN', 'KING'].includes(value)) return 10;
    if (value === 'ACE') return 11;
    return Number(value);
  }
  
  export function handTotal(cards) {
    let total = cards.reduce((sum, card) => sum + cardValue(card.value), 0);
    let aces = cards.filter((card) => card.value === 'ACE').length;
  
    while (total > 21 && aces > 0) {
      total -= 10;
      aces -= 1;
    }
  
    return total;
  }
  
  export function isBlackjack(cards) {
    return cards.length === 2 && handTotal(cards) === 21;
  }
  
  export function determineResult(playerHand, dealerHand) {
    const playerTotal = handTotal(playerHand);
    const dealerTotal = handTotal(dealerHand);
  
    if (isBlackjack(playerHand) && isBlackjack(dealerHand)) return 'PUSH';
    if (isBlackjack(playerHand)) return 'BLACKJACK! You Win!';
    if (isBlackjack(dealerHand)) return 'DEALER HAS BLACKJACK. You Lose.';
    if (playerTotal > 21) return 'YOU BUST. You Lose.';
    if (dealerTotal > 21) return 'DEALER BUST. You Win!';
    if (playerTotal > dealerTotal) return 'YOU WIN!';
    if (playerTotal < dealerTotal) return 'YOU LOSE.';
    return 'PUSH. It\'s a tie.';
  }