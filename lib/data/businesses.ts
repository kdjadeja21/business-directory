import { Business } from "@/types/business";

export const dummyBusinesses: Business[] = [
  {
    id: "1",
    name: "Tech Solutions Inc",
    brief: "Leading provider of innovative tech solutions",
    description:
      "Comprehensive technology solutions for businesses of all sizes",
    profilePhoto:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    categories: ["Technology", "Consulting", "Software"],
    addresses: [
      {
        lines: ["123 Tech Street", "Floor 5"],
        city: "San Francisco",
        link: "https://goo.gl/maps/tech123",
        phoneNumbers: [
          { number: "5551234567", countryCode: "+1", hasWhatsapp: true },
          { number: "5551234568", countryCode: "+1", hasWhatsapp: false },
          { number: "5551234569", countryCode: "+1", hasWhatsapp: false }
        ],
        emails: [
          "contact@techsolutions.com",
          "support@techsolutions.com", 
          "sales@techsolutions.com"
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "1",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "2", 
    name: "Green Earth Landscaping",
    brief: "Professional landscaping and garden maintenance",
    description: "Creating beautiful outdoor spaces for homes and businesses",
    profilePhoto:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae",
    categories: ["Landscaping", "Garden", "Maintenance"],
    addresses: [
      {
        lines: ["456 Garden Way"],
        city: "Portland",
        link: "https://goo.gl/maps/garden456",
        phoneNumbers: [
          { number: "5559876543", countryCode: "+1", hasWhatsapp: true },
          { number: "5559876544", countryCode: "+1", hasWhatsapp: false }
        ],
        emails: ["info@greenearth.com", "projects@greenearth.com"]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "2",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "3",
    name: "Culinary Delights",
    brief: "Gourmet catering and fine dining experiences",
    description:
      "Exceptional catering services for all occasions with a focus on local ingredients",
    profilePhoto:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f",
    categories: ["Food & Beverage", "Catering", "Events"],
    addresses: [
      {
        lines: ["789 Food Court", "Suite 101"],
        city: "New York",
        link: "https://goo.gl/maps/food789",
        phoneNumbers: [
          { number: "5552345678", countryCode: "+1", hasWhatsapp: true },
          { number: "5552345679", countryCode: "+1", hasWhatsapp: false }
        ],
        emails: [
          "events@culinarydelights.com",
          "bookings@culinarydelights.com",
          "info@culinarydelights.com"
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "3",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "4",
    name: "Creative Design Studio",
    brief: "Innovative graphic design and branding solutions",
    description:
      "Full-service design studio specializing in brand identity and digital media",
    profilePhoto: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    categories: ["Design", "Branding", "Marketing"],
    addresses: [
      {
        lines: ["321 Design Boulevard"],
        city: "Los Angeles", 
        link: "https://goo.gl/maps/design321",
        phoneNumbers: [
          { number: "5553456789", countryCode: "+1", hasWhatsapp: true },
          { number: "5553456780", countryCode: "+1", hasWhatsapp: false }
        ],
        emails: ["create@designstudio.com", "projects@designstudio.com"]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "4",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "5",
    name: "Wellness Center",
    brief: "Holistic health and wellness services",
    description:
      "Comprehensive wellness programs including yoga, meditation, and nutrition counseling",
    profilePhoto: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
    categories: ["Health", "Wellness", "Fitness"],
    addresses: [
      {
        lines: ["555 Wellness Way", "Building A"],
        city: "Seattle",
        link: "https://goo.gl/maps/wellness555",
        phoneNumbers: [
          { number: "5554567890", countryCode: "+1", hasWhatsapp: true },
          { number: "5554567891", countryCode: "+1", hasWhatsapp: false },
          { number: "5554567892", countryCode: "+1", hasWhatsapp: false }
        ],
        emails: [
          "info@wellnesscenter.com",
          "appointments@wellnesscenter.com",
          "classes@wellnesscenter.com"
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "5",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "6",
    name: "Financial Advisors Group",
    brief: "Expert financial planning and investment services",
    description:
      "Personalized financial solutions for individuals and businesses",
    profilePhoto:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    categories: ["Finance", "Investment", "Planning"],
    addresses: [
      {
        lines: ["777 Finance Street", "20th Floor"],
        city: "Chicago",
        link: "https://goo.gl/maps/finance777",
        phoneNumbers: [
          { number: "5555678901", countryCode: "+1", hasWhatsapp: true },
          { number: "5555678902", countryCode: "+1", hasWhatsapp: false }
        ],
        emails: ["plan@financialadvisors.com", "invest@financialadvisors.com"]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "6",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "7",
    name: "Urban Construction Co",
    brief: "Modern construction and renovation services",
    description:
      "Commercial and residential construction with a focus on sustainability",
    profilePhoto: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    categories: ["Construction", "Development", "Architecture"],
    addresses: [
      {
        lines: ["888 Builder Avenue"],
        city: "Boston",
        link: "https://goo.gl/maps/builder888",
        phoneNumbers: [
          { number: "5556789012", countryCode: "+1", hasWhatsapp: true },
          { number: "5556789013", countryCode: "+1", hasWhatsapp: false },
          { number: "5556789014", countryCode: "+1", hasWhatsapp: false }
        ],
        emails: [
          "build@urbanconstruction.com",
          "projects@urbanconstruction.com",
          "quotes@urbanconstruction.com"
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "7",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "8",
    name: "Digital Marketing Pro",
    brief: "Results-driven digital marketing strategies",
    description:
      "Comprehensive digital marketing solutions for modern businesses",
    profilePhoto:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    categories: ["Marketing", "Digital", "SEO"],
    addresses: [
      {
        lines: ["999 Digital Drive"],
        city: "Austin",
        link: "https://goo.gl/maps/digital999",
        phoneNumbers: [
          { number: "5557890123", countryCode: "+1", hasWhatsapp: true },
          { number: "5557890124", countryCode: "+1", hasWhatsapp: false }
        ],
        emails: ["grow@digitalmarketingpro.com", "seo@digitalmarketingpro.com"]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "8",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "9",
    name: "Pet Care Plus",
    brief: "Professional pet care and grooming services",
    description:
      "Complete pet care solutions including grooming, boarding, and training",
    profilePhoto:
      "https://images.unsplash.com/photo-1516734212186-65266f46771f",
    categories: ["Pet Care", "Grooming", "Veterinary"],
    addresses: [
      {
        lines: ["444 Pet Place"],
        city: "Denver",
        link: "https://goo.gl/maps/pet444",
        phoneNumbers: [
          { number: "5558901234", countryCode: "+1", hasWhatsapp: true },
          { number: "5558901235", countryCode: "+1", hasWhatsapp: false }
        ],
        emails: [
          "care@petcareplus.com",
          "appointments@petcareplus.com",
          "emergency@petcareplus.com"
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "9",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "10",
    name: "Legal Solutions",
    brief: "Comprehensive legal services for businesses",
    description: "Expert legal counsel for corporate and business law matters",
    profilePhoto:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
    categories: ["Legal", "Corporate", "Consulting"],
    addresses: [
      {
        lines: ["222 Law Circle", "Suite 1500"],
        city: "Miami",
        link: "https://goo.gl/maps/law222",
        phoneNumbers: [
          { number: "5559012345", countryCode: "+1", hasWhatsapp: true },
          { number: "5559012346", countryCode: "+1", hasWhatsapp: false },
          { number: "5559012347", countryCode: "+1", hasWhatsapp: false }
        ],
        emails: [
          "contact@legalsolutions.com",
          "cases@legalsolutions.com",
          "consult@legalsolutions.com"
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "10",
    createdBy: "admin",
    updatedBy: "admin"
  }
];
