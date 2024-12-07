import { Suspense } from "react";
import BusinessDirectory from "@/components/BusinessDirectory";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BusinessDirectory />
    </Suspense>
  );
}
