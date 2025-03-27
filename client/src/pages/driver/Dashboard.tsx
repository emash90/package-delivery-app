
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import AnimatedButton from '@/components/AnimatedButton';
import AvailablePackagesTable from '@/components/AvailablePackagesTable';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Check,
  X,
  Map,
  Route,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchDriverDeliveries, startDelivery, completeDelivery } from '@/store/slices/deliverySlice';
import { fetchAvailablePackages } from '@/store/slices/packageSlice';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'available'>('current');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { driverDeliveries, isLoading: deliveriesLoading } = useAppSelector(state => state.deliveries);
  const { availablePackages, isLoading: packagesLoading } = useAppSelector(state => state.packages);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchDriverDeliveries());
    dispatch(fetchAvailablePackages());
  }, [dispatch]);

  const handleStartDelivery = (deliveryId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to start a delivery",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    dispatch(startDelivery(deliveryId))
      .unwrap()
      .then(() => {
        toast({
          title: "Delivery started",
          description: "You have successfully started this delivery"
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error || "Failed to start delivery",
          variant: "destructive"
        });
      });
  };

  const handleCompleteDelivery = (deliveryId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete a delivery",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    dispatch(completeDelivery(deliveryId))
      .unwrap()
      .then(() => {
        toast({
          title: "Delivery completed",
          description: "You have successfully completed this delivery"
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error || "Failed to complete delivery",
          variant: "destructive"
        });
      });
  };

  // Stats calculation
  const completedDeliveries = driverDeliveries.filter(delivery => delivery.status === "Completed").length;
  const pendingDeliveries = driverDeliveries.filter(delivery => delivery.status === "Pending").length;
  const totalDistance = driverDeliveries.reduce((total, delivery) => {
    const distanceValue = parseFloat(delivery.distance.split(' ')[0]);
    return isNaN(distanceValue) ? total : total + distanceValue;
  }, 0).toFixed(1);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-6">
            <header className="mb-10">
              <h1 className="text-3xl font-display font-bold mb-4">Driver Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your deliveries, update statuses, and optimize your routes.
              </p>
              {!user && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-700">
                    You are viewing the driver dashboard in preview mode. 
                    <Link to="/login" className="font-medium underline ml-1">Sign in</Link> to access all features.
                  </p>
                </div>
              )}
            </header>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { title: "Today's Deliveries", value: driverDeliveries.length.toString(), icon: <Package className="h-6 w-6" />, color: "text-blue-500" },
                { title: "Completed", value: completedDeliveries.toString(), icon: <CheckCircle className="h-6 w-6" />, color: "text-green-500" },
                { title: "Pending", value: pendingDeliveries.toString(), icon: <AlertCircle className="h-6 w-6" />, color: "text-orange-500" },
                { title: "Total Distance", value: `${totalDistance} mi`, icon: <Route className="h-6 w-6" />, color: "text-purple-500" },
              ].map((stat, index) => (
                <GlassCard key={index} className="p-6 flex items-center">
                  <div className={cn("p-3 rounded-full bg-white shadow-soft mr-4", `${stat.color}/10`)}>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
            
            {/* Route Map Preview */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Today's Route</h2>
                <AnimatedButton size="sm" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  View Full Map
                </AnimatedButton>
              </div>
              
              <GlassCard className="p-0 overflow-hidden h-[300px] relative">
                <div className="absolute inset-0 bg-gray-100">
                  {/* This would be your map component */}
                  <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Map className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Interactive map would load here</p>
                      <p className="text-sm">Showing optimal route for 7 deliveries</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
            
            {/* Performance Summary */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Performance Summary</h2>
                <Link to="#" className="text-primary hover:underline text-sm">View Details</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Delivery Metrics
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "On-time Delivery Rate", value: "94%", color: "bg-green-500" },
                      { label: "Average Delivery Time", value: "18 min", color: "bg-blue-500" },
                      { label: "Customer Satisfaction", value: "4.8/5", color: "bg-purple-500" },
                    ].map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{metric.value}</span>
                          <div className={`w-2 h-2 rounded-full ${metric.color}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
                
                <GlassCard className="p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Weekly Overview
                  </h3>
                  <div className="h-[150px] flex items-end justify-between gap-1 mt-6 mb-4">
                    {[65, 80, 95, 75, 90, 70, 80].map((height, index) => (
                      <div key={index} className="flex flex-col items-center flex-grow">
                        <div 
                          className="w-full bg-primary/30 hover:bg-primary/40 rounded-t transition-all-200"
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </GlassCard>
              </div>
            </div>
            
            {/* Delivery Tabs */}
            <div className="mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  className={cn(
                    "py-3 px-6 font-medium text-sm focus:outline-none",
                    activeTab === 'current'
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-gray-700"
                  )}
                  onClick={() => setActiveTab('current')}
                >
                  Current Deliveries
                </button>
                <button
                  className={cn(
                    "py-3 px-6 font-medium text-sm focus:outline-none",
                    activeTab === 'available'
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-gray-700"
                  )}
                  onClick={() => setActiveTab('available')}
                >
                  Available Packages
                </button>
              </div>
            </div>
            
            {/* Content based on active tab */}
            {activeTab === 'current' ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Today's Deliveries</h2>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>All Deliveries</option>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
                
                {deliveriesLoading ? (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground">Loading deliveries...</p>
                  </div>
                ) : driverDeliveries.length === 0 ? (
                  <div className="py-20 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-lg font-medium mb-1">No deliveries yet</p>
                    <p className="text-muted-foreground">Check the available packages tab to start delivering</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {driverDeliveries.map((delivery) => (
                      <GlassCard key={delivery.id} className="p-5 hover:shadow-md transition-all-300 hover:border-primary/20 border border-transparent">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="lg:w-[35%]">
                            <p className="text-sm font-medium text-muted-foreground mb-1">{delivery.id}</p>
                            <h3 className="font-medium text-lg">{delivery.package}</h3>
                            <div className="flex items-center gap-1 mt-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">{delivery.address}</p>
                            </div>
                          </div>
                          
                          <div className="lg:w-[40%] grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center gap-1 mb-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">{delivery.recipient}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">{delivery.phone}</p>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-1 mb-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">{delivery.timeWindow}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Route className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">{delivery.distance}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="lg:w-[25%] flex gap-2 mt-4 lg:mt-0 lg:justify-end">
                            {delivery.status === "Pending" && (
                              <>
                                <AnimatedButton 
                                  size="sm" 
                                  className="flex-1 lg:flex-none"
                                  onClick={() => handleStartDelivery(delivery.id)}
                                >
                                  Start Delivery
                                </AnimatedButton>
                                <AnimatedButton size="sm" variant="outline" className="flex-1 lg:flex-none">
                                  Details
                                </AnimatedButton>
                              </>
                            )}
                            
                            {delivery.status === "In Progress" && (
                              <>
                                <AnimatedButton 
                                  size="sm" 
                                  className="flex-1 lg:flex-none flex gap-1 items-center"
                                  onClick={() => handleCompleteDelivery(delivery.id)}
                                >
                                  <Check className="h-4 w-4" />
                                  Complete
                                </AnimatedButton>
                                <AnimatedButton size="sm" variant="outline" className="flex-1 lg:flex-none flex gap-1 items-center text-destructive border-destructive/30 hover:bg-destructive/10">
                                  <X className="h-4 w-4" />
                                  Issue
                                </AnimatedButton>
                              </>
                            )}
                            
                            {delivery.status === "Completed" && (
                              <div className="flex items-center gap-2 text-green-500">
                                <CheckCircle className="h-5 w-5" />
                                <span>Completed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {packagesLoading ? (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground">Loading available packages...</p>
                  </div>
                ) : (
                  <>
                    {!user && (
                      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-amber-700">
                          To accept package deliveries, you need to 
                          <Link to="/login" className="font-medium underline mx-1">sign in</Link>
                          as a delivery driver.
                        </p>
                      </div>
                    )}
                    <AvailablePackagesTable 
                      packages={availablePackages}
                      onPackageSelect={(packageId) => {
                        if (!user) {
                          toast({
                            title: "Authentication required",
                            description: "Please log in to view package details",
                            variant: "destructive"
                          });
                          navigate("/login");
                        } else {
                          // Navigate to package detail
                          navigate(`/driver/package/${packageId}`);
                        }
                      }}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default DriverDashboard;
