
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/contexts/TranslationContext";
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Users, 
  BarChart3,
  ArrowRight,
  Star,
  Truck,
  Shield
} from "lucide-react";

export default function PartnerInfo() {
  const { t } = useTranslation();

  const steps = [
    {
      number: "01",
      title: "Register & Apply",
      description: "Create your account and submit your business application with all required information.",
      icon: <Building2 className="w-6 h-6" />
    },
    {
      number: "02", 
      title: "Application Review",
      description: "Our team reviews your application within 2-3 business days to ensure quality standards.",
      icon: <Clock className="w-6 h-6" />
    },
    {
      number: "03",
      title: "Get Approved",
      description: "Once approved, you'll receive access to your partner dashboard and can start setting up.",
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      number: "04",
      title: "Start Earning",
      description: "Add your menu, configure settings, and start receiving orders from customers.",
      icon: <DollarSign className="w-6 h-6" />
    }
  ];

  const benefits = [
    {
      title: "Increased Revenue",
      description: "Reach more customers and boost your sales with our growing user base.",
      icon: <BarChart3 className="w-8 h-8 text-green-500" />
    },
    {
      title: "Easy Management",
      description: "User-friendly dashboard to manage orders, menu, and business settings.",
      icon: <Users className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Reliable Delivery",
      description: "Professional courier network ensures your products reach customers safely.",
      icon: <Truck className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Secure Platform",
      description: "Built with enterprise-grade security to protect your business and customer data.",
      icon: <Shield className="w-8 h-8 text-purple-500" />
    }
  ];

  const requirements = [
    "Valid business license and registration",
    "Physical business location with proper address",
    "Business email and contact phone number", 
    "Ability to fulfill orders during specified hours",
    "Commitment to quality service and customer satisfaction"
  ];

  const businessTypes = [
    "Restaurants & Cafes",
    "Fast Food & Quick Service", 
    "Bakeries & Dessert Shops",
    "Grocery & Convenience Stores",
    "Pharmacies & Health Stores",
    "Retail & Specialty Shops"
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-red-50 via-orange-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-orange-400 p-4 rounded-full">
                <Building2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Become a <span className="text-red-500">WeGo Partner</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our growing network of businesses and reach more customers while increasing your revenue. 
              Easy setup, powerful tools, and dedicated support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/partner-register">
                <Button className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-orange-400 hover:to-red-500 text-white font-semibold h-14 px-8 text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="h-14 px-8 text-lg font-semibold">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Getting started as a WeGo partner is simple and straightforward. 
                Follow these easy steps to join our platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="relative border-2 border-gray-100 hover:border-red-200 transition-colors">
                  <CardHeader className="text-center pb-4">
                    <div className="bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      {step.icon}
                    </div>
                    <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose WeGo?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of businesses already growing with our platform. 
                Here's what makes us different.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements & Business Types */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Requirements */}
              <Card className="p-8">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    Partner Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <p className="text-gray-600 mb-6">
                    To ensure quality service for our customers, we require our partners to meet these standards:
                  </p>
                  <ul className="space-y-3">
                    {requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Business Types */}
              <Card className="p-8">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Building2 className="w-6 h-6 text-blue-500" />
                    Supported Business Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <p className="text-gray-600 mb-6">
                    We welcome various types of businesses to join our platform:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {businessTypes.map((type, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Star className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-700 font-medium">{type}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Application Process Details */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Application Process
              </h2>
              <p className="text-xl text-gray-600">
                Understanding what happens after you apply
              </p>
            </div>

            <div className="space-y-8">
              <Card className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  Information Required
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Business Details</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Business name and type</li>
                      <li>• Complete business address</li>
                      <li>• Contact email and phone</li>
                      <li>• Business description (optional)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Account Setup</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Valid user account (registration required)</li>
                      <li>• Verification of business ownership</li>
                      <li>• Agreement to terms and conditions</li>
                      <li>• Commission structure acceptance</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Review Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                    <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-medium text-gray-900">Application Submitted</h4>
                      <p className="text-sm text-gray-600">Your application is received and queued for review</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-medium text-gray-900">Under Review (2-3 Days)</h4>
                      <p className="text-sm text-gray-600">Our team verifies your business information and compliance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-medium text-gray-900">Decision & Setup</h4>
                      <p className="text-sm text-gray-600">Approved partners receive dashboard access and setup guidance</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Join WeGo today and start reaching more customers. 
              The application process is quick and our team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/partner-register">
                <Button className="bg-white text-red-500 hover:bg-gray-100 font-semibold h-14 px-8 text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Start Your Application
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-500 h-14 px-8 text-lg font-semibold">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
