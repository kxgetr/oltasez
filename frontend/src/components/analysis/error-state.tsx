import * as React from "react";
import { ServerCrash, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-6 sm:p-8 rounded-2xl border border-rose-500/40 bg-rose-950/20 backdrop-blur-md shadow-[0_0_35px_-5px_rgba(239,68,68,0.25)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0 mt-0.5">
            <ServerCrash className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-rose-200">
              Analiz Gerçekleştirilemedi
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-rose-300/80 leading-relaxed max-w-xl">
              {message}
            </p>
            <div className="mt-2 text-[11px] font-mono text-rose-400/70">
              Servis bağlantısını kontrol ediniz veya kısa bir süre sonra tekrar deneyiniz.
            </div>
          </div>
        </div>

        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10 self-stretch sm:self-auto shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Yeniden Dene
          </Button>
        )}
      </div>
    </div>
  );
}
