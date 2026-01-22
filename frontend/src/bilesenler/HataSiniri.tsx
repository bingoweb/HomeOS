import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Dugme } from './Dugme';
import { Kart } from './Kart';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class HataSiniri extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Hata Sınırı yakaladı:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] w-full items-center justify-center p-4">
          <Kart className="max-w-md w-full bg-red-500/5 border-red-500/20">
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                <AlertTriangle size={32} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-2">Bir Hata Oluştu</h2>
                <p className="text-gray-400 text-sm">
                  Uygulama çalışırken beklenmedik bir sorunla karşılaştı.
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="w-full p-3 bg-black/30 rounded-lg text-left overflow-auto max-h-40">
                  <p className="text-red-400 font-mono text-xs break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <Dugme
                onClick={this.handleReset}
                varyant="danger"
                solIkon={<RefreshCw size={16} />}
              >
                Yeniden Dene
              </Dugme>
            </div>
          </Kart>
        </div>
      );
    }

    return this.props.children;
  }
}
