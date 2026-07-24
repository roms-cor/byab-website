import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      data-testid={`button-copy-${text.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)}`}
      className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground transition-colors duration-150 ${copied ? "bg-border" : "bg-transparent"}`}
      aria-label={`Copy ${text} to clipboard`}
    >
      {copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
    </button>
  );
}
