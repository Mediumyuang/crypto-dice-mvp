import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Crypto Dice - Telegram Mini App',
    description: 'Play dice and win TON tokens on testnet',
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
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
