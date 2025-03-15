import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Bir sonraki render'da fallback UI göstermek için state'i güncelle
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Hata bilgilerini yakalayabilirsiniz
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Hata loglaması yapabilirsiniz
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Özelleştirilmiş hata UI'ı
      return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4 mt-10">
          <div className="text-red-500 text-5xl mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Bir şeyler yanlış gitti
          </h2>
          <p className="text-gray-600 text-center">
            Üzgünüz, bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra
            tekrar deneyin.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Sayfayı Yenile
          </button>
          {this.props.showDetails && this.state.error && (
            <div className="mt-4 p-4 bg-gray-100 rounded w-full overflow-auto">
              <p className="font-mono text-sm text-red-600">
                {this.state.error.toString()}
              </p>
              <pre className="mt-2 font-mono text-xs text-gray-700 overflow-x-auto">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    // Hata yoksa children'ı render et
    return this.props.children;
  }
}

export default ErrorBoundary;
