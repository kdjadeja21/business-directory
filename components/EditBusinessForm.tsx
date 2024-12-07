"use client";

import { useState } from "react";
import { BusinessForm } from "@/components/BusinessForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Business } from "@/types/business";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EditBusinessFormProps {
  initialBusiness: Business | null;
}

export function EditBusinessForm({ initialBusiness }: EditBusinessFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!initialBusiness) {
    router.push("/admin");
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Admin
      </Button>

      <Card className="shadow-lg">
        <CardHeader className="space-y-2 border-b">
          <CardTitle className="text-3xl font-bold text-primary">
            Edit Business Profile
          </CardTitle>
          <p className="text-muted-foreground">
            Currently editing: {initialBusiness.name}
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <BusinessForm initialData={initialBusiness} isEditing />
        </CardContent>
      </Card>
    </div>
  );
}
