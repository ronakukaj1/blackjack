const games = new Map();

export function saveGame(game) {
  games.set(game.id, game);
}

export function getGame(id) {
  return games.get(id);
}
