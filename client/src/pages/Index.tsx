
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import AnimatedButton from '@/components/AnimatedButton';
import GlassCard from '@/components/GlassCard';
import RoleCard from '@/components/RoleCard';
import { Package, Truck, BarChart4 } from 'lucide-react';

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 flex items-center">
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent" />
            <div className="absolute -top-[30%] -right-[20%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute top-[20%] -left-[20%] w-[60%] h-[60%] rounded-full bg-blue-300/5 blur-3xl" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                Seamless Package Delivery for the Modern World
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Track your packages in real-time, manage deliveries with ease, and ensure your items arrive safely every time.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/track">
                  <AnimatedButton size="lg" className="px-8">
                    Track a Package
                  </AnimatedButton>
                </Link>
                <AnimatedButton size="lg" variant="outline" className="px-8">
                  Learn More
                </AnimatedButton>
              </div>
            </div>
          </div>
        </section>
        
        {/* User Roles Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Choose Your Role</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform serves three different user types, each with tailored features and experiences.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <RoleCard
                title="Package Owner"
                description="Track your packages, manage delivery preferences, and get real-time notifications."
                icon={<Package className="w-6 h-6" />}
                role="owner"
              />
              
              <RoleCard
                title="Delivery Driver"
                description="Manage your delivery routes, update package statuses, and optimize your workflow."
                icon={<Truck className="w-6 h-6" />}
                role="driver"
              />
              
              <RoleCard
                title="Administrator"
                description="Oversee all operations, manage users, analyze metrics, and ensure smooth functioning."
                icon={<BarChart4 className="w-6 h-6" />}
                role="admin"
              />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the perfect blend of simplicity and power with our comprehensive feature set.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Real-time Tracking",
                  description: "Monitor your package's journey with precision updates at every step of the delivery process."
                },
                {
                  title: "Secure Delivery",
                  description: "Rest easy knowing your packages are handled with care and protected by our security measures."
                },
                {
                  title: "Smart Notifications",
                  description: "Receive timely alerts about your package status through email, SMS, or push notifications."
                },
                {
                  title: "Route Optimization",
                  description: "Our intelligent algorithms ensure the most efficient delivery routes for drivers."
                },
                {
                  title: "Delivery Preferences",
                  description: "Set your preferred delivery times and special handling instructions for your packages."
                },
                {
                  title: "Analytics Dashboard",
                  description: "Gain insights with comprehensive reports and analytics on delivery performance."
                }
              ].map((feature, index) => (
                <GlassCard key={index} className="p-6 hover-scale">
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-blue-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied users who trust our platform for their delivery needs.
              </p>
              <AnimatedButton size="lg" className="px-10">
                Create Your Account
              </AnimatedButton>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
