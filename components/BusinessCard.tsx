"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin } from "lucide-react";
import { Business } from "@/types/business";
import Link from "next/link";
import { getInitials } from "@/lib/utils";

interface BusinessCardProps {
  business: Business;
  index: number;
}

export function BusinessCard({ business, index }: BusinessCardProps) {
  const firstAddress = business.addresses[0];
  const primaryPhone = firstAddress?.phoneNumbers?.[0];
  const primaryEmail = firstAddress?.emails?.[0];
  const briefDescription = business.brief || "No description available";
  const truncatedDescription =
    briefDescription.length > 21
      ? `${briefDescription.slice(0, 21)}...`
      : briefDescription;

  return (
    <Link href={`/business/${business.id}`}>
      <Card
        className={`
          hover:shadow-lg 
          transition-all 
          duration-300 
          hover:-translate-y-1 
          hover:scale-[1.02]
          active:scale-95
          cursor-pointer
          animate-fadeIn
        `}
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={business.profilePhoto || undefined} />
            <AvatarFallback>{getInitials(business.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-2xl font-bold">{business.name}</h3>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{firstAddress?.city || "N/A"}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {business.categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="transition-all duration-300 hover:scale-105"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{truncatedDescription}</p>
          <div className="space-y-2">
            {primaryPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{primaryPhone.countryCode} {primaryPhone.number}</span>
              </div>
            )}
            {primaryEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{primaryEmail}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
