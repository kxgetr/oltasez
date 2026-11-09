import React from "react";

interface AnalysisWorkspaceProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function AnalysisWorkspace({
  children,
  headerTitle,
  headerSubtitle,
  actions,
  className = "",
}: AnalysisWorkspaceProps) {
  return (
    <main className={`flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full overflow-y-auto ${className}`}>
      {(headerTitle || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border-subtle">
          <div>
            {headerTitle && (
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-ink">
                {headerTitle}
              </h1>
            )}
            {headerSubtitle && (
              <p className="text-xs md:text-sm text-ink-secondary mt-1">
                {headerSubtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </main>
  );
}
