import { useEffect, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from '@/store/theme-store'
import { router } from '@/app/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
})

function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, getResolvedTheme } = useThemeStore()

  useEffect(() => {
    const resolved = getResolvedTheme()
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }, [theme, getResolvedTheme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (useThemeStore.getState().theme === 'system') {
        document.documentElement.classList.toggle('dark', mediaQuery.matches)
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return <>{children}</>
}

export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
