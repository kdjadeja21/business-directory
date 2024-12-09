"use client";

import { useState } from "react";
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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  brief: z.string().min(10, "Brief description must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  profilePhoto: z
    .string()
    .url("Must be a valid URL")
    .or(z.string().length(0))
    .optional(),
  city: z.string().min(1, "City is required"),
  categories: z.array(z.string()).min(1, "Category is required"),
  contacts: z.object({
    phones: z.array(
      z.object({
        number: z
          .string()
          .max(10, "Phone number cannot exceed 10 digits")
          .min(10, "Phone number must be 10 digits"),
        hasWhatsapp: z.boolean().default(false),
      })
    ),
    emails: z.array(z.string().email("Must be a valid email")),
  }),
});

interface BusinessFormProps {
  initialData?: Business;
  isEditing?: boolean;
}

export function BusinessForm({ initialData, isEditing }: BusinessFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          profilePhoto: initialData.profilePhoto || "",
          categories: initialData.categories || [],
        }
      : {
          name: "",
          brief: "",
          description: "",
          profilePhoto: "",
          categories: [],
          city: "",
          contacts: {
            phones: [{ number: "", hasWhatsapp: false }],
            emails: [""],
          },
        },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

  return (
    <Card className="max-w-4xl mx-auto bg-slate-50 shadow-xl rounded-lg">
      {/* <CardHeader className="border-b bg-gray-50/50 px-6 py-4">
        <CardTitle className="text-2xl font-semibold text-gray-800">
          {isEditing ? "Edit Business Profile" : "Create New Business"}
        </CardTitle>
      </CardHeader> */}
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Business Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter business name"
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
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      City
                    </FormLabel>
                    <FormControl>
                      <CreatableSelect
                        options={CITIES.map((city) => ({
                          value: city,
                          label: city,
                        }))}
                        value={
                          field.value
                            ? {
                                value: field.value,
                                label: field.value,
                              }
                            : null
                        }
                        onChange={(newValue) => {
                          field.onChange(newValue?.value || "");
                        }}
                        className="border-slate-200"
                        classNamePrefix="react-select"
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
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <CreatableSelect
                      isMulti
                      options={CATEGORIES.map((category) => ({
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

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="contacts.phones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-500" />
                        Phone Numbers
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {field.value.map((phone, index) => (
                          <div key={index} className="flex gap-3 items-center">
                            <Input
                              placeholder="Enter 10-digit phone number"
                              value={phone.number}
                              onChange={(e) => {
                                const newPhones = [...field.value];
                                newPhones[index] = {
                                  ...newPhones[index],
                                  number: e.target.value,
                                };
                                field.onChange(newPhones);
                              }}
                              className="flex-1 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                              maxLength={10}
                            />
                            <div className="flex items-center gap-2 min-w-[140px]">
                              <Switch
                                id={`whatsapp-${index}`}
                                checked={phone.hasWhatsapp}
                                onCheckedChange={(checked) => {
                                  const newPhones = [...field.value];
                                  newPhones[index] = {
                                    ...newPhones[index],
                                    hasWhatsapp: checked,
                                  };
                                  field.onChange(newPhones);
                                }}
                                className="data-[state=checked]:bg-green-400 data-[state=checked]:hover:bg-green-500"
                              />
                              <label
                                htmlFor={`whatsapp-${index}`}
                                className="text-sm text-gray-600"
                              >
                                Has WhatsApp?
                              </label>
                            </div>
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                  const newPhones = field.value.filter(
                                    (_, i) => i !== index
                                  );
                                  field.onChange(newPhones);
                                }}
                                className="px-3 bg-red-600 hover:bg-red-700 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            field.onChange([
                              ...field.value,
                              { number: "", hasWhatsapp: false },
                            ])
                          }
                          className="w-full border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Phone Number
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contacts.emails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-500" />
                        Email Addresses
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {field.value.map((_, index) => (
                          <div key={index} className="flex gap-3">
                            <Input
                              placeholder="Enter email address"
                              type="email"
                              value={field.value[index]}
                              onChange={(e) => {
                                const newEmails = [...field.value];
                                newEmails[index] = e.target.value;
                                field.onChange(newEmails);
                              }}
                              className="flex-1 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                  const newEmails = field.value.filter(
                                    (_, i) => i !== index
                                  );
                                  field.onChange(newEmails);
                                }}
                                className="px-3 bg-red-600 hover:bg-red-700 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => field.onChange([...field.value, ""])}
                          className="w-full border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Email Address
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-6 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[150px] bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
