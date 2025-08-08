'use client';

import { GameHistory } from '../api';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface GameHistoryProps {
    history: GameHistory[];
}

export default function GameHistory({ history }: GameHistoryProps) {
    if (history.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                <p>История игр пуста</p>
                <p className="text-sm mt-2">Сыграйте в кости, чтобы увидеть историю</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white mb-4">История игр</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map((game) => (
                    <div
                        key={game.id}
                        className={`p-3 rounded-lg border ${game.is_win
                                ? 'bg-green-900/20 border-green-500/30'
                                : 'bg-red-900/20 border-red-500/30'
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className={`text-2xl ${game.is_win ? 'text-green-400' : 'text-red-400'}`}>
                                    {game.is_win ? '🎉' : '😔'}
                                </div>
                                <div>
                                    <div className="font-medium text-white">
                                        Выпало: {game.roll_result}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {game.is_win ? `+${game.win_amount} TON` : `${game.win_amount} TON`}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {format(new Date(game.created_at), 'dd.MM HH:mm', { locale: ru })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
