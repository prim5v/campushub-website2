import { Check, X, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useLandlord } from "@/contexts/LandlordContext";
import PageTracker from "../PageTracker";

export default function Plans() {
  const [, setLocation] = useLocation();
  const [plans, setPlans] = useState([]);
  const { getPlans, error } = useLandlord();

  // Check if user came for upgrade
  const params = new URLSearchParams(window.location.search);
  const upgradePlan = params.get("plan") === "upgrade";

  const handleUpgrade = (planId) => {
    alert(`You clicked upgrade/select for plan ID: ${planId}`);
    setLocation(`/landlord-signup?plan=${planId}`);
  };

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await getPlans();
      if (response) {
        setPlans(response); // <-- use response.plans, not response
      }
    };
    fetchPlans();
  }, [getPlans]);

  // Filter plans if upgrade mode is true
  const displayedPlans = upgradePlan 
    ? plans.filter((plan) => plan.price > 0)
    : plans;
  return (
    <div className="p-6 flex flex-col items-center space-y-6">
      <PageTracker page="Plans"/>
      {/* Hero Section */}
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">CampusHub Landlord Plans</h1>
        <p className="text-muted-foreground text-lg">
          Choose the right plan to maximize your property bookings, verify tenants quickly,
          and promote your listings to thousands of students.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {displayedPlans.map((plan) => {
          const isPopular = plan.popular;
          const isFree = plan.price === 0;

          return (
            <Card
              key={plan.id}
              className={`border rounded-xl transition-transform hover:scale-105 ${
                isPopular ? "border-primary bg-primary/10" : "border-border"
              } relative`}
            >
              {isPopular && (
                <Badge className="absolute top-2 right-2 bg-primary text-white px-2 py-1 flex items-center gap-1 text-xs">
                  <Crown className="w-3 h-3" />
                  Most Popular
                </Badge>
              )}
              <CardContent className="space-y-4 p-6">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>

                <div className="space-y-2 mt-2">
                  <h4 className="text-sm font-medium">Features</h4>
                  {plan.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>{f}</span>
                    </div>
                  ))}

                  {plan.notIncluded.length > 0 && (
                    <>
                      <h4 className="text-sm font-medium mt-2">Not Included</h4>
                      {plan.notIncluded.map((f, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-muted-foreground line-through"
                        >
                          <X className="w-4 h-4 text-red-400" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className={`text-lg font-bold ${isPopular ? "text-primary" : ""}`}>
                    {isFree ? "Free" : `KES ${plan.price}`} / {plan.period}
                  </span>
                  <Button
                    size="sm"
                    variant={isFree ? "outline" : "default"}
                    onClick={() => handleUpgrade(plan.id)}
                    className="flex items-center gap-2"
                  >
                    {isFree ? "Select Plan" : "Upgrade Now"}
                  </Button>
                </div>

                {isPopular && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    Most landlords choose this to maximize bookings
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="mt-8 w-full flex justify-center">
        <Button
          variant="ghost"
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              setLocation("/"); // fallback home
            }
          }}
        >
          ← Back
        </Button>
      </div>
    </div>
  );
}
