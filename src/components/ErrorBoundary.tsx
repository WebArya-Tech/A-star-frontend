import React from 'react';

type ErrorBoundaryState = {
    hasError: boolean;
    error?: Error;
};

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error('ErrorBoundary caught an error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-100 p-8">
                    <div className="max-w-lg rounded-2xl bg-white/90 p-10 shadow-lg border border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong.</h1>
                        <p className="text-gray-700 mb-6">
                            We’re sorry, but an unexpected error occurred. Please refresh the page or try again later.
                        </p>
                        <details className="text-sm text-gray-600 whitespace-pre-wrap">
                            {this.state.error?.toString()}
                        </details>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            Refresh page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
