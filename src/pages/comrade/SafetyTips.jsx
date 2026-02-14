// src/pages/SafetyTips.jsx
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function SafetyTips() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Student Housing Safety Tips</h1>
        </div>

        <p className="text-muted-foreground mb-8">
          Ensuring your safety while living off-campus is crucial. Follow these tips to have a secure and stress-free experience.
        </p>

        {/* Safety Tips Sections */}
        <div className="space-y-6">
          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Before Renting</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Verify the landlord and property credentials.</li>
                <li>Visit the property in person before signing any contract.</li>
                <li>Check the neighborhood and accessibility to campus.</li>
                <li>Understand all payment terms and deposits.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">While Living There</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Keep emergency contacts handy.</li>
                <li>Lock doors and windows at all times.</li>
                <li>Be cautious with sharing personal information online.</li>
                <li>Report any suspicious activity to the landlord or authorities.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">For Landlords</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Ensure properties are safe, secure, and well-maintained.</li>
                <li>Verify tenants’ identities before signing agreements.</li>
                <li>Keep records of all communications and transactions.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
