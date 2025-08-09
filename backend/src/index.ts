import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initDatabase, getUserByTelegramId, createUser, updateUserBalance, addGameHistory, getGameHistory } from './database';
import { generateTONWallet, verifyTelegramInitData, rollDice, calculateGameResult } from './utils';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
initDatabase();

// Middleware
// When running behind a reverse proxy (e.g., Render, Vercel, Nginx),
// trust the proxy so express-rate-limit can correctly read client IPs
// from X-Forwarded-For without throwing validation errors.
app.set('trust proxy', 1);
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Register user
app.post('/register', async (req, res) => {
    try {
        const { telegram_id, init_data } = req.body;

        if (!telegram_id) {
            return res.status(400).json({ error: 'telegram_id is required' });
        }

        // Verify Telegram initData (optional for MVP)
        if (init_data && !verifyTelegramInitData(init_data)) {
            return res.status(401).json({ error: 'Invalid Telegram initData' });
        }

        // Check if user already exists
        let user = getUserByTelegramId(telegram_id);

        if (!user) {
            // Create new user with TON wallet
            const walletAddress = generateTONWallet();
            const userId = createUser(telegram_id, walletAddress);
            user = getUserByTelegramId(telegram_id);
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                telegram_id: user.telegram_id,
                wallet_address: user.wallet_address,
                balance: user.balance
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user balance
app.get('/balance', async (req, res) => {
    try {
        const { telegram_id } = req.query;

        if (!telegram_id) {
            return res.status(400).json({ error: 'telegram_id is required' });
        }

        const user = getUserByTelegramId(Number(telegram_id));

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            balance: user.balance,
            wallet_address: user.wallet_address
        });
    } catch (error) {
        console.error('Balance error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Play dice game
app.post('/play', async (req, res) => {
    try {
        const { telegram_id } = req.body;

        if (!telegram_id) {
            return res.status(400).json({ error: 'telegram_id is required' });
        }

        const user = getUserByTelegramId(Number(telegram_id));

        if (!user) {
            return res.status(404).json({ error: 'User not found. Please register first.' });
        }

        // Check if user has enough balance
        const betAmount = 1.0;
        if (user.balance < betAmount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Roll dice and calculate result
        const roll = rollDice();
        const { isWin, winAmount, message } = calculateGameResult(roll);

        // Update user balance
        const newBalance = user.balance + winAmount;
        try {
            updateUserBalance(user.id, newBalance);
        } catch (e) {
            console.error('Play error: failed to update balance', { userId: user.id, newBalance, error: e });
            throw e;
        }

        // Add to game history
        try {
            addGameHistory(user.id, roll, betAmount, winAmount, isWin);
        } catch (e) {
            console.error('Play error: failed to insert game history', { userId: user.id, roll, betAmount, winAmount, isWin, error: e });
            throw e;
        }

        res.json({
            success: true,
            roll,
            isWin,
            winAmount,
            newBalance,
            message
        });
    } catch (error: any) {
        console.error('Play error:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
});

// Get game history
app.get('/history', async (req, res) => {
    try {
        const { telegram_id } = req.query;

        if (!telegram_id) {
            return res.status(400).json({ error: 'telegram_id is required' });
        }

        const user = getUserByTelegramId(Number(telegram_id));

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const history = getGameHistory(user.id, 10);

        res.json({
            success: true,
            history: history.map(game => ({
                id: game.id,
                roll_result: game.roll_result,
                bet_amount: game.bet_amount,
                win_amount: game.win_amount,
                is_win: game.is_win,
                created_at: game.created_at
            }))
        });
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
