import crypto from 'crypto';

// Generate a mock TON testnet wallet address
export function generateTONWallet(): string {
    // In a real implementation, you would use tonweb or ton-core
    // For MVP, we'll generate a mock address
    const randomBytes = crypto.randomBytes(32);
    const address = 'EQ' + randomBytes.toString('hex').toUpperCase();
    return address;
}

// Verify Telegram initData (TODO: implement proper verification)
export function verifyTelegramInitData(initData: string): boolean {
    // TODO: Implement proper Telegram initData verification
    // For MVP, we'll accept all requests
    console.log('Telegram initData verification skipped for MVP');
    return true;
}

// Generate random dice roll (1-6)
export function rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
}

// Calculate game result
export function calculateGameResult(roll: number): {
    isWin: boolean;
    winAmount: number;
    message: string;
} {
    const isWin = roll > 3;
    const winAmount = isWin ? 2.0 : -1.0;
    const message = isWin
        ? `🎉 Победа! Выпало ${roll} (больше 3). Выигрыш: +2 TON`
        : `😔 Проигрыш. Выпало ${roll} (меньше или равно 3). Потеря: -1 TON`;

    return { isWin, winAmount, message };
}
