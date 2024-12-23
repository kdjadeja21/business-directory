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
    city: "San Francisco",
    contacts: {
      phones: [
        { number: "+1 (555) 123-4567", hasWhatsapp: true },
        { number: "+1 (555) 123-4568", hasWhatsapp: false },
        { number: "+1 (555) 123-4569", hasWhatsapp: false },
      ],
      emails: [
        "contact@techsolutions.com",
        "support@techsolutions.com",
        "sales@techsolutions.com",
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "1",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "2",
    name: "Green Earth Landscaping",
    brief: "Professional landscaping and garden maintenance",
    description: "Creating beautiful outdoor spaces for homes and businesses",
    profilePhoto:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae",
    categories: ["Landscaping", "Garden", "Maintenance"],
    city: "Portland",
    contacts: {
      phones: [
        { number: "+1 (555) 987-6543", hasWhatsapp: true },
        { number: "+1 (555) 987-6544", hasWhatsapp: false },
      ],
      emails: ["info@greenearth.com", "projects@greenearth.com"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "2",
    createdBy: "admin",
    updatedBy: "admin",
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
    city: "New York",
    contacts: {
      phones: [
        { number: "+1 (555) 234-5678", hasWhatsapp: true },
        { number: "+1 (555) 234-5679", hasWhatsapp: false },
      ],
      emails: [
        "events@culinarydelights.com",
        "bookings@culinarydelights.com",
        "info@culinarydelights.com",
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "3",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "4",
    name: "Creative Design Studio",
    brief: "Innovative graphic design and branding solutions",
    description:
      "Full-service design studio specializing in brand identity and digital media",
    profilePhoto: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    categories: ["Design", "Branding", "Marketing"],
    city: "Los Angeles",
    contacts: {
      phones: [
        { number: "+1 (555) 345-6789", hasWhatsapp: true },
        { number: "+1 (555) 345-6780", hasWhatsapp: false },
      ],
      emails: ["create@designstudio.com", "projects@designstudio.com"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "4",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "5",
    name: "Wellness Center",
    brief: "Holistic health and wellness services",
    description:
      "Comprehensive wellness programs including yoga, meditation, and nutrition counseling",
    profilePhoto: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
    categories: ["Health", "Wellness", "Fitness"],
    city: "Seattle",
    contacts: {
      phones: [
        { number: "+1 (555) 456-7890", hasWhatsapp: true },
        { number: "+1 (555) 456-7891", hasWhatsapp: false },
        { number: "+1 (555) 456-7892", hasWhatsapp: false },
      ],
      emails: [
        "info@wellnesscenter.com",
        "appointments@wellnesscenter.com",
        "classes@wellnesscenter.com",
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "5",
    createdBy: "admin",
    updatedBy: "admin",
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
    city: "Chicago",
    contacts: {
      phones: [
        { number: "+1 (555) 567-8901", hasWhatsapp: true },
        { number: "+1 (555) 567-8902", hasWhatsapp: false },
      ],
      emails: ["plan@financialadvisors.com", "invest@financialadvisors.com"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "6",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "7",
    name: "Urban Construction Co",
    brief: "Modern construction and renovation services",
    description:
      "Commercial and residential construction with a focus on sustainability",
    profilePhoto: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    categories: ["Construction", "Development", "Architecture"],
    city: "Boston",
    contacts: {
      phones: [
        { number: "+1 (555) 678-9012", hasWhatsapp: true },
        { number: "+1 (555) 678-9013", hasWhatsapp: false },
        { number: "+1 (555) 678-9014", hasWhatsapp: false },
      ],
      emails: [
        "build@urbanconstruction.com",
        "projects@urbanconstruction.com",
        "quotes@urbanconstruction.com",
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "7",
    createdBy: "admin",
    updatedBy: "admin",
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
    city: "Austin",
    contacts: {
      phones: [
        { number: "+1 (555) 789-0123", hasWhatsapp: true },
        { number: "+1 (555) 789-0124", hasWhatsapp: false },
      ],
      emails: ["grow@digitalmarketingpro.com", "seo@digitalmarketingpro.com"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "8",
    createdBy: "admin",
    updatedBy: "admin",
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
    city: "Denver",
    contacts: {
      phones: [
        { number: "+1 (555) 890-1234", hasWhatsapp: true },
        { number: "+1 (555) 890-1235", hasWhatsapp: false },
      ],
      emails: [
        "care@petcareplus.com",
        "appointments@petcareplus.com",
        "emergency@petcareplus.com",
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "9",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: "10",
    name: "Legal Solutions",
    brief: "Comprehensive legal services for businesses",
    description: "Expert legal counsel for corporate and business law matters",
    profilePhoto:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
    categories: ["Legal", "Corporate", "Consulting"],
    city: "Miami",
    contacts: {
      phones: [
        { number: "+1 (555) 901-2345", hasWhatsapp: true },
        { number: "+1 (555) 901-2346", hasWhatsapp: false },
        { number: "+1 (555) 901-2347", hasWhatsapp: false },
      ],
      emails: [
        "contact@legalsolutions.com",
        "cases@legalsolutions.com",
        "consult@legalsolutions.com",
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: "10",
    createdBy: "admin",
    updatedBy: "admin",
  },
];
