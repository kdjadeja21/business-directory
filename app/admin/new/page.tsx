"use client";

import { BusinessForm } from "@/components/BusinessForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewBusinessPage() {
  const router = useRouter();

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
            Add New Business
          </CardTitle>
          <p className="text-muted-foreground">
            Fill out the form below to add a new business listing
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <BusinessForm />
        </CardContent>
      </Card>
    </div>
  );
}
