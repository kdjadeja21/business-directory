import { Suspense } from "react";
import { businessService } from "@/lib/services/businessService";
import { ProfileCard } from "@/components/ProfileCard";
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

export default async function ProfileCardPage({
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
      <ProfileCard business={business} />
    </Suspense>
  );
}