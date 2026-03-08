import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>

        <p className="text-muted-foreground mb-8">
          By using CampusHub, you agree to these terms. Please read them carefully before using our platform.
        </p>

        <div className="space-y-6">
          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Account Responsibilities</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Maintain confidentiality of your account credentials.</li>
                <li>Ensure all listings or personal information provided are accurate and truthful.</li>
                <li>Students and agencies must follow all CampusHub procedures when booking or listing properties.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Platform Use</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Do not misuse the platform for illegal, fraudulent, or harmful activities.</li>
                <li>Respect the privacy and rights of other users and agencies.</li>
                <li>CampusHub reserves the right to remove content that violates these terms.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Booking and Commission</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Students pay a 10% booking/reservation fee when requesting a unit.</li>
                <li>Full rent and deposit must be paid within 3 days; otherwise, the booking is cancelled, with 60% of the booking fee refunded.</li>
                <li>CampusHub charges 15% commission on the first month’s rent only after successful booking completion.</li>
                <li>No additional charges apply beyond the booking fee and commission.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Agency Partnership Terms</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Access to verified student clients for property listings.</li>
                <li>Units must be reserved during the 3-day booking period.</li>
                <li>CampusHub acts additively: it does not replace existing agency websites or listings.</li>
                <li>Clear communication and reporting obligations are enforced to ensure trust and compliance.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Liability</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>CampusHub is not responsible for disputes between students and agencies.</li>
                <li>CampusHub does not guarantee the quality, legality, or safety of listed properties.</li>
                <li>Users should perform due diligence before completing bookings or payments.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

<div className="mt-8 text-center">
  <button
    onClick={() => window.history.back()}
    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
  >
    Back
  </button>
</div>
      </div>
    </div>
  );
}