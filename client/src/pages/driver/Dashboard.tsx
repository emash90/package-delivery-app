import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import AnimatedButton from '@/components/AnimatedButton';
import PackageDetailsModal from '@/components/PackageDetailsModal';
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
import { fetchPendingDeliveries, fetchDriverCompletedDeliveries, startDelivery, completeDelivery } from '@/store/slices/deliverySlice';
import { format } from 'date-fns';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState<'my' | 'pending' | 'completed'>('my');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null); // Store the delivery to start/complete
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { pendingDeliveries, driverCompletedDeliveries, isLoading: deliveriesLoading } = useAppSelector(state => state.deliveries);
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(fetchPendingDeliveries());
    dispatch(fetchDriverCompletedDeliveries());
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
    setIsStartModalOpen(true); // Open the start confirmation modal
  };

  const handleCompleteDeliveryClick = (delivery: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete a delivery",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    setSelectedDelivery(delivery);
    setIsCompleteModalOpen(true); // Open the complete confirmation modal
  };

  const handleDetailsClick = (delivery: any) => {
    setSelectedDelivery(delivery);
    setIsDetailsModalOpen(true); // Open the details modal
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
        setIsStartModalOpen(false); // Close the modal
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

  const handleConfirmCompleteDelivery = () => {
    if (!selectedDelivery) return;

    dispatch(completeDelivery(selectedDelivery.id))
      .unwrap()
      .then((response) => {
        toast({
          title: "Delivery Completed",
          description: `You have successfully completed delivery for ${selectedDelivery.recipientName} at ${new Date().toLocaleTimeString()}`,
          variant: "success",
        });
        setIsCompleteModalOpen(false); // Close the modal
        setSelectedDelivery(null); // Clear the selected delivery
        dispatch(fetchPendingDeliveries()); // Refresh the deliveries list
        dispatch(fetchDriverCompletedDeliveries()); // Refresh completed deliveries
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error?.message || "Failed to complete delivery",
          variant: "destructive",
        });
      });
  };

  // Handle stat card clicks
  const handleCardClick = (filterType: string) => {
    console.log('Card clicked:', filterType); // Debug log
    const isCurrentFilter = quickFilter === filterType;
    
    // Toggle filter or clear if clicking the same card
    setQuickFilter(isCurrentFilter ? null : filterType);
    
    // Switch to appropriate tab when setting a filter
    if (!isCurrentFilter) {
      if (filterType === 'my' || filterType === 'active') {
        setActiveTab('my');
      } else if (filterType === 'completed') {
        setActiveTab('completed');
      } else if (filterType === 'pending') {
        setActiveTab('pending');
      }
    }
  };

  // Stats calculation
  const myDeliveries = pendingDeliveries.filter(d => d.driverId === user?.id);
  const availablePending = pendingDeliveries.filter(d => !d.driverId && d.status === 'pending');
  const completedDeliveriesCount = driverCompletedDeliveries.length;
  const totalPending = availablePending.length;
  const activeDeliveries = myDeliveries.filter(d => d.status === 'in transit').length;

  // Apply quick filter to delivery arrays
  const getFilteredMyDeliveries = () => {
    if (!quickFilter) return myDeliveries;
    
    if (quickFilter === 'active') {
      return myDeliveries.filter(d => d.status === 'in transit');
    }
    if (quickFilter === 'my') {
      return myDeliveries; // Show all my deliveries
    }
    
    return myDeliveries;
  };

  const getFilteredPendingDeliveries = () => {
    if (!quickFilter) return availablePending;
    
    if (quickFilter === 'pending') {
      return availablePending; // Show all pending deliveries
    }
    
    // If other filters are active, return empty array to hide pending deliveries
    return [];
  };

  const getFilteredCompletedDeliveries = () => {
    if (!quickFilter) return driverCompletedDeliveries;
    
    if (quickFilter === 'completed') {
      return driverCompletedDeliveries; // Show all completed deliveries
    }
    
    // If other filters are active, return empty array to hide completed deliveries
    return [];
  };

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
                { 
                  title: "My Deliveries", 
                  value: myDeliveries.length, 
                  icon: Package, 
                  color: "text-blue-600",
                  filterType: "my",
                  clickable: true
                },
                { 
                  title: "Completed", 
                  value: completedDeliveriesCount, 
                  icon: CheckCircle, 
                  color: "text-green-600",
                  filterType: "completed",
                  clickable: true
                },
                { 
                  title: "Pending Available", 
                  value: totalPending, 
                  icon: AlertCircle, 
                  color: "text-orange-600",
                  filterType: "pending",
                  clickable: true
                },
                { 
                  title: "Active", 
                  value: activeDeliveries, 
                  icon: Route, 
                  color: "text-purple-600",
                  filterType: "active",
                  clickable: true
                },
              ].map((stat, index) => (
                <GlassCard 
                  key={index} 
                  className={cn(
                    "p-6 flex items-center transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105",
                    (activeTab === stat.filterType || quickFilter === stat.filterType) && "ring-2 ring-primary/50 bg-primary/5"
                  )}
                  onClick={() => handleCardClick(stat.filterType)}
                >
                  <div className={cn("p-3 rounded-full bg-white shadow-md mr-4", `${stat.color}/10`)}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">
                      {stat.title}
                      <span className="ml-1 text-xs text-primary opacity-60">
                        {(activeTab === stat.filterType || quickFilter === stat.filterType) ? "• Active" : "• Click to filter"}
                      </span>
                    </p>
                    <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Quick Filter Indicator */}
            {quickFilter && (
              <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">
                    Filtering: {
                      quickFilter === 'my' ? 'My Deliveries' :
                      quickFilter === 'completed' ? 'Completed Deliveries' :
                      quickFilter === 'pending' ? 'Pending Deliveries' :
                      quickFilter === 'active' ? 'Active Deliveries' : quickFilter
                    }
                  </span>
                  <span className="text-xs text-primary/70">
                    ({quickFilter === 'my' ? getFilteredMyDeliveries().length :
                      quickFilter === 'completed' ? getFilteredCompletedDeliveries().length :
                      quickFilter === 'pending' ? getFilteredPendingDeliveries().length :
                      quickFilter === 'active' ? getFilteredMyDeliveries().length : 0} deliveries)
                  </span>
                </div>
                <button 
                  onClick={() => setQuickFilter(null)}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Clear Filter
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex border-b border-gray-200">
                {['my', 'pending', 'completed'].map(tab => (
                  <button
                    key={tab}
                    className={cn(
                      "py-3 px-6 font-medium text-sm focus:outline-none transition-colors",
                      activeTab === tab
                        ? "border-b-2 border-primary text-primary"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => setActiveTab(tab as 'my' | 'pending' | 'completed')}
                  >
                    {tab === 'my' ? 'My Deliveries' : 
                     tab === 'pending' ? 'Pending Deliveries' : 
                     'Completed Deliveries'}
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
                ) : getFilteredMyDeliveries().length === 0 ? (
                  <div className="py-20 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-700 mb-1">No Active Deliveries</p>
                    <p className="text-gray-500">
                      Check the Pending Deliveries tab to pick up new tasks.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {getFilteredMyDeliveries().map((delivery) => (
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
                                    onClick={() => handleCompleteDeliveryClick(delivery)}
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
            ) : activeTab === 'pending' ? (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Pending Deliveries</h2>
                </div>

                {deliveriesLoading ? (
                  <div className="py-20 text-center">
                    <p className="text-gray-500">Loading pending deliveries...</p>
                  </div>
                ) : getFilteredPendingDeliveries().length === 0 ? (
                  <div className="py-20 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-700 mb-1">No Pending Deliveries</p>
                    <p className="text-gray-500">Check back later for new delivery opportunities.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {getFilteredPendingDeliveries().map((delivery) => (
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
                              <AnimatedButton 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDetailsClick(delivery)}
                              >
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
            ) : (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Completed Deliveries</h2>
                </div>

                {deliveriesLoading ? (
                  <div className="py-20 text-center">
                    <p className="text-gray-500">Loading completed deliveries...</p>
                  </div>
                ) : getFilteredCompletedDeliveries().length === 0 ? (
                  <div className="py-20 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-700 mb-1">No Completed Deliveries</p>
                    <p className="text-gray-500">Complete some deliveries to see them here.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {getFilteredCompletedDeliveries().map((delivery) => (
                      <GlassCard
                        key={delivery.trackingId}
                        className="p-6 border border-gray-100 bg-green-50/30"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Tracking ID: {delivery.trackingId}
                            </p>
                            <p className="text-sm font-semibold px-2 py-1 rounded-full inline-block bg-green-100 text-green-700">
                              Completed
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
                                  Completed: {delivery.actualDeliveryTime ? format(new Date(delivery.actualDeliveryTime), 'MMM d, yyyy HH:mm') : 'N/A'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <p className="text-sm text-gray-700">
                                  Started: {delivery.startTime ? format(new Date(delivery.startTime), 'MMM d, yyyy HH:mm') : 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4 justify-end">
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Successfully Delivered</span>
                              </div>
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

        {/* Start Delivery Confirmation Modal */}
        {isStartModalOpen && selectedDelivery && (
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
                  onClick={() => setIsStartModalOpen(false)}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </AnimatedButton>
                <AnimatedButton
                  size="sm"
                  onClick={handleConfirmStartDelivery}
                  className="bg-primary hover:bg-primary/90"
                >
                  Start Delivery
                </AnimatedButton>
              </div>
            </div>
          </div>
        )}

        {/* Complete Delivery Confirmation Modal */}
        {isCompleteModalOpen && selectedDelivery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Complete Delivery</h3>
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
                  <strong>Started At:</strong> {selectedDelivery.startTime ? format(new Date(selectedDelivery.startTime), 'MMM d, yyyy HH:mm') : 'N/A'}
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> By confirming completion, you certify that the package has been successfully delivered to the recipient.
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <AnimatedButton
                  size="sm"
                  variant="outline"
                  onClick={() => setIsCompleteModalOpen(false)}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </AnimatedButton>
                <AnimatedButton
                  size="sm"
                  onClick={handleConfirmCompleteDelivery}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Complete Delivery
                </AnimatedButton>
              </div>
            </div>
          </div>
        )}

        {/* Package Details Modal */}
        <PackageDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          delivery={selectedDelivery}
          onStartDelivery={handleStartDeliveryClick}
        />
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default DriverDashboard;