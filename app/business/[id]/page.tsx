import { Suspense } from "react";
import { businessService } from "@/lib/services/businessService";
import { BusinessDetails } from "@/components/BusinessDetails";
import { Loader } from "@/components/Loader";

export async function generateStaticParams() {
  try {
    const businesses = await businessService.getAll();
    return businesses.map((business) => ({
      id: business.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function BusinessPage({
  params,
}: {
  params: { id: string };
}) {
  const business = await businessService.getById(params.id);

  if (!business) {
    return <div>Business not found</div>;
  }

  return (
    <Suspense fallback={<Loader />}>
      <BusinessDetails business={business} />
    </Suspense>
  );
}
