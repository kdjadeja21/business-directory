import { Suspense } from "react";
import { businessService } from "@/lib/services/businessService";
import { BusinessDetails } from "@/components/BusinessDetails";
import { Loader } from "@/components/Loader";
import { notFound } from "next/navigation";
import { generateBusinessMetadata } from "@/lib/utils/metadata";
import { Metadata } from "next";

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

type Props = {
  params: { id: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const business = await businessService.getById(params.id);
  return generateBusinessMetadata(business);
}

export default async function BusinessPage({
  params,
}: {
  params: { id: string };
}) {
  const business = await businessService.getById(params.id);

  if (!business) {
    notFound();
  }

  return (
    <Suspense fallback={<Loader />}>
      <BusinessDetails business={business} />
    </Suspense>
  );
}
