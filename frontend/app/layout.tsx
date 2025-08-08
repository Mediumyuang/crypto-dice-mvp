import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Crypto Dice - Telegram Mini App',
    description: 'Play dice and win TON tokens on testnet',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ru">
            <head>
                <script src="https://telegram.org/js/telegram-web-app.js"></script>
            </head>
            <body className="telegram-webapp">
                {children}
            </body>
        </html>
    )
}
