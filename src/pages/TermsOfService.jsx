// src/pages/TermsOfService.jsx
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
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>Any listings or information you post must be accurate and truthful.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Platform Use</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Do not misuse the platform for illegal or fraudulent activities.</li>
                <li>Respect the privacy and rights of other users.</li>
                <li>We reserve the right to remove content that violates these terms.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border rounded-xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Liability</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>CampusHub is not responsible for disputes between users.</li>
                <li>We do not guarantee the quality, safety, or legality of listed properties.</li>
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
