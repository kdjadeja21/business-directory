import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BusinessCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
    </div>
  );
}
