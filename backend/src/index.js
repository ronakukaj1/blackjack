import express from 'express';
import cors from 'cors';
import gamesRouter from './routes/games.js';

const app=express();
const PORT=process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/games', gamesRouter);

app.get ('/health', (req, res)=>{
res.json({status:'ok'});
});

app.listen (PORT, ()=>{
    console.log(`Blackjack API is running on http://localhost:${PORT}`);
});