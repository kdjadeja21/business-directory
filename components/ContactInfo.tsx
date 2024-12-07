"use client";

import { Phone, Mail } from "lucide-react";

interface ContactInfoProps {
  contacts: {
    phones: string[];
    emails: string[];
  };
}

export function ContactInfo({ contacts }: ContactInfoProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Phone Numbers</h3>
          {contacts.phones.map((phone) => (
            <div key={phone} className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4" />
              <a
                href={`tel:${phone}`}
                className="text-primary hover:underline"
              >
                {phone}
              </a>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Email Addresses</h3>
          {contacts.emails.map((email) => (
            <div key={email} className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4" />
              <a
                href={`mailto:${email}`}
                className="text-primary hover:underline"
              >
                {email}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}