"use client";

import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Upload, AlertCircle, Loader2, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import { z } from "zod";
import { businessService } from "@/lib/services/businessService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getSampleData } from "@/lib/utils/sampleData";

interface PhoneNumber {
  number: string;
  countryCode: string;
  hasWhatsapp: boolean;
}

interface Address {
  lines: string[];
  city: string;
  link?: string;
  phoneNumbers: PhoneNumber[];
  emails: string[];
}

interface Business {
  name: string;
  brief: string;
  description: string;
  profilePhoto?: string;
  categories: string[];
  addresses: Address[];
}

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
  availabilities1: z.object({
    enabled: z.boolean(),
    schedule: z.record(z.string(), z.object({
      isOpen: z.boolean(),
      timeSlots: z.array(z.object({
        openTime: z.string(),
        closeTime: z.string(),
      })),
    })),
  }).optional(),
  availabilities2: z.object({
    enabled: z.boolean(),
    schedule: z.record(z.string(), z.object({
      isOpen: z.boolean(),
      timeSlots: z.array(z.object({
        openTime: z.string(),
        closeTime: z.string(),
      })),
    })),
  }).optional(),
}).transform((data: Record<string, any>) => {
  const parseTimeSlots = (timeStr: string) => {
    if (timeStr === 'closed') return [];
    return timeStr.split(',').map(slot => {
      const [openTime, closeTime] = slot.trim().split('-');
      return { openTime, closeTime };
    });
  };

  const createSchedule = (prefix: string) => {
    if (data[`availabilitiesEnabled${prefix}`] !== 'true') return undefined;
    
    return {
      enabled: true,
      schedule: {
        monday: { isOpen: data[`monday${prefix}`] !== 'closed', timeSlots: parseTimeSlots(data[`monday${prefix}`] || '') },
        tuesday: { isOpen: data[`tuesday${prefix}`] !== 'closed', timeSlots: parseTimeSlots(data[`tuesday${prefix}`] || '') },
        wednesday: { isOpen: data[`wednesday${prefix}`] !== 'closed', timeSlots: parseTimeSlots(data[`wednesday${prefix}`] || '') },
        thursday: { isOpen: data[`thursday${prefix}`] !== 'closed', timeSlots: parseTimeSlots(data[`thursday${prefix}`] || '') },
        friday: { isOpen: data[`friday${prefix}`] !== 'closed', timeSlots: parseTimeSlots(data[`friday${prefix}`] || '') },
        saturday: { isOpen: data[`saturday${prefix}`] !== 'closed', timeSlots: parseTimeSlots(data[`saturday${prefix}`] || '') },
        sunday: { isOpen: data[`sunday${prefix}`] !== 'closed', timeSlots: parseTimeSlots(data[`sunday${prefix}`] || '') }
      }
    };
  };

  return {
    addresses: [
      {
        lines: [data.addressLine1, data.addressLine2].filter(Boolean),
        city: data.city,
        link: data.mapLink || "",
        phoneNumbers: [
          {
            number: data.phoneNumber1,
            countryCode: data.phoneCountryCode1,
            hasWhatsapp: data.phoneWhatsapp1 === "true"
          },
          // ... other phone numbers
        ].filter(phone => phone.number),
        emails: [data.email1, data.email2].filter(Boolean),
        availabilities: createSchedule('1')
      },
      data.addressLine1_2 ? {
        lines: [data.addressLine1_2, data.addressLine2_2].filter(Boolean),
        city: data.city_2,
        link: data.mapLink_2 || "",
        phoneNumbers: [
          {
            number: data.phoneNumber1_2,
            countryCode: data.phoneCountryCode1_2,
            hasWhatsapp: data.phoneWhatsapp1_2 === "true"
          }
        ].filter(phone => phone.number),
        emails: [data.email1_2].filter(Boolean),
        availabilities: createSchedule('2')
      } : null
    ].filter(Boolean)
  };
});

const handleDownloadSample = () => {
  const sampleData = getSampleData();
  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sample");
  XLSX.writeFile(wb, "business_upload_sample.xlsx");
};

const isDuplicateBusiness = (existingBusinesses: Business[], newBusiness: Business) => {
  return existingBusinesses.some(existing => {
    // Check if any address from the new business matches completely with any address from existing business
    return (
      existing.name.toLowerCase() === newBusiness.name.toLowerCase() && // Name must match
      newBusiness.addresses.some(newAddr => 
        existing.addresses.some(existingAddr => {
          // City must match
          const cityMatch = existingAddr.city.toLowerCase() === newAddr.city.toLowerCase();
          if (!cityMatch) return false;

          // At least one phone number must match
          const phoneMatch = existingAddr.phoneNumbers.some(existingPhone =>
            newAddr.phoneNumbers.some(newPhone =>
              existingPhone.number === newPhone.number
            )
          );
          if (!phoneMatch) return false;

          // At least one email must match
          const emailMatch = existingAddr.emails.some(existingEmail =>
            newAddr.emails.some(newEmail =>
              existingEmail.toLowerCase() === newEmail.toLowerCase()
            )
          );
          if (!emailMatch) return false;

          // All conditions met
          return true;
        })
      )
    );
  });
};

