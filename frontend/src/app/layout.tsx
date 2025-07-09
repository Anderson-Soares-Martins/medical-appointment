import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/providers/query-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { ToasterProvider } from '@/providers/toaster-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Sistema de Consultas Médicas',
    description:
        'Sistema de gestão de consultas médicas para clínicas e hospitais',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <QueryProvider>
                    <AuthProvider>
                        {children}
                        <ToasterProvider />
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    )
}
