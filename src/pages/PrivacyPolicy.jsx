import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Link } from "wouter";
import PageTracker from "../components/PageTracker";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <PageTracker page="Privacy policy" />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>

        <p className="text-muted-foreground mb-8">
          CampusHub values your privacy. This policy explains how we collect, use, and protect your personal information.
        </p>

        <div className="space-y-6">
          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Personal information provided during account creation (name, email, campus, role).</li>
                <li>Property listings and details submitted by agencies.</li>
                <li>Usage data: pages visited, actions taken, and interaction metrics.</li>
                <li>Payment information for bookings (encrypted, not stored in plain text).</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">How We Use Your Data</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>To provide, maintain, and improve CampusHub services.</li>
                <li>To process bookings, payments, and commission transactions.</li>
                <li>To communicate relevant notifications and partnership updates.</li>
                <li>To personalize user experience and suggest relevant listings.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Data Sharing & Security</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Data is only shared with agencies for booking fulfillment and student verification.</li>
                <li>Strict security protocols protect personal and financial information.</li>
                <li>CampusHub does not sell user data to third parties.</li>
                <li>Cookies and session information are used to secure accounts and maintain login states.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>You may request deletion or update of your personal information.</li>
                <li>Users can opt-out of marketing communications at any time.</li>
                <li>Students may review their booking history and agency interactions.</li>
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