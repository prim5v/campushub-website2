import { BadgeCheck, ShieldAlert, Crown, ArrowUpRight, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLandlord } from "@/contexts/LandlordContext";
import { useLocation } from "wouter";

export default function Account() {
  const { profile } = useLandlord();
  const [, setLocation] = useLocation();

  const verificationStatus = profile?.verification?.status || "pending";
  const isVerified = verificationStatus === "verified" || "pending";
  const plan = profile?.plan || "free";
  const isFreePlan = plan === "free";

    const handleUpgrade = () => {
    setLocation(`/plans?plan=upgrade`);
  };


  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        {/* ===== Plan ===== */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Crown className="w-4 h-4" />
            Plan
          </span>
          <Badge variant="outline" className="capitalize">
            {plan}
          </Badge>
        </div>

        {/* ===== Verification ===== */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Verification</span>
          {isVerified ? (
            <Badge className="bg-green-600 hover:bg-green-600 gap-1">
              <BadgeCheck className="w-3 h-3" />
              {verificationStatus}
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1 capitalize">
              <ShieldAlert className="w-3 h-3" />
              {verificationStatus}
            </Badge>
          )}
        </div>

        {/* ===== Account Status ===== */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Account</span>
          <Badge variant={profile?.is_active ? "default" : "destructive"}>
            {profile?.is_active ? "Active" : "Disabled"}
          </Badge>
        </div>

        {/* ===== CTA BUTTONS ===== */}
        <div className="pt-2 space-y-2">

          {/* Complete Profile */}
          {!isVerified && (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => setLocation("/verify-account")}
            >
              <UserCheck className="w-4 h-4" />
              Complete Verification
            </Button>
          )}

          {/* Upgrade Plan */}
          {isFreePlan && (
            <Button
              size="sm"
              className="w-full gap-2"
              onClick={handleUpgrade}
            >
              <ArrowUpRight className="w-4 h-4" />
              Upgrade Plan
            </Button>
          )}

        </div>
      </CardContent>
    </Card>
  );
}
