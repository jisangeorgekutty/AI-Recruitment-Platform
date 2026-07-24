import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential?: string }) => void
            auto_select?: boolean
            use_fedcm_for_prompt?: boolean
          }) => void
          prompt: (notification?: (notification: { isNotDisplayed: () => boolean; getNotDisplayedReason: () => string }) => void) => void
          renderButton: (parent: HTMLElement, options: object) => void
        }
      }
    }
  }
}

export function useGoogleAuth() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    if (window.google?.accounts?.id) {
      setIsScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => setIsScriptLoaded(true)
    document.body.appendChild(script)
  }, [])

  const promptGoogleSignIn = (onTokenReceived: (idToken: string) => void): boolean => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      toast.error('VITE_GOOGLE_CLIENT_ID is missing in frontend/.env')
      return false
    }

    if (!window.google?.accounts?.id) {
      toast.error('Google Sign-In SDK is loading, please try again in a moment.')
      return false
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        use_fedcm_for_prompt: false, // Prevents FedCM NetworkError on localhost
        callback: (response) => {
          if (response.credential) {
            onTokenReceived(response.credential)
          } else {
            toast.error('Failed to receive Google credential.')
          }
        },
      })

      // Create an invisible button container to trigger official popup if prompt is blocked
      const hiddenContainer = document.createElement('div')
      hiddenContainer.style.display = 'none'
      document.body.appendChild(hiddenContainer)

      window.google.accounts.id.renderButton(hiddenContainer, {
        type: 'standard',
        size: 'large',
      })

      // Trigger button click inside container
      const btn = hiddenContainer.querySelector('div[role="button"]') as HTMLElement
      if (btn) {
        btn.click()
      } else {
        window.google.accounts.id.prompt()
      }

      setTimeout(() => {
        if (document.body.contains(hiddenContainer)) {
          document.body.removeChild(hiddenContainer)
        }
      }, 5000)

      return true
    } catch (err) {
      console.error('Google Auth Error:', err)
      toast.error('Failed to launch Google authentication prompt.')
      return false
    }
  }

  return { isScriptLoaded, promptGoogleSignIn }
}
