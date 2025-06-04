import React from 'react'
import { Bell, Calendar, ClipboardList, User } from 'lucide-react'
import { useStore } from '@/lib/store/useStore'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    const location = useLocation()
    const user = useStore((state) => state.user)

    const navigation =
        user?.role === 'DOCTOR'
            ? [
                  { name: 'Principal', icon: User, path: '/doctor' },
                  { name: 'Agenda', icon: Calendar, path: '/doctor/schedule' },
                  {
                      name: 'Histórico',
                      icon: ClipboardList,
                      path: '/doctor/history',
                  },
                  { name: 'Perfil', icon: User, path: '/doctor/profile' },
              ]
            : [
                  { name: 'Principal', icon: User, path: '/patient' },
                  {
                      name: 'Consultas',
                      icon: Calendar,
                      path: '/patient/appointments',
                  },
                  {
                      name: 'Histórico',
                      icon: ClipboardList,
                      path: '/patient/history',
                  },
                  { name: 'Perfil', icon: User, path: '/patient/profile' },
              ]

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold">
                        MediConsulta
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-white hover:text-white hover:bg-blue-700"
                        >
                            <Bell size={24} />
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                            >
                                2
                            </Badge>
                        </Button>
                        <div className="flex items-center space-x-2">
                            <Avatar>
                                <AvatarFallback>
                                    {user?.name
                                        ?.split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                </AvatarFallback>
                            </Avatar>
                            <span>Olá, {user?.name}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto p-4 md:p-6">
                {children}
            </main>

            {/* Footer Navigation */}
            <nav className="bg-white shadow-inner border-t">
                <div className="container mx-auto">
                    <div className="flex justify-around">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`p-4 flex flex-col items-center ${
                                        isActive
                                            ? 'text-blue-600'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    <Icon size={20} />
                                    <span className="text-xs mt-1">
                                        {item.name}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </nav>
        </div>
    )
}
