"use client";

import { useState, useEffect } from "react";
import { Business } from "@/types/business";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, truncateText } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Rotate3D } from "lucide-react";

interface ProfileCardProps {
  business: Business;
}

export function ProfileCard({ business }: ProfileCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false); // New state to track if the card has flipped once
  const router = useRouter();
  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/profilecard/${
    business.id
  }`;

  useEffect(() => {
    if (!hasFlipped) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
        setHasFlipped(true); // Set to true after the first flip
      }, 1500);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [hasFlipped]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative w-full max-w-md">
        <div
          className="flip-card w-full h-[400px] cursor-pointer group"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ perspective: "1000px" }}
        >
          <div
            className={`flip-card-inner relative w-full h-full transition-transform duration-500 transform-gpu ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front */}
            <div
              className="flip-card-front absolute w-full h-full backface-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              <Card className="p-8 h-full flex flex-col items-center justify-center space-y-6 hover:shadow-lg transition-shadow relative">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Rotate3D className="h-5 w-5 text-muted-foreground animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-4">
                  Scan to Visit Profile
                </h2>
                <QRCodeSVG
                  value={profileUrl}
                  size={200}
                  level="H"
                  includeMargin
                  className="rounded-lg shadow-lg"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Tap card to see business details
                </p>
              </Card>
            </div>

            {/* Back */}
            <div
              className="flip-card-back absolute w-full h-full backface-hidden rotate-y-180"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <Card className="p-8 h-full flex flex-col items-center justify-between hover:shadow-lg transition-shadow relative">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Rotate3D className="h-5 w-5 text-muted-foreground animate-pulse" />
                </div>
                <div className="space-y-6 text-center">
                  <Avatar className="w-24 h-24 ring-2 ring-offset-2 ring-primary/10 mx-auto">
                    <AvatarImage src={business.profilePhoto || undefined} />
                    <AvatarFallback className="text-xl">
                      {getInitials(business.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{business.name}</h2>
                    <p className="text-muted-foreground">
                      {truncateText(business.brief, 51)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {business.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="text-sm"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tap card to see QR code
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Button
        className="mt-8 px-8 shadow-lg hover:shadow-xl transition-all"
        onClick={() => router.push(`/business/${business.id}`)}
      >
        Visit Full Profile
      </Button>
    </div>
  );
}
