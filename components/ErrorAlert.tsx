'use client';

interface ErrorAlertProps {
  title: string;
  message: string;
  onDismiss?: () => void;
}

export function ErrorAlert({ title, message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="p-4 bg-accent-red/10 border-l-4 border-accent-red rounded-3xl mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-6 h-6 rounded-full bg-accent-red/20 flex items-center justify-center">
            <span className="text-accent-red font-bold text-sm">!</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-accent-red mb-1">{title}</h3>
          <p className="text-sm text-body">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-accent-red hover:text-accent-red/70 transition-colors p-1"
            aria-label="Dismiss error"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
