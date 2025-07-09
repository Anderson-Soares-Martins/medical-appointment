'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatInitials } from '@/utils/format'
import ProtectedRoute from '@/components/common/protected-route'
import {
    Calendar,
    Home,
    Clock,
    Settings,
    LogOut,
    Menu,
    X,
    UserPlus,
} from 'lucide-react'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const navigationItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Consultas', href: '/appointments', icon: Calendar },
        ...(user?.role === 'PATIENT'
            ? [
                  //   { name: 'Médicos', href: '/doctors', icon: Stethoscope },
                  {
                      name: 'Agendar',
                      href: '/appointments/new',
                      icon: UserPlus,
                  },
              ]
            : []),
        ...(user?.role === 'DOCTOR'
            ? [
                  { name: 'Hoje', href: '/appointments/today', icon: Clock },
                  //   { name: 'Pacientes', href: '/patients', icon: Users },
              ]
            : []),
        { name: 'Histórico', href: '/history', icon: Clock },
        { name: 'Configurações', href: '/settings', icon: Settings },
    ]

    const isActive = (href: string) => pathname === href

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Mobile sidebar */}
                <div
                    className={`fixed inset-0 z-50 lg:hidden ${
                        sidebarOpen ? 'block' : 'hidden'
                    }`}
                >
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
                        <div className="flex items-center justify-between h-16 px-4 border-b">
                            <h1 className="text-xl font-bold text-blue-600">
                                MedConsult
                            </h1>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <nav className="mt-8">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium ${
                                        isActive(item.href)
                                            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Desktop sidebar */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                    <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
                        <div className="flex items-center h-16 px-4 border-b">
                            <h1 className="text-xl font-bold text-blue-600">
                                MedConsult
                            </h1>
                        </div>
                        <nav className="flex-1 mt-8 overflow-y-auto">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium ${
                                        isActive(item.href)
                                            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main content */}
                <div className="lg:pl-64">
                    {/* Header */}
                    <header className="bg-white shadow-sm border-b">
                        <div className="flex justify-between items-center px-4 py-4">
                            <div className="flex items-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="lg:hidden"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                                <h2 className="text-lg font-semibold text-gray-900 ml-2 lg:ml-0">
                                    {navigationItems.find((item) =>
                                        isActive(item.href)
                                    )?.name || 'Dashboard'}
                                </h2>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-sm text-gray-600">
                                    {user?.role === 'DOCTOR' ? 'Dr. ' : ''}
                                    {user?.name}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="relative h-8 w-8 rounded-full"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {formatInitials(
                                                        user?.name || ''
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56"
                                        align="end"
                                        forceMount
                                    >
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings">
                                                <Settings className="mr-2 h-4 w-4" />
                                                Configurações
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Sair
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}
