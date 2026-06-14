import { Component } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="min-h-[60vh] flex items-center justify-center bg-cream px-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-3">
              {this.props.title || 'Something went wrong'}
            </h2>
            <p className="text-dark/60 mb-8">
              {this.props.message || 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-gold/30 transition-all inline-flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Refresh Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
