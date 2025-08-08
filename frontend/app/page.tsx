'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    registerUser,
    getUserBalance,
    playDice,
    getGameHistory,
    type User,
    type GameResult,
    type GameHistory as GameHistoryType
} from './api';
import Dice from './components/Dice';
import GameHistory from './components/GameHistory';
import { Coins, Trophy, History } from 'lucide-react';

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initData: string;
                initDataUnsafe: {
                    user: {
                        id: number;
                        first_name: string;
                        last_name?: string;
                        username?: string;
                    };
                };
                ready: () => void;
                expand: () => void;
                close: () => void;
            };
        };
    }
}

export default function Home() {
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [balance, setBalance] = useState(0);
    const [isRolling, setIsRolling] = useState(false);
    const [lastRoll, setLastRoll] = useState<number | null>(null);
    const [gameResult, setGameResult] = useState<GameResult | null>(null);
    const [history, setHistory] = useState<GameHistoryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get user ID from URL params or Telegram WebApp
    const getUserId = (): number => {
        const urlUserId = searchParams.get('user_id');
        if (urlUserId) return parseInt(urlUserId);

        if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
            return window.Telegram.WebApp.initDataUnsafe.user.id;
        }

        return 0;
    };

    // Initialize Telegram WebApp
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
    }, []);

    // Initialize user and load data
    useEffect(() => {
        const initializeUser = async () => {
            try {
                setLoading(true);
                const userId = getUserId();

                if (!userId) {
                    setError('Не удалось получить ID пользователя');
                    return;
                }

                // Register user (will create if not exists)
                const userData = await registerUser(userId);
                setUser(userData);
                setBalance(userData.balance);

                // Load balance and history
                const balanceData = await getUserBalance(userId);
                setBalance(balanceData.balance);

                const historyData = await getGameHistory(userId);
                setHistory(historyData.history);

            } catch (err) {
                console.error('Initialization error:', err);
                setError('Ошибка инициализации приложения');
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, []);

    // Handle dice roll
    const handleRollDice = async () => {
        if (isRolling || !user) return;

        try {
            setIsRolling(true);
            setGameResult(null);

            // Simulate dice rolling animation
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Call backend to play
            const result = await playDice(user.telegram_id);

            setLastRoll(result.roll);
            setGameResult(result);
            setBalance(result.newBalance);

            // Update history
            const historyData = await getGameHistory(user.telegram_id);
            setHistory(historyData.history);

        } catch (err: any) {
            console.error('Play error:', err);
            setError(err.message || 'Ошибка при игре');
        } finally {
            setIsRolling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-telegram-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telegram-primary mx-auto mb-4"></div>
                    <p className="text-white">Загрузка...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-telegram-bg flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-white mb-2">Ошибка</h2>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-telegram-bg text-white p-4">
            <div className="max-w-md mx-auto space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">🎲 Crypto Dice</h1>
                    <p className="text-gray-400">Играйте в кости и выигрывайте TON</p>
                </div>

                {/* Balance */}
                <div className="bg-telegram-secondary rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Coins className="w-5 h-5 text-yellow-400" />
                            <span className="font-medium">Баланс</span>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-yellow-400">{balance.toFixed(2)} TON</div>
                            <div className="text-xs text-gray-400">
                                Кошелек: {user?.wallet_address?.slice(0, 8)}...{user?.wallet_address?.slice(-8)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Game Area */}
                <div className="bg-telegram-secondary rounded-lg p-6 text-center">
                    <div className="mb-6">
                        <Dice
                            value={lastRoll || 1}
                            isRolling={isRolling}
                            size="lg"
                        />
                    </div>

                    {gameResult && (
                        <div className={`mb-4 p-3 rounded-lg ${gameResult.isWin
                                ? 'bg-green-900/20 border border-green-500/30'
                                : 'bg-red-900/20 border border-red-500/30'
                            }`}>
                            <p className="font-medium">{gameResult.message}</p>
                        </div>
                    )}

                    <button
                        onClick={handleRollDice}
                        disabled={isRolling || balance < 1}
                        className={`btn-primary w-full ${isRolling || balance < 1
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                    >
                        {isRolling ? 'Бросаем кости...' : '🎲 Бросить кости (1 TON)'}
                    </button>

                    {balance < 1 && (
                        <p className="text-red-400 text-sm mt-2">
                            Недостаточно средств для игры
                        </p>
                    )}
                </div>

                {/* Game Rules */}
                <div className="bg-telegram-secondary rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                        <Trophy className="w-4 h-4 mr-2" />
                        Правила игры
                    </h3>
                    <div className="text-sm text-gray-400 space-y-1">
                        <p>• Ставка: 1 TON</p>
                        <p>• Выпало 4-6: выигрыш +2 TON</p>
                        <p>• Выпало 1-3: проигрыш -1 TON</p>
                    </div>
                </div>

                {/* History */}
                <div className="bg-telegram-secondary rounded-lg p-4">
                    <GameHistory history={history} />
                </div>
            </div>
        </div>
    );
}
