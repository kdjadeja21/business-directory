"use client";

import { Business } from "@/types/business";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getInitials, truncateText, generateWhatsAppLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { toast } from "sonner";

interface BusinessDetailsProps {
  business: Business;
}

export function BusinessDetails({ business }: BusinessDetailsProps) {
  const router = useRouter();
  const profileCardUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || ""
  }/profilecard/${business.id}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title: business.name,
          text: business.brief,
          url: profileCardUrl,
        });
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(profileCardUrl);
        toast.success("Profile card link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share profile card");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to directory
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push(`/profilecard/${business.id}`)}
          >
            <CreditCard className="h-4 w-4" />
            <span>View Card</span>
          </Button>

          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
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
              <p className="text-muted-foreground mt-3 text-lg break-words overflow-hidden text-ellipsis whitespace-normal max-w-full">
                {truncateText(business.brief, 51)}
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
        <CardContent className="space-y-8 px-6 py-8 overflow-hidden">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-primary">About</h2>
            <p className="text-muted-foreground leading-relaxed break-words overflow-hidden text-ellipsis whitespace-normal max-w-full">
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
                    href={`tel:${phone.countryCode}${phone.number}`}
                    className="hover:text-primary hover:underline transition-colors text-lg"
                  >
                    {phone.number}
                  </a>
                  {phone.hasWhatsapp && (
                    <a
                      href={generateWhatsAppLink(
                        phone.countryCode || "+91",
                        phone.number
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-600 transition-colors"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
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
