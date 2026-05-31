import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Ошибка приложения:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f4f0e8] p-6 text-center text-[#1a2332]">
          <h1 className="text-xl font-semibold">Не удалось загрузить карту</h1>
          <p className="max-w-md text-sm opacity-75">{this.state.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-[#2d6a6a] px-5 py-2 text-sm text-white"
          >
            Обновить страницу
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
