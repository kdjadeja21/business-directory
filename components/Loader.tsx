import { Loader2 } from "lucide-react";

export function Loader({
  className = "h-8 w-8 text-primary",
}: {
  className?: string;
}) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 font-sans">
        Business Directory
      </h1>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
