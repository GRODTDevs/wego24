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
import { useTranslation } from "react-i18next";

export function InfoModal() {
  const { user } = useAuth();
  const { t } = useTranslation();

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
            {t('modal.welcomeTitle')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-700">
            {t('modal.welcomeDescription')}
          </p>
          <div>
            <h3 className="font-medium text-red-600 mb-2">{t('modal.productOwnerStepsTitle')}</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>{t('modal.step.searchRestaurants')}</li>
              <li>{t('modal.step.viewMenu')}</li>
              <li>{t('modal.step.reviewFlows')}</li>
              <li>
                {user 
                  ? t('modal.step.loggedIn')
                  : t('modal.step.loginPrompt')
                }
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
