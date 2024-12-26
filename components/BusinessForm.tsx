"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Business } from "@/types/business";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { businessService } from "@/lib/services/businessService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Phone, Mail, Plus, Trash2, Upload } from "lucide-react";
import { CITIES } from "@/lib/constants/cities";
import Image from "next/image";
import { CATEGORIES } from "@/lib/constants/categories";
import CreatableSelect from "react-select/creatable";
import { useAuth } from "@/hooks/useAuth";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/constants/countries";

type Timer = ReturnType<typeof setTimeout>;
type DebouncedFunction = (...args: any[]) => void;

function createDebounce(func: Function, wait: number): DebouncedFunction {
  let timeout: Timer;
  
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  brief: z.string().min(10, "Brief description must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  profilePhoto: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  addresses: z.array(
    z.object({
      lines: z.array(z.string()).min(1, "At least one address line is required").refine(
        (lines) => lines.every(line => line.length > 0),
        "Address lines cannot be empty"
      ),
      city: z.string().min(1, "City is required"),
      link: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
      phoneNumbers: z.array(
        z.object({
          number: z.string(),
          countryCode: z.string(),
          hasWhatsapp: z.boolean(),
        })
      ).transform(phones => phones.filter(phone => phone.number.trim() !== '')),
      emails: z.array(z.string().email("Invalid email format"))
        .transform(emails => emails.filter(email => email.trim() !== '')),
    })
  ).min(1, "At least one address is required"),
});

type FormSchema = z.infer<typeof formSchema>;

interface BusinessFormProps {
  initialData?: Business;
  isEditing?: boolean;
}