export function BulkUploadDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validRecords, setValidRecords] = useState<Business[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [existingBusinesses, setExistingBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    const fetchExistingBusinesses = async () => {
      try {
        const businesses = await businessService.getAll();
        setExistingBusinesses(businesses as Business[]);
      } catch (error) {
        console.error('Error fetching existing businesses:', error);
      }
    };

    if (open) {
      fetchExistingBusinesses();
    }
  }, [open]);

  const resetState = () => {
    setIsUploading(false);
    setIsProcessing(false);
    setValidRecords([]);
    setValidationErrors([]);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

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
      const valid: Business[] = [];

      jsonData.forEach((record: any, index) => {
        try {
          const transformedRecord = {
            name: record.name,
            brief: record.brief,
            description: record.description,
            profilePhoto: record.profilePhoto || "",
            categories: record.categories?.split(',').map((c: string) => c.trim()) || [],
            addresses: (() => {
              const addresses = [];
              let addressIndex = 1;
              
              while (true) {
                const suffix = addressIndex === 1 ? '' : `_${addressIndex}`;
                const addressLine1Field = `addressLine1${suffix}`;
                
                // Break if no more addresses exist
                if (!record[addressLine1Field]) break;
                
                addresses.push({
                  lines: [
                    record[addressLine1Field],
                    record[`addressLine2${suffix}`] || ""
                  ].filter(Boolean),
                  city: record[`city${suffix}`],
                  link: record[`mapLink${suffix}`] || "",
                  phoneNumbers: [
                    // First phone number for this address
                    record[`phoneNumber1${suffix}`] && {
                      number: record[`phoneNumber1${suffix}`],
                      countryCode: record[`phoneCountryCode1${suffix}`] || "+91",
                      hasWhatsapp: record[`phoneWhatsapp1${suffix}`]?.toLowerCase() === "true"
                    },
                    // Second phone number for this address
                    record[`phoneNumber2${suffix}`] && {
                      number: record[`phoneNumber2${suffix}`],
                      countryCode: record[`phoneCountryCode2${suffix}`] || "+91",
                      hasWhatsapp: record[`phoneWhatsapp2${suffix}`]?.toLowerCase() === "true"
                    }
                  ].filter(Boolean),
                  emails: [
                    record[`email1${suffix}`] || "",
                    record[`email2${suffix}`] || ""
                  ].filter(Boolean)
                });
                
                addressIndex++;
              }
              
              return addresses;
            })()
          };

          // Validate schema
          recordSchema.parse(transformedRecord);

          // Check for duplicates
          if (isDuplicateBusiness(existingBusinesses, transformedRecord)) {
            transformedRecord.addresses.forEach((addr: Address) => {
              const duplicateAddr = existingBusinesses
                .filter(e => e.name.toLowerCase() === transformedRecord.name.toLowerCase())
                .flatMap(b => b.addresses)
                .find(ea => 
                  ea.city.toLowerCase() === addr.city.toLowerCase() &&
                  ea.phoneNumbers.some(ep => addr.phoneNumbers.some(ap => ep.number === ap.number)) &&
                  ea.emails.some(ee => addr.emails.some(ae => ee.toLowerCase() === ae.toLowerCase()))
                );

              if (duplicateAddr) {
                const matchingPhone = addr.phoneNumbers.find(phone => 
                  duplicateAddr.phoneNumbers.some(ep => ep.number === phone.number)
                );
                const matchingEmail = addr.emails.find(email => 
                  duplicateAddr.emails.some(ee => ee.toLowerCase() === email.toLowerCase())
                );

                errors.push(
                  `Row ${index + 2}: Duplicate record found with name "${transformedRecord.name}", city "${addr.city}", ` +
                  `phone "${matchingPhone?.number}", and email "${matchingEmail}"`
                );
              }
            });
          } else {
            valid.push(transformedRecord);
          }
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
    if (!validRecords.length || !user) return;

    setIsProcessing(true);
    const currentUsername = user.email?.split("@")[0] || "anonymous";
    const recordsToAdd = validRecords.map(record => ({
      ...record,
      user_id: user.uid,
      createdBy: currentUsername,
      updatedBy: currentUsername,
    }));

    try {
      // First verify all records can be created
      for (const record of recordsToAdd) {
        try {
          recordSchema.parse(record);
        } catch (error) {
          console.error('Validation error:', error);
          throw new Error('One or more records failed validation');
        }
      }

      const results = await Promise.allSettled(
        recordsToAdd.map(record => businessService.create(record))
      );

      toast.success(`Successfully added ${results.length} businesses`);
      onSuccess?.(); // Call the success callback
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading records:', error);
      toast.error("Failed to upload records. No records were added.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        if (!open) {
          resetState();
        }
        onOpenChange(open);
      }}
    >
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