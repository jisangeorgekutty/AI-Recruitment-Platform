import { Component, type ReactNode, type ErrorInfo } from 'react'
import { ErrorState } from './error-state'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <ErrorState
          title="Something went wrong"
          message={this.state.error?.message || 'An unexpected error occurred'}
          onRetry={() => this.setState({ hasError: false, error: undefined })}
        />
      )
    }

    return this.props.children
  }
}
