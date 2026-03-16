import { User, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLandlord } from "@/contexts/LandlordContext";
import { useLocation } from "wouter";
import { Mail } from "lucide-react";
import PageTracker from "../PageTracker";

export default function Profile() {
  const { profile } = useLandlord();
  const [, setLocation] = useLocation();

  const initials =
    profile?.username
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  // 🔎 Check profile completeness
  const isProfileIncomplete =
    !profile?.phone ||
    !profile?.verification?.full_name ||
    !profile?.verification?.id_number ||
    profile?.phone === "" ||
    profile?.verification?.full_name === "" ||
    profile?.verification?.id_number === "";

  const goToCompleteProfile = () => {
    setLocation("/full-profile");
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {/* <PageTracker page="Landlord profile"/> */}
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {initials}
          </div>

          <div>
            <p className="font-semibold leading-tight flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              {profile?.username || "Unknown User"}
            </p>
            {/* <p className="text-xs text-muted-foreground">
              ID: {profile?.user_id || "---"}
            </p> */}
          </div>

        </div>

        {/* Role */}
        {/* <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Role</span>
          <Badge variant="secondary" className="capitalize">
            {profile?.role || "user"}
          </Badge>
        </div> */}
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="w-3 h-3" />
              {profile?.email || "no-email"}
            </div>

        {/* ⚠️ Profile Incomplete Warning */}
        {isProfileIncomplete && (
          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm text-yellow-600">
              <AlertCircle className="w-4 h-4" />
              Profile incomplete
            </div>

            <Button
              onClick={goToCompleteProfile}
              size="sm"
              className="w-full"
            >
              Complete Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
