import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Sparkles, Users, Building2, X } from "lucide-react";

export default function AuthNudgeModal({ open, onClose, onSignupIntent }) {

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <Card className="relative w-[95%] max-w-lg rounded-2xl shadow-2xl">

        {/* X Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-lg hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>

        <CardContent className="p-8 space-y-6 text-center">

          <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">Join CampusHub</h2>
            <p className="text-muted-foreground mt-2">
              Create a free account to unlock verified listings, save favorites,
              and connect directly with landlords.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">

            {/* Student Signup */}
            <Link href="/signup">
              <Button
                className="w-full gap-2"
                onClick={() => onSignupIntent?.()}   // ✅ CLOSE ON CLICK
              >
                <Users className="w-4 h-4" />
                Join as Student
              </Button>
            </Link>

            {/* Landlord Signup */}
            <Link href="/landlord-signup">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => onSignupIntent?.()}   // ✅ CLOSE ON CLICK
              >
                <Building2 className="w-4 h-4" />
                Join as Landlord
              </Button>
            </Link>

          </div>

        </CardContent>
      </Card>
    </div>
  );
}
