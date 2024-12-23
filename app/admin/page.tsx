"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns"
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
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { businessService } from "@/lib/services/businessService";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { Toaster } from "sonner";
import { getInitials } from "@/lib/utils";
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

export default function AdminPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessToDelete, setBusinessToDelete] = useState<string | null>(null);

  const pathname = usePathname();

  const { user, loading: authLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/admin/signin");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (!authLoading && !user && pathname !== "/admin/signin") {
      router.push("/admin/signin");
    }
  }, [user, authLoading, router, pathname]);

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

  useEffect(() => {
    const handleDeleteEvent = (event: CustomEvent<string>) => {
      setBusinessToDelete(event.detail);
    };

    window.addEventListener('deleteBusiness', handleDeleteEvent as EventListener);

    return () => {
      window.removeEventListener('deleteBusiness', handleDeleteEvent as EventListener);
    };
  }, []);

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
      <Toaster position="top-center" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Business Directory
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage and monitor your business listings
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => router.push("/admin/new")}
            size="lg"
            className="shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg"
          >
            <Plus className="mr-2.5 h-5 w-5 animate-pulse" />
            <span className="relative inline-block">Add New Business</span>
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="lg"
            className="shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={businesses}
      />

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
