const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export interface User {
    id: number;
    telegram_id: number;
    wallet_address: string;
    balance: number;
}

export interface GameResult {
    success: boolean;
    roll: number;
    isWin: boolean;
    winAmount: number;
    newBalance: number;
    message: string;
}

export interface GameHistory {
    id: number;
    roll_result: number;
    bet_amount: number;
    win_amount: number;
    is_win: boolean;
    created_at: string;
}

export interface BalanceResponse {
    success: boolean;
    balance: number;
    wallet_address: string;
}

export interface HistoryResponse {
    success: boolean;
    history: GameHistory[];
}

// Register user
export async function registerUser(telegramId: number, initData?: string): Promise<User> {
    const response = await fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            telegram_id: telegramId,
            init_data: initData,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to register user');
    }

    const data = await response.json();
    return data.user;
}

// Get user balance
export async function getUserBalance(telegramId: number): Promise<BalanceResponse> {
    const response = await fetch(`${BACKEND_URL}/balance?telegram_id=${telegramId}`);

    if (!response.ok) {
        throw new Error('Failed to get user balance');
    }

    return response.json();
}

// Play dice game
export async function playDice(telegramId: number): Promise<GameResult> {
    const response = await fetch(`${BACKEND_URL}/play`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            telegram_id: telegramId,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to play dice');
    }

    return response.json();
}

// Get game history
export async function getGameHistory(telegramId: number): Promise<HistoryResponse> {
    const response = await fetch(`${BACKEND_URL}/history?telegram_id=${telegramId}`);

    if (!response.ok) {
        throw new Error('Failed to get game history');
    }

    return response.json();
}
