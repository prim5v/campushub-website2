import { Home, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Campus<span className="text-primary">Hub</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              The trusted student housing marketplace. Find safe, verified, and affordable off-campus accommodation.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/listings" className="hover:text-primary transition-colors">Browse Rooms</Link></li>
              <li><Link href="/listings" className="hover:text-primary transition-colors">Verified Listings</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/safety-tips" className="hover:text-primary transition-colors">Safety Tips</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Landlords</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/landlord-dashboard" className="hover:text-primary transition-colors">List Your Property</Link></li>
              <li><Link href="/landlord-dashboard" className="hover:text-primary transition-colors">Pricing Plans</Link></li>
              <li><Link href="/landlord-dashboard" className="hover:text-primary transition-colors">Get Verified</Link></li>
              <li><Link href="/landlord-dashboard" className="hover:text-primary transition-colors">Landlord FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                {/* support@campushub.co.ke */}
                emax27348@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                +254 113899517
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 CampusHub. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <a
    href="https://campushubadmin.vercel.app/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-primary transition-colors"
  >
    manage
  </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
