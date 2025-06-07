"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"


interface VendorPendingModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function VendorPendingModal({ isOpen, setIsOpen }: VendorPendingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <CheckCircle className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl">Application Submitted</DialogTitle>
          <DialogDescription className="text-center">
            Your vendor application has been submitted successfully. Our team will review your application and get back
            to you within 24-48 hours.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <div className="py-5 px-7 pb-7 text-center text-[0.95rem] text-gray-600 border-t border-gray-100">
            
              <a
                href="/vendor/login"
                className="text-[#b8860b] no-underline font-semibold transition-colors duration-200 hover:text-[#d4a017] hover:underline"
              >
                Go to Login
              </a>
            
          </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
