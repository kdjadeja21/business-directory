export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { businessService } from "@/lib/services/businessService";
import { EditBusinessForm } from "@/components/EditBusinessForm";

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

export default async function EditBusinessPage({
  params,
}: {
  params: { id: string };
}) {
  const business = await businessService.getById(params.id);

  return <EditBusinessForm initialBusiness={business} />;
}
