"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type UserRole = "parent" | "volunteer"

interface User {
  id: string
  username: string
  email?: string
  phone?: string
  studentName?: string
  parentName?: string
  school?: string
  role: UserRole
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithGoogle: () => Promise<void>
  signup: (userData: SignupData) => Promise<void>
  logout: () => void
}

interface LoginCredentials {
  identifier: string // email, phone, or username
  password: string
  method: 'email' | 'phone' | 'username'
}

interface SignupData {
  method: 'email' | 'phone' | 'manual'
  email?: string
  phone?: string
  username: string
  password: string
  studentName?: string
  parentName?: string
  school?: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    username: "emma_parent",
    email: "parent@example.com",
    phone: "+852 9876 5432",
    password: "password123",
    role: "parent" as UserRole,
    createdAt: new Date().toISOString()
  },
  {
    id: "2", 
    username: "testuser",
    email: "test@example.com",
    password: "test123",
    role: "parent" as UserRole,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    username: "volunteer_user",
    email: "volunteer@example.com",
    password: "volunteer123",
    role: "volunteer" as UserRole,
    createdAt: new Date().toISOString()
  }
]

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password', '/admin']

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Start with true to check auth state
  const router = useRouter()
  const pathname = usePathname()
  
  // Note: Starting with isLoading = false for frontend-only mode

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))

  // Initialize auth state from localStorage
  useEffect(() => {
    setIsLoading(true)
    try {
      // For development: uncomment the next 3 lines to force logout
      // localStorage.removeItem('auth_user')
      // localStorage.removeItem('auth_token')
      // setIsLoading(false); return;
      
      const storedUser = localStorage.getItem('auth_user')
      const storedToken = localStorage.getItem('auth_token')
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      if (!user && !isPublicRoute) {
        // Redirect to login if not authenticated and trying to access protected route
        router.push('/login')
      } else if (user && user.role === 'parent' && isPublicRoute && !pathname.startsWith('/admin')) {
        // Redirect to dashboard if authenticated and trying to access auth pages (for parents)
        router.push('/')
      } else if (user && user.role === 'volunteer' && isPublicRoute && !pathname.startsWith('/admin')) {
        // Redirect to dashboard if authenticated and trying to access auth pages (for volunteers)
        router.push('/volunteer')
      }
    }
  }, [user, isLoading, isPublicRoute, router, pathname])

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true)
    
    try {
      // Mock authentication - in real app, call your API
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay
      
      // Find user by identifier and password
      const mockUser = MOCK_USERS.find(u => {
        const identifierMatch = 
          u.email === credentials.identifier || 
          u.phone === credentials.identifier || 
          u.username === credentials.identifier
        return identifierMatch && u.password === credentials.password
      })

      if (!mockUser) {
        throw new Error('Invalid credentials')
      }

      // Create user object (exclude password)
      const { password, ...userData } = mockUser
      const authenticatedUser: User = userData

      // Store in localStorage (in real app, store secure tokens)
      localStorage.setItem('auth_user', JSON.stringify(authenticatedUser))
      localStorage.setItem('auth_token', 'mock_jwt_token_' + Date.now())

      setUser(authenticatedUser)
      // Role-based redirect
      if (authenticatedUser.role === 'volunteer') {
        router.push('/volunteer')
      } else {
        router.push('/')
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true)
    
    try {
      // Mock Google authentication
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Create mock Google user - default to parent role
      const googleUser: User = {
        id: "google_" + Date.now(),
        username: "google_user",
        email: "user@gmail.com",
        role: "parent",
        createdAt: new Date().toISOString()
      }

      localStorage.setItem('auth_user', JSON.stringify(googleUser))
      localStorage.setItem('auth_token', 'mock_google_token_' + Date.now())

      setUser(googleUser)
      setIsLoading(false) // Fix: Set loading to false after successful login
      // Role-based redirect
      if (googleUser.role === 'volunteer') {
        router.push('/volunteer')
      } else {
        router.push('/')
      }
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const signup = async (userData: SignupData): Promise<void> => {
    setIsLoading(true)
    
    try {
      // Mock signup - in real app, call your API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Check if username already exists
      const existingUser = MOCK_USERS.find(u => u.username === userData.username)
      if (existingUser) {
        throw new Error('Username already exists')
      }

      // Create new user
      const newUser: User = {
        id: "user_" + Date.now(),
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        studentName: userData.studentName,
        parentName: userData.parentName,
        school: userData.school,
        role: userData.role,
        createdAt: new Date().toISOString()
      }

      // Add to mock users (in real app, this would be handled by backend)
      MOCK_USERS.push({
        ...newUser,
        password: userData.password
      } as any)

      localStorage.setItem('auth_user', JSON.stringify(newUser))
      localStorage.setItem('auth_token', 'mock_signup_token_' + Date.now())

      setUser(newUser)
      setIsLoading(false) // Fix: Set loading to false after successful signup
      // Role-based redirect
      if (newUser.role === 'volunteer') {
        router.push('/volunteer')
      } else {
        router.push('/')
      }
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    setUser(null)
    console.log('Logging out')
    router.push('/login')
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
