"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, AlertCircle, Loader2, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import { z } from "zod";
import { businessService } from "@/lib/services/businessService";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Use the same validation schema as BusinessForm
const recordSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  brief: z.string().min(10, "Brief description must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  profilePhoto: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  addresses: z.array(
    z.object({
      lines: z.array(z.string()).min(1),
      city: z.string().min(1, "City is required"),
      link: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
      phoneNumbers: z.array(
        z.object({
          number: z.string(),
          countryCode: z.string(),
          hasWhatsapp: z.boolean(),
        })
      ),
      emails: z.array(z.string().email("Invalid email format")),
    })
  ).min(1),
});

const getSampleData = () => [
  {
    name: "First Business Name",
    brief: "A brief description of the first business (min 10 chars)",
    description: "A detailed description of the first business that explains services and offerings (min 20 chars)",
    profilePhoto: "https://example.com/photo1.jpg",
    categories: "Restaurant, Cafe, Food",
    // First address
    addressLine1: "123 Main St",
    addressLine2: "Suite 100",
    city: "New York",
    mapLink: "https://maps.google.com/location1",
    phoneNumber1: "1234567890",
    phoneCountryCode1: "+1",
    phoneWhatsapp1: "true",
    phoneNumber2: "0987654321",
    phoneCountryCode2: "+1",
    phoneWhatsapp2: "false",
    email1: "contact@business1.com",
    email2: "info@business1.com"
  },
  {
    name: "Second Business Name",
    brief: "A brief description of the second business (min 10 chars)",
    description: "A detailed description of the second business that explains services and offerings (min 20 chars)",
    profilePhoto: "https://example.com/photo2.jpg",
    categories: "Retail, Fashion, Accessories",
    // First address
    addressLine1: "456 Oak Avenue",
    addressLine2: "Floor 2",
    city: "Los Angeles",
    mapLink: "https://maps.google.com/location2",
    phoneNumber1: "2345678901",
    phoneCountryCode1: "+1",
    phoneWhatsapp1: "true",
    email1: "la@business2.com",
    // Second address
    addressLine1_2: "789 Pine Street",
    addressLine2_2: "Shop 45",
    city_2: "San Francisco",
    mapLink_2: "https://maps.google.com/location3",
    phoneNumber1_2: "3456789012",
    phoneCountryCode1_2: "+1",
    phoneWhatsapp1_2: "false",
    phoneNumber2_2: "4567890123",
    phoneCountryCode2_2: "+1",
    phoneWhatsapp2_2: "true",
    email1_2: "sf@business2.com",
    email2_2: "info@business2.com"
  }
];

const handleDownloadSample = () => {
  const sampleData = getSampleData();
  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sample");
  XLSX.writeFile(wb, "business_upload_sample.xlsx");
};

export function BulkUploadDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validRecords, setValidRecords] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      toast.error("Please upload an Excel (.xlsx) file");
      return;
    }

    setIsUploading(true);
    setValidRecords([]);
    setValidationErrors([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const errors: string[] = [];
      const valid: any[] = [];

      jsonData.forEach((record: any, index) => {
        try {
          const addresses = [];
          
          // First address
          if (record.addressLine1) {
            addresses.push({
              lines: [record.addressLine1, record.addressLine2].filter(Boolean),
              city: record.city,
              link: record.mapLink,
              phoneNumbers: [
                record.phoneNumber1 && {
                  number: record.phoneNumber1,
                  countryCode: record.phoneCountryCode1 || "+91",
                  hasWhatsapp: record.phoneWhatsapp1?.toLowerCase() === "true"
                },
                record.phoneNumber2 && {
                  number: record.phoneNumber2,
                  countryCode: record.phoneCountryCode2 || "+91",
                  hasWhatsapp: record.phoneWhatsapp2?.toLowerCase() === "true"
                }
              ].filter(Boolean),
              emails: [record.email1, record.email2].filter(Boolean)
            });
          }

          // Second address
          if (record.addressLine1_2) {
            addresses.push({
              lines: [record.addressLine1_2, record.addressLine2_2].filter(Boolean),
              city: record.city_2,
              link: record.mapLink_2,
              phoneNumbers: [
                record.phoneNumber1_2 && {
                  number: record.phoneNumber1_2,
                  countryCode: record.phoneCountryCode1_2 || "+91",
                  hasWhatsapp: record.phoneWhatsapp1_2?.toLowerCase() === "true"
                },
                record.phoneNumber2_2 && {
                  number: record.phoneNumber2_2,
                  countryCode: record.phoneCountryCode2_2 || "+91",
                  hasWhatsapp: record.phoneWhatsapp2_2?.toLowerCase() === "true"
                }
              ].filter(Boolean),
              emails: [record.email1_2, record.email2_2].filter(Boolean)
            });
          }

          const transformedRecord = {
            name: record.name,
            brief: record.brief,
            description: record.description,
            profilePhoto: record.profilePhoto,
            categories: record.categories?.split(',').map((c: string) => c.trim()) || [],
            addresses
          };

          recordSchema.parse(transformedRecord);
          valid.push(transformedRecord);
        } catch (error) {
          if (error instanceof z.ZodError) {
            error.errors.forEach((err) => {
              errors.push(`Row ${index + 2}: ${err.path.join('.')} - ${err.message}`);
            });
          }
        }
      });

      if (errors.length > 0) {
        setValidationErrors(errors);
      } else {
        setValidRecords(valid);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error("Failed to process Excel file");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleBulkUpload = async () => {
    if (validRecords.length === 0) return;

    setIsProcessing(true);
    try {
      for (const record of validRecords) {
        await businessService.create(record);
      }
      toast.success(`Successfully added ${validRecords.length} businesses`);
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading records:', error);
      toast.error("Failed to upload records");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Businesses</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>Upload an Excel file (.xlsx) containing business records.</p>
            <Button
              variant="link"
              onClick={handleDownloadSample}
              className="h-auto p-0 text-primary hover:text-primary/80"
            >
              Download sample Excel file
            </Button>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              disabled={isUploading || isProcessing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button
              variant="outline"
              className="w-full"
              disabled={isUploading || isProcessing}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileSpreadsheet className="h-4 w-4 mr-2" />
              )}
              {isUploading ? "Processing..." : "Select Excel File"}
            </Button>
          </div>

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="max-h-[200px] overflow-y-auto">
                  {validationErrors.map((error, index) => (
                    <div key={index} className="text-sm">
                      {error}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {validRecords.length > 0 && (
            <Alert>
              <AlertDescription>
                {validRecords.length} valid records ready to upload
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          {validRecords.length > 0 && (
            <Button
              onClick={handleBulkUpload}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {validRecords.length} Records
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 