export function BusinessForm({ initialData, isEditing }: BusinessFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [existingData, setExistingData] = useState<{
    categories: string[];
    cities: string[];
  }>({
    categories: [...CATEGORIES],
    cities: [...CITIES],
  });

  const defaultAddress = {
    lines: [""],
    city: "",
    link: "",
    phoneNumbers: [{
      number: "",
      countryCode: "+91",
      hasWhatsapp: false
    }],
    emails: [""],
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          profilePhoto: initialData.profilePhoto || "",
          categories: initialData.categories || [],
          addresses: initialData.addresses?.map(address => ({
            lines: address.lines || [""],
            city: address.city || "",
            link: address.link || "",
            phoneNumbers: address.phoneNumbers?.map(phone => ({
              number: phone.number || "",
              countryCode: phone.countryCode || "+91",
              hasWhatsapp: phone.hasWhatsapp || false
            })) || [],
            emails: address.emails || [],
          })) || [defaultAddress],
        }
      : {
          name: "",
          brief: "",
          description: "",
          profilePhoto: "",
          categories: [],
          addresses: [defaultAddress],
        },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const businesses = await businessService.getAll();
        
        const categories = new Set(businesses.flatMap(b => b.categories));
        const cities = new Set(businesses.flatMap(b => b.addresses.map(a => a.city)));

        setExistingData({
          categories: Array.from(categories).sort(),
          cities: Array.from(cities).sort(),
        });
      } catch (error) {
        console.error("Failed to fetch existing data:", error);
      }
    };

    fetchExistingData();
  }, []);

  const onSubmit = async (values: FormSchema) => {
    if (!user) {
      toast.error("You must be logged in to perform this action");
      return;
    }

    setIsSubmitting(true);
    try {
      const currentUsername = user.email?.split("@")[0] || "anonymous";
      const businessData = {
        ...values,
        user_id: user.uid,
        createdBy: isEditing ? initialData?.createdBy : currentUsername,
        updatedBy: currentUsername,
      };

      if (isEditing && initialData?.id) {
        await businessService.update(initialData.id, businessData);
        toast.success("Business updated successfully!");
      } else {
        await businessService.create(businessData);
        toast.success("Business added successfully!");
      }
      router.push("/admin");
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update business" : "Failed to add business"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("image")) {
      toast.error("Please upload an image file");
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const { url } = await response.json();
      form.setValue("profilePhoto", url);
      toast.success("Photo uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const debouncedPhoneUpdate = useCallback(
    createDebounce((addressIndex: number, phoneIndex: number, value: string, field: any) => {
      const newAddresses = [...field.value];
      newAddresses[addressIndex].phoneNumbers[phoneIndex].number = value;
      field.onChange(newAddresses);
    }, 300),
    []
  );

  const debouncedEmailUpdate = useCallback(
    createDebounce((addressIndex: number, emailIndex: number, value: string, field: any) => {
      const newAddresses = [...field.value];
      newAddresses[addressIndex].emails[emailIndex] = value;
      field.onChange(newAddresses);
    }, 300),
    []
  );

  return (
    <Card className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg border-0">
      <CardContent className="p-8">

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-900">
                      Business Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter business name"
                        {...field}
                        className="h-12 text-lg border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="brief"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Brief Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a concise business description"
                      {...field}
                      className="h-10 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Full Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed business description"
                      {...field}
                      rows={4}
                      className="resize-none border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profilePhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Profile Photo (Optional)
                  </FormLabel>
                  <div className="space-y-4">
                    {field.value && (
                      <Image
                        src={field.value}
                        alt="Profile preview"
                        width={160}
                        height={160}
                        className="object-cover rounded-lg"
                      />
                    )}
                    <div className="flex gap-4">
                      <FormControl>
                        <Input
                          placeholder="https://example.com/photo.jpg"
                          {...field}
                          value={field.value || ""}
                          type="url"
                          className="h-10 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                        />
                      </FormControl>
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploadingPhoto}
                          className="h-10 border-slate-200 hover:bg-slate-100"
                        >
                          {uploadingPhoto ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          <span className="ml-2">Upload</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-900">Categories</FormLabel>
                  <FormControl>
                    <CreatableSelect
                      isMulti
                      options={existingData.categories.map((category) => ({
                        value: category,
                        label: category,
                      }))}
                      value={field.value.map((category) => ({
                        value: category,
                        label: category,
                      }))}
                      onChange={(newValue) => {
                        field.onChange(newValue.map((item) => item.value));
                      }}
                      className="border-slate-200"
                      classNamePrefix="react-select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addresses"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Addresses</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value.map((address, addressIndex) => (
                        <Card key={addressIndex} className="bg-slate-50/50 border border-slate-200">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-6">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Location {addressIndex + 1}
                              </h3>
                              {addressIndex > 0 && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={() => {
                                    const newAddresses = field.value.filter((_, i) => i !== addressIndex);
                                    field.onChange(newAddresses);
                                  }}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove Location
                                </Button>
                              )}
                            </div>
                            
                            <div className="space-y-6">
                              <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Address Lines</h4>
                                <div className="space-y-2">
                                  {address.lines.map((_, lineIndex) => (
                                    <FormField
                                      key={lineIndex}
                                      control={form.control}
                                      name={`addresses.${addressIndex}.lines.${lineIndex}`}
                                      render={({ field: lineField }) => (
                                        <FormItem>
                                          <FormControl>
                                            <div className="flex gap-3">
                                              <Input
                                                {...lineField}
                                                placeholder={`Address line ${lineIndex + 1}`}
                                                className="flex-1"
                                              />
                                              {lineIndex > 0 && (
                                                <Button
                                                  type="button"
                                                  variant="destructive"
                                                  onClick={() => {
                                                    const newAddresses = [...field.value];
                                                    newAddresses[addressIndex].lines = newAddresses[addressIndex].lines.filter(
                                                      (_, i) => i !== lineIndex
                                                    );
                                                    field.onChange(newAddresses);
                                                  }}
                                                  className="px-3 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              )}
                                            </div>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                      const newAddresses = [...field.value];
                                      newAddresses[addressIndex].lines.push("");
                                      field.onChange(newAddresses);
                                    }}
                                    className="w-full border-dashed"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Line
                                  </Button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg border border-slate-200">
                                  <h4 className="text-sm font-medium text-gray-700 mb-3">City</h4>
                                  <FormField
                                    control={form.control}
                                    name={`addresses.${addressIndex}.city`}
                                    render={({ field: cityField }) => (
                                      <FormItem>
                                        <FormControl>
                                          <CreatableSelect
                                            {...cityField}
                                            options={existingData.cities.map((city) => ({
                                              value: city,
                                              label: city,
                                            }))}
                                            onChange={(newValue) => {
                                              cityField.onChange(newValue?.value || "");
                                            }}
                                            value={
                                              cityField.value
                                                ? { value: cityField.value, label: cityField.value }
                                                : null
                                            }
                                            placeholder="Select or enter city"
                                            className="border-slate-200"
                                            classNamePrefix="react-select"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-slate-200">
                                  <h4 className="text-sm font-medium text-gray-700 mb-3">Link</h4>
                                  <Input
                                    placeholder="Google Link"
                                    value={address.link || ""}
                                    onChange={(e) => {
                                      const newAddresses = [...field.value];
                                      newAddresses[addressIndex].link = e.target.value;
                                      field.onChange(newAddresses);
                                    }}
                                    className="border-slate-200"
                                  />
                                </div>
                              </div>

                              <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Phone Numbers</h4>
                                <div className="space-y-3">
                                  {address.phoneNumbers.map((phone, phoneIndex) => (
                                    <div key={phoneIndex} className="flex flex-col md:flex-row gap-3">
                                      <Select
                                        value={phone.countryCode}
                                        onValueChange={(value) => {
                                          const newAddresses = [...field.value];
                                          newAddresses[addressIndex].phoneNumbers[phoneIndex].countryCode = value;
                                          field.onChange(newAddresses);
                                        }}
                                      >
                                        <SelectTrigger className="w-[120px]">
                                          <SelectValue placeholder="Code" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {filteredCountries.map((country) => (
                                            <SelectItem key={country.flag} value={country.code}>
                                              <div className="flex items-center gap-2">
                                                {country.flag} {country.code}
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <Input
                                        placeholder="Enter 10-digit phone number"
                                        defaultValue={phone.number}
                                        onChange={(e) => {
                                          debouncedPhoneUpdate(addressIndex, phoneIndex, e.target.value, field);
                                        }}
                                        className="flex-1 border-slate-200"
                                        maxLength={10}
                                      />
                                      <div className="flex items-center gap-2 w-[140px]">
                                        <Switch
                                          checked={phone.hasWhatsapp}
                                          onCheckedChange={(checked) => {
                                            const newAddresses = [...field.value];
                                            newAddresses[addressIndex].phoneNumbers[phoneIndex].hasWhatsapp = checked;
                                            field.onChange(newAddresses);
                                          }}
                                          className="data-[state=checked]:bg-green-400 data-[state=checked]:hover:bg-green-500"
                                        />
                                        <label className="text-sm text-gray-600">WhatsApp?</label>
                                      </div>
                                      {phoneIndex > 0 && (
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          onClick={() => {
                                            const newAddresses = [...field.value];
                                            newAddresses[addressIndex].phoneNumbers = newAddresses[addressIndex].phoneNumbers.filter(
                                              (_, i) => i !== phoneIndex
                                            );
                                            field.onChange(newAddresses);
                                          }}
                                          className="px-3 bg-red-600 hover:bg-red-700"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                      const newAddresses = [...field.value];
                                      newAddresses[addressIndex].phoneNumbers.push({
                                        number: "",
                                        countryCode: "+91",
                                        hasWhatsapp: false,
                                      });
                                      field.onChange(newAddresses);
                                    }}
                                    className="w-full border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Phone Number
                                  </Button>
                                </div>
                              </div>

                              <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Email Addresses</h4>
                                <div className="space-y-3">
                                  {address.emails.map((email, emailIndex) => (
                                    <div key={emailIndex} className="flex gap-3">
                                      <Input
                                        type="email"
                                        placeholder="Enter email address"
                                        defaultValue={email}
                                        onChange={(e) => {
                                          debouncedEmailUpdate(addressIndex, emailIndex, e.target.value, field);
                                        }}
                                        className="flex-1 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                      />
                                      {emailIndex > 0 && (
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          onClick={() => {
                                            const newAddresses = [...field.value];
                                            newAddresses[addressIndex].emails = newAddresses[addressIndex].emails.filter(
                                              (_, i) => i !== emailIndex
                                            );
                                            field.onChange(newAddresses);
                                          }}
                                          className="px-3 bg-red-600 hover:bg-red-700"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                      const newAddresses = [...field.value];
                                      newAddresses[addressIndex].emails.push("");
                                      field.onChange(newAddresses);
                                    }}
                                    className="w-full border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Email Address
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          field.onChange([...field.value, defaultAddress]);
                        }}
                        className="w-full mt-4 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 py-6"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Another Location
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-8 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[200px] bg-indigo-600 hover:bg-indigo-700 text-white transition-colors py-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Business" : "Create Business"}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
