import React, { Component } from "react";
import { logError } from "../../utils/logger";

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
    logError("ErrorBoundary", "Error Boundary caught an error:", {
      error,
      errorInfo,
    });
  }

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      // Özelleştirilmiş hata UI'ı
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
            <div className="flex flex-col items-center">
              <div className="text-red-500 text-5xl mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bir şeyler yanlış gitti
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Üzgünüz, bir hata oluştu. Bu sorun geçici olabilir veya uygulama
                kodunda bir problem olabilir.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button
                  onPress={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Sayfayı Yenile
                  </div>
                </button>

                <button
                  onPress={this.handleGoBack}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Önceki Sayfaya Dön
                  </div>
                </button>
              </div>
            </div>

            {this.props.showDetails && this.state.error && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg w-full overflow-auto border border-gray-300">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Hata Detayları:
                </h3>
                <p className="font-mono text-sm text-red-600 mb-2">
                  {this.state.error.toString()}
                </p>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Komponent Yığını:
                </h3>
                <pre className="font-mono text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Hata yoksa children'ı render et
    return this.props.children;
  }
}

export default ErrorBoundary;
