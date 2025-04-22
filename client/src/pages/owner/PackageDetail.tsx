import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchPackageById } from '@/store/slices/packageSlice';
import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import { 
  Package as PackageIcon, 
  MapPin, 
  Calendar, 
  Clock, 
  Truck, 
  ChevronRight,
  Info,
  Weight,
  Tag,
  ArrowLeft,
  Image as ImageIcon,
  User,
  Phone,
  Box,
  Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import BackButton from '@/components/BackButton';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentPackage, isLoading: loading, error } = useSelector((state: RootState) => state.packages);

  useEffect(() => {
    if (id) {
      dispatch(fetchPackageById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24">
        <Skeleton className="h-12 w-1/4 mb-6" />
        <div className="flex gap-8">
          <Skeleton className="h-[400px] w-2/3" />
          <Skeleton className="h-[300px] w-1/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 pt-24 text-center">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  if (!currentPackage) {
    return (
      <div className="container mx-auto px-6 pt-24 text-center">
        <p>No package found</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-6">
            <BackButton className="mb-6" />
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-2/3">
                {/* Package Images */}
                <GlassCard className="p-6 mb-6">
                  {(!currentPackage.images || currentPackage.images.length === 0) ? (
                    <div className="w-full h-[300px] flex flex-col items-center justify-center bg-muted rounded-lg">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No images for this package</p>
                    </div>
                  ) : (
                    <Carousel className="w-full max-w-full">
                      <CarouselContent>
                        {currentPackage.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="aspect-video bg-muted rounded-md overflow-hidden">
                              <img 
                                src={image.url} 
                                alt={currentPackage.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  )}
                </GlassCard>

                {/* Package Details */}
                <GlassCard className="p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                      <PackageIcon className="h-6 w-6 text-primary" />
                      {currentPackage.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        currentPackage.status === "delivered" ? "bg-green-100 text-green-800" :
                        currentPackage.status === "processing" ? "bg-blue-100 text-blue-800" :
                        currentPackage.status === "in transit" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      )}>
                        {currentPackage.status}
                      </span>
                      <Link 
                        to="/owner/dashboard" 
                        className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                      >
                        <ArrowLeft className="h-3 w-3" />
                        Dashboard
                      </Link>
                    </div>
                  </div>

                  {currentPackage.description && (
                    <p className="text-base mb-6">{currentPackage.description}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Hash className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Tracking ID</p>
                          <p className="font-medium">{currentPackage.trackingId}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Tag className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="font-medium">{currentPackage.category}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Weight className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Weight</p>
                          <p className="font-medium">{currentPackage.weight} kg</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Current Location</p>
                          <p className="font-medium">{currentPackage.location}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Truck className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Arrival</p>
                          <p className="font-medium">{formatDate(currentPackage.eta)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Created On</p>
                          <p className="font-medium">{formatDateTime(currentPackage.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Recipient Information */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Recipient Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Recipient Name</p>
                        <p className="font-medium">{currentPackage.recipientName || 'Not specified'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Recipient Contact</p>
                        <p className="font-medium">{currentPackage.recipientContact || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div className="w-full md:w-1/3">
                {/* Package Status Timeline */}
                <GlassCard className="p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Package Status
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-3 h-3 rounded-full mt-1",
                          currentPackage.status === "processing" ? "bg-blue-500" : "bg-gray-300"
                        )}></div>
                        <div className="w-px h-8 bg-gray-200 my-1"></div>
                      </div>
                      <div>
                        <p className="font-medium">Processing</p>
                        <p className="text-sm text-muted-foreground">
                          {currentPackage.status === "processing" ? 
                            `Currently processing - ${formatDateTime(currentPackage.lastUpdate)}` : 
                            `Processed on ${formatDateTime(currentPackage.createdAt)}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-3 h-3 rounded-full mt-1",
                          currentPackage.status === "in transit" ? "bg-yellow-500" : 
                          currentPackage.status === "delivered" ? "bg-green-500" : "bg-gray-300"
                        )}></div>
                        <div className="w-px h-8 bg-gray-200 my-1"></div>
                      </div>
                      <div>
                        <p className="font-medium">In Transit</p>
                        <p className="text-sm text-muted-foreground">
                          {currentPackage.status === "in transit" ? 
                            `In transit to ${currentPackage.location} - ${formatDateTime(currentPackage.lastUpdate)}` : 
                            currentPackage.status === "delivered" ? 
                            `Shipped on ${formatDateTime(currentPackage.lastUpdate)}` : 
                            "Not yet shipped"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-3 h-3 rounded-full mt-1",
                          currentPackage.status === "delivered" ? "bg-green-500" : "bg-gray-300"
                        )}></div>
                      </div>
                      <div>
                        <p className="font-medium">Delivered</p>
                        <p className="text-sm text-muted-foreground">
                          {currentPackage.status === "delivered" ? 
                            `Delivered on ${formatDateTime(currentPackage.lastUpdate)}` : 
                            `Estimated delivery: ${formatDate(currentPackage.eta)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Actions */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full" variant="outline"
                      onClick={() => navigate('/track')}
                    >
                      Track Package
                    </Button>
                    <Button className="w-full" variant="outline">Contact Carrier</Button>
                    <Button className="w-full" variant="destructive">Report Issue</Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/owner/dashboard')}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default PackageDetail;