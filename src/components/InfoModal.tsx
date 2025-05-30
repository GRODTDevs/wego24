
import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

export function InfoModal() {
  const { user } = useAuth();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 z-50 bg-red-500 hover:bg-red-600 text-white shadow-lg rounded-full h-12 w-12"
        >
          <Info className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-red-700">
            Welcome to the ToGoo Demo
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-700">
            This is the main customer/home page. Here users can search and select restaurants to view their menu and place demo orders.
          </p>
          <div>
            <h3 className="font-medium text-red-600 mb-2">Product Owner Steps:</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Try searching or browsing restaurants.</li>
              <li>Click a restaurant to view its menu.</li>
              <li>Use the Restaurant or Driver login to review order and delivery flows.</li>
              <li>
                {user 
                  ? "You are now logged in! Try exploring the features." 
                  : "Click 'Login / Sign Up' to create an account and access full features."
                }
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
