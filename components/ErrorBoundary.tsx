import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    // TODO: Send to Sentry or logging service
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="h-screen w-full bg-[#000000] text-white flex flex-col items-center justify-center p-6 text-center font-mono">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          
          <h1 className="text-xl font-black uppercase tracking-widest mb-2 text-white">System Failure</h1>
          <p className="text-xs text-slate-500 font-medium mb-8 max-w-xs leading-relaxed">
            CRITICAL_ERROR: {this.state.error?.message || 'Unknown Exception'}
          </p>

          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 hover:bg-slate-200 transition-colors active:scale-95"
          >
            <RefreshCw size={14} /> Reboot System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}