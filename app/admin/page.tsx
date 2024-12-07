"use client";

import { useState, useEffect } from "react";
import { Business } from "@/types/business";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Phone,
  Mail,
  Search,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { businessService } from "@/lib/services/businessService";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useBusinessSearch } from "@/hooks/useBusinessSearch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessToDelete, setBusinessToDelete] = useState<string | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    businesses: filteredBusinesses,
    totalResults,
    selectedTags,
    setSelectedTags,
    availableCategories,
    selectedCity,
    setSelectedCity,
    availableCities,
  } = useBusinessSearch(businesses);

  const columns: ColumnDef<Business>[] = [
    {
      accessorKey: "name",
      header: "Business",
      cell: ({ row }) => {
        const business = row.original;
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
                  {business.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">
                {business.name}
              </span>
              <span className="text-sm text-muted-foreground line-clamp-1">
                {business.brief || "No description available"}
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
                {contacts?.phones?.[0] || "N/A"}
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
      id: "actions",
      cell: ({ row }) => {
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
                onClick={() => setBusinessToDelete(business.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Business
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const data = await businessService.getAll();
      setBusinesses(data || []);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      toast.error("Failed to fetch businesses");
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await businessService.delete(id);
      toast.success("Business deleted successfully");
      fetchBusinesses();
    } catch (error) {
      toast.error("Failed to delete business. Please try again.");
    } finally {
      setBusinessToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-12 w-72 bg-muted rounded-lg"></div>
          <div className="h-[600px] bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Business Directory
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage and monitor your business listings
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/new")}
          size="lg"
          className="shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg"
        >
          <Plus className="mr-2.5 h-5 w-5 animate-pulse" />
          <span className="relative inline-block">Add New Business</span>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* <div className="flex gap-4">
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div> */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={filteredBusinesses || []}
            // className="border-0"
          />
        </CardContent>
      </Card>

      <AlertDialog
        open={!!businessToDelete}
        onOpenChange={() => setBusinessToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              business and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => businessToDelete && handleDelete(businessToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
