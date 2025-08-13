import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import AnimatedButton from '@/components/AnimatedButton';
import { 
  Package as PackageIcon, 
  MapPin, 
  Clock, 
  Bell, 
  Search, 
  ChevronRight, 
  Truck, 
  CheckCircle2,
  PlusCircle,
  FileImage
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { 
  fetchPackages, 
  createPackage,
  updatePackage,
  Package
} from '@/store/slices/packageSlice'

const OwnerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { packages, isLoading, error } = useSelector((state: RootState) => state.packages);
  const user = useSelector((state: RootState) => state.auth.user);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  useEffect(() => {
    // Fetch packages when component mounts and user is loaded
    if (user?.id) {
      dispatch(fetchPackages(user.id));
    }
  }, [dispatch, user?.id]);

  // Handle stat card clicks
  const handleCardClick = (filterType: string) => {
    console.log('Owner card clicked:', filterType); // Debug log
    setQuickFilter(quickFilter === filterType ? null : filterType);
    // Reset other filters when using quick filter
    if (quickFilter !== filterType) {
      setSearchTerm('');
      setStatusFilter('All Statuses');
    }
  };

  // Filter packages based on search and filter criteria
  const filteredPackages = packages.filter(pkg => {
    // Apply quick filter first - if active, only apply quick filter
    if (quickFilter) {
      if (quickFilter === 'active') {
        return pkg.status !== 'delivered';
      }
      if (quickFilter === 'delivered') {
        return pkg.status === 'delivered';
      }
      if (quickFilter === 'in_transit') {
        return pkg.status === 'in transit';
      }
      return false; // Unknown quick filter
    }
    
    // Apply regular filters when no quick filter is active
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pkg.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || pkg.status === statusFilter;
    
    // You would add time filter logic here based on your actual data structure
    return matchesSearch && matchesStatus;
  });

  const handleDeletePackage = async (packageId: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        // Find the package in the Redux store
        const packageToUpdate = packages.find(pkg => pkg.id === packageId);
        
        if (!packageToUpdate) {
          throw new Error('Package not found');
        }
  
        // Create updated package with status set to inactive
        const updatedPackage = {
          ...packageToUpdate,
          status: 'inactive',
          lastUpdate: new Date().toISOString() // Update the timestamp
        };
  
        // Dispatch the update action
        await dispatch(updatePackage(updatedPackage));
        
        // Refresh the list
        if (user?.id) {
          dispatch(fetchPackages(user.id));
        }
        
        // Optional: Show success message
      } catch (error) {
        console.error('Failed to mark package as inactive:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
            <div className="text-center">
              <p>Loading your packages...</p>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
            <div className="text-center text-red-500">
              <p>Error loading packages: {error}</p>
              <Button onClick={() => user?.id && dispatch(fetchPackages(user.id))} className="mt-4">
                Retry
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-6">
            <header className="mb-10">
              <h1 className="text-3xl font-display font-bold mb-4">Package Owner Dashboard</h1>
              <p className="text-muted-foreground">
                Track, manage, and organize all your packages in one place.
              </p>
            </header>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
              {[
                { 
                  title: "Active Packages", 
                  value: packages.filter(p => p.status !== 'delivered').length, 
                  icon: <PackageIcon className="h-6 w-6" />, 
                  color: "text-blue-500",
                  filterType: "active",
                  clickable: true
                },
                { 
                  title: "Delivered", 
                  value: packages.filter(p => p.status === 'delivered').length, 
                  icon: <CheckCircle2 className="h-6 w-6" />, 
                  color: "text-green-500",
                  filterType: "delivered",
                  clickable: true
                },
                { 
                  title: "Out for Delivery", 
                  value: packages.filter(p => p.status === 'in transit').length, 
                  icon: <Truck className="h-6 w-6" />, 
                  color: "text-orange-500",
                  filterType: "in_transit",
                  clickable: true
                },
                { 
                  title: "Notifications", 
                  value: "3", // This would come from your notifications state
                  icon: <Bell className="h-6 w-6" />, 
                  color: "text-purple-500",
                  clickable: false
                },
              ].map((stat, index) => (
                <GlassCard 
                  key={index} 
                  className={cn(
                    "p-6 flex items-center transition-all duration-200",
                    stat.clickable && "cursor-pointer hover:shadow-lg hover:scale-105",
                    quickFilter === stat.filterType && "ring-2 ring-primary/50 bg-primary/5",
                    !stat.clickable && "opacity-75"
                  )}
                  onClick={() => stat.clickable && stat.filterType && handleCardClick(stat.filterType)}
                >
                  <div className={cn("p-3 rounded-full bg-white shadow-soft mr-4", `${stat.color}/10`)}>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {stat.title}
                      {stat.clickable && (
                        <span className="ml-1 text-xs text-primary opacity-60">
                          {quickFilter === stat.filterType ? "• Filtered" : "• Click to filter"}
                        </span>
                      )}
                    </p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
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
                      quickFilter === 'active' ? 'Active Packages' :
                      quickFilter === 'delivered' ? 'Delivered Packages' :
                      quickFilter === 'in_transit' ? 'Out for Delivery' : quickFilter
                    }
                  </span>
                  <span className="text-xs text-primary/70">
                    ({filteredPackages.length} packages)
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setQuickFilter(null);
                    setSearchTerm('');
                    setStatusFilter('All Statuses');
                  }}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Clear Filter
                </button>
              </div>
            )}

            {/* Search and Filter */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search packages by ID, name, or status..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select 
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option>All Statuses</option>
                    <option>processing</option>
                    <option>in transit</option>
                    <option>delivered</option>
                  </select>
                  <select 
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
                    <option>Last 30 Days</option>
                    <option>Last 7 Days</option>
                    <option>Today</option>
                    <option>All Time</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Package List */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Packages</h2>
                <Link to="/owner/create-package">
                  <AnimatedButton size="sm" className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Package
                  </AnimatedButton>
                </Link>
              </div>
              
              {filteredPackages.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <p className="text-muted-foreground">No packages found matching your criteria.</p>
                  <Button 
                    variant="ghost" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('All Statuses');
                      setTimeFilter('Last 30 Days');
                      setQuickFilter(null);
                    }}
                  >
                    Clear filters
                  </Button>
                </GlassCard>
              ) : (
                <div className="space-y-4">
                  {filteredPackages.map((pkg) => (
                    <div key={pkg.id}>
                      <Link to={`/owner/package/${pkg.id}`}>
                        <GlassCard className="p-4 hover:shadow-md transition-all-300 hover:border-primary/20 border border-transparent">
                          <div className="flex flex-col md:flex-row md:items-center">
                            {/* Package Image */}
                            <div className="md:w-[15%] mb-4 md:mb-0 md:mr-4">
                            <div className="aspect-square bg-muted rounded-md overflow-hidden">
                              {pkg.images && pkg.images.length > 0 ? (
                                <img 
                                  src={pkg.images[0]} 
                                  alt={pkg.name} 
                                  className="w-full h-full object-cover" 
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${pkg.images && pkg.images.length > 0 ? 'hidden' : ''}`}>
                                <FileImage className="h-8 w-8 text-gray-400" />
                              </div>
                            </div>
                            </div>
                            
                            {/* Package Info */}
                            <div className="md:w-[35%] mb-4 md:mb-0">
                              <p className="text-sm font-medium text-muted-foreground mb-1">{pkg.trackingId}</p>
                              <h3 className="font-medium text-lg">{pkg.name}</h3>
                            </div>
                            
                            <div className="md:w-[50%] grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    pkg.status === "delivered" ? "bg-green-500" :
                                    pkg.status === "in transit" ? "bg-blue-500" :
                                    pkg.status === "processing" ? "bg-yellow-500" : "bg-gray-500"
                                  )} />
                                  <span className="capitalize">
                                    {pkg.status === "in transit" ? "Out for Delivery" : 
                                     pkg.status === "delivered" ? "Delivered" :
                                     pkg.status === "processing" ? "Processing" : pkg.status}
                                  </span>
                                </p>
                                <p className="text-sm flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  {pkg.location}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-muted-foreground">Estimated Arrival</p>
                                <p className="text-sm flex items-center gap-1 mt-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  {formatDate(pkg.eta)}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-muted-foreground">Last Update</p>
                                  <p className="text-sm mt-1">{formatDate(pkg.lastUpdate)}</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="mt-4">
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full transition-all duration-500",
                                  pkg.status === "delivered" ? "bg-green-500" :
                                  pkg.status === "in transit" ? "bg-blue-500" :
                                  pkg.status === "processing" ? "bg-yellow-500" : "bg-gray-400"
                                )}
                                style={{ 
                                  width: pkg.status === "delivered" ? '100%' :
                                         pkg.status === "in transit" ? '75%' :
                                         pkg.status === "processing" ? '25%' : '10%'
                                }}
                              ></div>
                            </div>
                          </div>
                        </GlassCard>
                      </Link>
                      <div className="flex justify-end mt-2 space-x-2">
                        {pkg.status === 'delivered' ? (
                          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm font-medium">Successfully Delivered</span>
                          </div>
                        ) : pkg.status === 'in transit' ? (
                          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            <Truck className="h-4 w-4" />
                            <span className="text-sm font-medium">Out for Delivery</span>
                          </div>
                        ) : (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeletePackage(pkg.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Track a New Package", icon: <Search className="h-5 w-5" />, url: "/track" },
                  { title: "View Delivery History", icon: <Clock className="h-5 w-5" />, url: "/" },
                  { title: "Manage Notifications", icon: <Bell className="h-5 w-5" />, url: "/" },
                  { title: "Create New Package", icon: <PackageIcon className="h-5 w-5" />, url: "/owner/create-package" }
                ].map((action, index) => (
                  <Link to={action.url} key={index}>
                    <GlassCard className="p-5 hover-scale cursor-pointer">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-primary/10 mb-4">
                          <div className="text-primary">{action.icon}</div>
                        </div>
                        <h3 className="font-medium">{action.title}</h3>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default OwnerDashboard;