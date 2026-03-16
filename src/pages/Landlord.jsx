// src/pages/Landlord.jsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  CheckCircle2, 
  Star,
  Zap,
  Crown,
  ArrowRight,
  MessageCircle,
  Calendar,
  BarChart3,
  Eye
} from "lucide-react";
import { Link } from "wouter";
import { useRef } from "react";
import { ApiSocket} from "@/utils/ApiSocket";
import PageTracker from "../components/PageTracker";


const benefits = [
  {
    icon: Users,
    title: "Access 0+ Students",
    description: "Connect directly with students actively searching for accommodation near their campus.",
  },
  {
    icon: TrendingUp,
    title: "Higher Occupancy",
    description: "Our verified badge and rating system builds trust, leading to faster bookings.",
  },
  {
    icon: Shield,
    title: "Verified Trust",
    description: "Get verified by CampusHub to stand out from unverified listings and build credibility.",
  },
  {
    icon: MessageCircle,
    title: "Easy Communication",
    description: "Built-in messaging system to handle inquiries and schedule viewings efficiently.",
  },
  {
    icon: Calendar,
    title: "Booking Management",
    description: "Track viewing appointments, reservations, and tenant inquiries all in one place.",
  },
  {
    icon: BarChart3,
    title: "Performance Insights",
    description: "See how your listings perform with views, inquiries, and conversion analytics.",
  },
];

const testimonials = [
  {
    quote: "Since joining CampusHub, I've had zero vacancies. Students trust the platform and my verified badge gives them confidence.",
    author: "James M.",
    role: "Property Owner, 12 units",
    rating: 5,
  },
  {
    quote: "The dashboard makes it so easy to manage multiple properties. I get notifications instantly when students are interested.",
    author: "Grace W.",
    role: "Landlord, 5 properties",
    rating: 5,
  },
];

const steps = [
  { step: 1, title: "Create Account", description: "Sign up as a landlord in 2 minutes" },
  { step: 2, title: "Add Properties", description: "Upload photos, set prices, describe amenities" },
  { step: 3, title: "Choose Plan", description: "Select a subscription that fits your needs" },
  { step: 4, title: "Get Verified", description: "Optional inspection for trusted badge" },
  { step: 5, title: "Start Receiving", description: "Get inquiries from students immediately" },
];

export default function Landlord() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pricingRef = useRef(null);

    useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await ApiSocket.get("/landlord/get_plans"); // ✅ uses new ApiSocket
        setPlans(data.plans || []); // assumes backend returns { plans: [...] }
        console.log("Fetched plans:", data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // if (loading) {
  //   return <p className="text-center mt-10">Loading plans...</p>;
  // }

  // if (error) {
  //   return <p className="text-center mt-10 text-red-600">Error: {error}</p>;
  // }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTracker page="landlord" />
      
      <section className="pt-28 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="gap-2 px-4 py-2 mb-6">
              <Building2 className="w-4 h-4 text-primary" />
              For Property Owners
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              List Your Property,
              <span className="text-gradient block">Reach Thousands of Students</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join CampusHub and get direct access to more students actively searching for 
              off-campus accommodation. Fill your vacancies faster with verified listings.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-8 gap-2" data-testid="button-get-started"
              onClick={() => pricingRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                No setup fees
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                0+ active landlords
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Landlords Choose CampusHub
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to successfully rent your properties to students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section ref={pricingRef} className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose the plan that fits your property portfolio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                className={`relative border-border/50 ${
                  plan.popular ? "border-primary shadow-lg scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1 px-4 py-1">
                      <Star className="w-3 h-3 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">KES {plan.price.toLocaleString()}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <div className="w-4 h-4 mt-0.5 shrink-0 rounded-full border border-border" />
                        <span className="line-through">{feature}</span>
                      </li>
                    ))}
                  </ul>
              <Link href={`/landlord-signup?plan=${plan.id}`}>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  data-testid={`button-choose-${plan.name.toLowerCase()}`}
                >
                  Choose {plan.name}
                </Button>
              </Link>

                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="inline-block border-primary/30 bg-primary/5">
              <CardContent className="p-6 flex items-center gap-4">
                <Shield className="w-10 h-10 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">Verification Badge: KES 500 (one-time)</p>
                  <p className="text-sm text-muted-foreground">
                    Physical inspection by our team. Increases trust and bookings.
                  </p>
                </div>
                <Button variant="outline" data-testid="button-get-verified">
                  Get Verified
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Get Started</h2>
            <p className="text-muted-foreground text-lg">
              Start receiving student inquiries in under 10 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                )}
                <div className="relative bg-card rounded-2xl p-5 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by 0+ Landlords
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg mb-4">"{testimonial.quote}"</blockquote>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Fill Your Vacancies?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join CampusHub today and start connecting with thousands of students 
            looking for their next home. No upfront fees, cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="h-14 px-8 gap-2 bg-white text-primary hover:bg-white/90"
              data-testid="button-start-listing"
            >
              <Zap className="w-5 h-5" />
              Start Listing Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8 border-white/30 text-white hover:bg-white/10"
              data-testid="button-contact-sales"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
