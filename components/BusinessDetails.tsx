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
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getInitials, truncateText, generateWhatsAppLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { toast } from "sonner";
import { useState } from "react";

interface BusinessDetailsProps {
  business: Business;
}

const formatTime = (time: string) => {
  const [hour, minute] = time.split(':');
  const hourNum = parseInt(hour);
  const period = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minute} ${period}`;
};

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
type DayOfWeek = typeof days[number];

export function BusinessDetails({ business }: BusinessDetailsProps) {
  const router = useRouter();
  const profileCardUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || ""
  }/profilecard/${business.id}`;

  const [showFullBrief, setShowFullBrief] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: business.name,
          text: business.brief,
          url: profileCardUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileCardUrl);
        toast.success("Profile card link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
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
              <p className="text-muted-foreground mt-3 text-lg break-words">
                {showFullBrief ? business.brief : truncateText(business.brief, 51)}
                {business.brief.length > 51 && (
                  <button
                    onClick={() => setShowFullBrief(!showFullBrief)}
                    className="ml-2 text-primary hover:text-primary/80 font-medium"
                  >
                    {showFullBrief ? "Show Less" : "Show More"}
                  </button>
                )}
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
              Locations & Contact Information
            </h2>
            <div className="space-y-6">
              {business.addresses.map((address, addressIndex) => (
                <Card key={addressIndex} className="bg-slate-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{address.city}</h3>
                    </div>

                    <div className="space-y-1 mb-4 text-muted-foreground">
                      {address.lines.map((line, lineIndex) => (
                        <p key={lineIndex}>{line}</p>
                      ))}
                    </div>

                    {address.link && (
                      <a
                        href={address.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
                      >
                        <MapPin className="h-4 w-4" />
                        <span className="underline">View on Google Maps</span>
                      </a>
                    )}

                    <div className="space-y-3 mt-4 border-t pt-4">
                      {address.phoneNumbers.map((phone, phoneIndex) => (
                        <div key={phoneIndex} className="flex items-center gap-3 group">
                          <Phone className="h-5 w-5 text-primary shrink-0" />
                          <a
                            href={`tel:${phone.countryCode}${phone.number}`}
                            className="hover:text-primary hover:underline transition-colors text-lg"
                          >
                            {phone.countryCode} {phone.number}
                          </a>
                          {phone.hasWhatsapp && (
                            <a
                              href={generateWhatsAppLink(phone.countryCode, phone.number)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-500 hover:text-green-600 transition-colors"
                            >
                              <WhatsAppIcon className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      ))}

                      {address.emails.map((email, emailIndex) => (
                        <div key={emailIndex} className="flex items-center gap-3 group">
                          <Mail className="h-5 w-5 text-primary shrink-0" />
                          <a
                            href={`mailto:${email}`}
                            className="hover:text-primary hover:underline transition-colors text-lg break-all"
                          >
                            {email}
                          </a>
                        </div>
                      ))}

                      {address.availabilities?.enabled && (
                        <div className="space-y-3 mt-4 border-t pt-4">
                          <div className="flex items-center gap-2 text-primary mb-4">
                            <Clock className="h-5 w-5" />
                            <h3 className="font-semibold text-lg">Business Hours</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            {days.map((day) => {
                              const schedule = address.availabilities?.schedule?.[day as DayOfWeek];
                              if (!schedule?.isOpen) return null;

                              return (
                                <div key={day} className="flex items-start py-2 border-b last:border-b-0 md:even:border-b">
                                  <div className="w-24 capitalize font-medium text-gray-900">
                                    {day}
                                  </div>
                                  <div className="flex-1">
                                    {schedule.timeSlots.map((slot, index) => (
                                      <div key={index} className="text-muted-foreground">
                                        {formatTime(slot.openTime)} - {formatTime(slot.closeTime)}
                                        {index < schedule.timeSlots.length - 1 && (
                                          <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full mx-2 inline-block" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-gray-900">Closed on: </span>
                              {days
                                .filter(day => !address.availabilities?.schedule?.[day as DayOfWeek]?.isOpen)
                                .map((day, index, array) => (
                                  <span key={day}>
                                    <span className="capitalize">{day}</span>
                                    {index < array.length - 1 && ', '}
                                  </span>
                                ))}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
