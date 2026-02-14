// src/pages/PrivacyPolicy.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
                <li>Personal information you provide when creating an account.</li>
                <li>Property listings details submitted by landlords.</li>
                <li>Usage data such as pages visited and actions taken on the site.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">How We Use Your Data</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>To provide and improve our services.</li>
                <li>To communicate important updates and notifications.</li>
                <li>To personalize your experience and show relevant listings.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Data Protection</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>We implement strict security measures to protect your data.</li>
                <li>Data is never sold to third parties.</li>
                <li>You can request deletion of your account and personal information.</li>
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
