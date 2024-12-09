"use client";

import { Business } from "@/types/business";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";

interface BusinessDetailsProps {
  business: Business;
}

export function BusinessDetails({ business }: BusinessDetailsProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to directory
      </Button>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-col md:flex-row gap-6 items-center">
          <Avatar className="w-32 h-32 ring-2 ring-offset-2 ring-gray-200">
            {business.profilePhoto ? (
              <AvatarImage
                src={business.profilePhoto}
                alt={business.name}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="text-xl">
                {getInitials(business.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-4 text-center md:text-left">
            <div>
              <h1 className="text-4xl font-bold mb-3 text-primary">
                {business.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground justify-center md:justify-start">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{business.city}</span>
              </div>
              <p className="text-muted-foreground mt-3 text-lg">
                {business.brief}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {business.categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="px-3 py-1 text-sm hover:bg-secondary/80 transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 px-6 py-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-primary">About</h2>
            <p className="text-muted-foreground leading-relaxed">
              {business.description}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Contact Information
            </h2>
            <div className="space-y-3">
              {business.contacts.phones.map((phone, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <Phone className="h-5 w-5 text-primary" />
                  <a
                    href={`tel:${phone.number}`}
                    className="hover:text-primary hover:underline transition-colors text-lg"
                  >
                    {phone.number}
                  </a>
                  {phone.hasWhatsapp && (
                    <a
                      href={`https://wa.me/${phone.number.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-600 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  )}
                </div>
              ))}
              {business.contacts.emails.map((email, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <Mail className="h-5 w-5 text-primary" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-primary hover:underline transition-colors text-lg"
                  >
                    {email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
