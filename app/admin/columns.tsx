"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Business } from "@/types/business";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, MoreHorizontal, Phone, Mail } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Create a custom component for the actions cell
function ActionCell({ row }: { row: any }) {
  const router = useRouter();
  const business = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/edit/${business.id}`)}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Business
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 cursor-pointer focus:text-red-600"
          onClick={() => {
            const event = new CustomEvent('deleteBusiness', { detail: business.id });
            window.dispatchEvent(event);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Business
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Business>[] = [
  {
    accessorKey: "name",
    header: "Business",
    cell: ({ row }) => {
      const business = row.original;
      const briefDescription = business.brief || "No description available";
      const truncatedDescription =
        briefDescription.length > 21
          ? `${briefDescription.slice(0, 21)}...`
          : briefDescription;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-gray-100">
            {business.profilePhoto ? (
              <AvatarImage
                src={business.profilePhoto}
                alt={business.name}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(business.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {business.name}
            </span>
            <span className="text-sm text-muted-foreground truncate">
              {truncatedDescription}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-medium">
        {row.getValue("city")}
      </Badge>
    ),
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => {
      const categories = (row.getValue("categories") as string[]) || [];
      const displayCategories = categories.slice(0, 2);
      const remainingCount = categories.length - 2;

      return (
        <div className="flex flex-wrap gap-1.5">
          {displayCategories.map((category) => (
            <Badge key={category} variant="secondary" className="font-medium">
              {category}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <Badge variant="outline" className="font-medium">
              +{remainingCount} more
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "contacts",
    header: "Contact",
    cell: ({ row }) => {
      const contacts = row.getValue("contacts") as Business["contacts"];
      return (
        <div className="space-y-1.5">
          <div className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {contacts?.phones?.[0]?.number || "N/A"}
            </span>
          </div>
          <div className="text-sm flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {contacts?.emails?.[0] || "N/A"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm">
          <div className="font-medium">{date.toLocaleDateString()}</div>
          <div className="text-xs text-muted-foreground">
            {date.toLocaleTimeString()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return (
        <div className="text-sm">
          <div className="font-medium">{date.toLocaleDateString()}</div>
          <div className="text-xs text-muted-foreground">
            {date.toLocaleTimeString()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">
          {row.getValue("createdBy")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "updatedBy",
    header: "Last Updated By",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">
          {row.getValue("updatedBy")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ActionCell
  },
];