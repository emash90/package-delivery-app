import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import AnimatedButton from '@/components/AnimatedButton';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Check,
  X,
  CheckCircle,
  AlertCircle,
  Route,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchPendingDeliveries, startDelivery, completeDelivery } from '@/store/slices/deliverySlice';
import { format } from 'date-fns';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState<'my' | 'pending'>('my');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null); // Store the delivery to start
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { pendingDeliveries, isLoading: deliveriesLoading } = useAppSelector(state => state.deliveries);
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(fetchPendingDeliveries());
  }, [dispatch]);

  const handleStartDeliveryClick = (delivery: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start a delivery",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    setSelectedDelivery(delivery);
    setIsModalOpen(true); // Open the confirmation modal
  };

  const handleConfirmStartDelivery = () => {
    if (!selectedDelivery) return;

    dispatch(startDelivery(selectedDelivery.id))
      .unwrap()
      .then(() => {
        toast({
          title: "Delivery Started",
          description: "You have successfully started this delivery",
          variant: "success",
        });
        setIsModalOpen(false); // Close the modal
        setSelectedDelivery(null); // Clear the selected delivery
        dispatch(fetchPendingDeliveries()); // Refresh the deliveries list
        setActiveTab('my'); // Switch to "My Deliveries" tab
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error?.message || "Failed to start delivery",
          variant: "destructive",
        });
      });
  };

  const handleCompleteDelivery = (deliveryId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete a delivery",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    dispatch(completeDelivery(deliveryId))
      .unwrap()
      .then(() => {
        toast({
          title: "Delivery Completed",
          description: "You have successfully completed this delivery",
          variant: "success",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error?.message || "Failed to complete delivery",
          variant: "destructive",
        });
      });
  };

  // Stats calculation
  const myDeliveries = pendingDeliveries.filter(d => d.driverId === user?.id);
  const availablePending = pendingDeliveries.filter(d => !d.driverId && d.status === 'pending');
  const completedDeliveries = myDeliveries.filter(d => d.status === 'delivered').length;
  const totalPending = availablePending.length;
  const activeDeliveries = myDeliveries.filter(d => d.status === 'in transit').length;

  // Dummy ETA calculation (replace with real logic if available)
  const calculateETA = (delivery: any) => {
    const estimatedDeliveryTime = new Date(delivery.estimatedDeliveryTime);
    const etaDate = new Date(estimatedDeliveryTime.getTime() + 6 * 60 * 60 * 1000); //add a 6 hour window of delivery
    return format(etaDate, 'MMM d, yyyy HH:mm');
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-6 max-w-7xl">
            {/* Header */}
            <header className="mb-10">
              <h1 className="text-4xl font-display font-bold text-gray-800 mb-2">
                Driver Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your deliveries and track your progress with ease.
              </p>
              {!user && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-700">
                    Preview mode active.{' '}
                    <Link to="/login" className="font-medium underline hover:text-amber-900">
                      Sign in
                    </Link>{' '}
                    to manage deliveries.
                  </p>
                </div>
              )}
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { title: "My Deliveries", value: myDeliveries.length, icon: Package, color: "text-blue-600" },
                { title: "Completed", value: completedDeliveries, icon: CheckCircle, color: "text-green-600" },
                { title: "Pending Available", value: totalPending, icon: AlertCircle, color: "text-orange-600" },
                { title: "Active", value: activeDeliveries, icon: Route, color: "text-purple-600" },
              ].map((stat, index) => (
                <GlassCard key={index} className="p-6 flex items-center hover:shadow-lg transition-shadow">
                  <div className={cn("p-3 rounded-full bg-white shadow-md mr-4", `${stat.color}/10`)}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex border-b border-gray-200">
                {['my', 'pending'].map(tab => (
                  <button
                    key={tab}
                    className={cn(
                      "py-3 px-6 font-medium text-sm focus:outline-none transition-colors",
                      activeTab === tab
                        ? "border-b-2 border-primary text-primary"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => setActiveTab(tab as 'my' | 'pending')}
                  >
                    {tab === 'my' ? 'My Deliveries' : 'Pending Deliveries'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'my' ? (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">My Deliveries</h2>
                </div>

                {deliveriesLoading ? (
                  <div className="py-20 text-center">
                    <p className="text-gray-500">Loading deliveries...</p>
                  </div>
                ) : myDeliveries.length === 0 ? (
                  <div className="py-20 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-700 mb-1">No Active Deliveries</p>
                    <p className="text-gray-500">
                      Check the Pending Deliveries tab to pick up new tasks.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {myDeliveries.map((delivery) => (
                      <GlassCard
                        key={delivery.trackingId}
                        className="p-6 hover:shadow-md transition-all border border-gray-100 hover:border-primary/20"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Tracking ID: {delivery.trackingId}
                            </p>
                            <p className={cn(
                              "text-sm font-semibold px-2 py-1 rounded-full inline-block",
                              delivery.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                              delivery.status === 'in transit' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            )}>
                              {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <p className="text-sm text-gray-700">{delivery.recipientName}</p>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <p className="text-sm text-gray-700">{delivery.recipientAddress}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <p className="text-sm text-gray-700">{delivery.recipientPhone}</p>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <p className="text-sm text-gray-700">
                                  Created: {format(new Date(delivery.createdAt), 'MMM d, yyyy HH:mm')}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <p className="text-sm text-gray-700">
                                  Delivery Time: {format(new Date(delivery.estimatedDeliveryTime), 'MMM d, yyyy HH:mm')}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4 justify-end">
                              {delivery.status === 'in transit' && (
                                <>
                                  <AnimatedButton
                                    size="sm"
                                    onClick={() => handleCompleteDelivery(delivery.trackingId)}
                                    className="flex gap-1 items-center"
                                  >
                                    <Check className="h-4 w-4" />
                                    Complete
                                  </AnimatedButton>
                                  <AnimatedButton
                                    size="sm"
                                    variant="outline"
                                    className="flex gap-1 items-center text-red-600 border-red-300 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                    Report Issue
                                  </AnimatedButton>
                                </>
                              )}
                              {delivery.status === 'delivered' && (
                                <div className="flex items-center gap-2 text-green-600">
                                  <CheckCircle className="h-5 w-5" />
                                  <span>Delivered</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Pending Deliveries</h2>
                </div>

                {deliveriesLoading ? (
                  <div className="py-20 text-center">
                    <p className="text-gray-500">Loading pending deliveries...</p>
                  </div>
                ) : availablePending.length === 0 ? (
                  <div className="py-20 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-700 mb-1">No Pending Deliveries</p>
                    <p className="text-gray-500">Check back later for new delivery opportunities.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {availablePending.map((delivery) => (
                      <GlassCard
                        key={delivery.trackingId}
                        className="p-6 hover:shadow-md transition-all border border-gray-100 hover:border-primary/20"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Tracking ID: {delivery.trackingId}
                            </p>
                            <p className="text-sm font-semibold px-2 py-1 rounded-full inline-block bg-orange-100 text-orange-700">
                              Pending
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <p className="text-sm text-gray-700">{delivery.recipientName}</p>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <p className="text-sm text-gray-700">{delivery.recipientAddress}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <p className="text-sm text-gray-700">{delivery.recipientPhone}</p>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <p className="text-sm text-gray-700">
                                  Created: {format(new Date(delivery.createdAt), 'MMM d, yyyy HH:mm')}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <p className="text-sm text-gray-700">
                                  Estimated Delivery: {format(new Date(delivery.estimatedDeliveryTime), 'MMM d, yyyy HH:mm')}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4 justify-end">
                              <AnimatedButton
                                size="sm"
                                onClick={() => handleStartDeliveryClick(delivery)}
                                className="bg-primary hover:bg-primary/90"
                              >
                                Start Delivery
                              </AnimatedButton>
                              <AnimatedButton size="sm" variant="outline">
                                Details
                              </AnimatedButton>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </main>

        {/* Confirmation Modal */}
        {isModalOpen && selectedDelivery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Start Delivery</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Tracking ID:</strong> {selectedDelivery.trackingId}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Recipient:</strong> {selectedDelivery.recipientName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Address:</strong> {selectedDelivery.recipientAddress}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Contact:</strong> {selectedDelivery.recipientPhone}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Estimated Time of Arrival (ETA):</strong> {calculateETA(selectedDelivery)}
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <AnimatedButton
                  size="sm"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </AnimatedButton>
                <AnimatedButton
                  size="sm"
                  onClick={handleConfirmStartDelivery}
                  className="bg-primary hover:bg-primary/90"
                >
                  Confirm
                </AnimatedButton>
              </div>
            </div>
          </div>
        )}
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default DriverDashboard;