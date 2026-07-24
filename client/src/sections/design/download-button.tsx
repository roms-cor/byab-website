import { Download } from "lucide-react";

export function DownloadButton({ src, filename }: { src: string; filename: string }) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <button
      onClick={handleDownload}
      data-testid={`button-download-${filename.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20)}`}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 border border-border/50 text-muted-foreground"
      aria-label={`Download ${filename}`}
    >
      <Download className="w-3 h-3" aria-hidden="true" />
      {filename}
    </button>
  );
}
