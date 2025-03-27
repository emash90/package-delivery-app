
import React from 'react';
import { useParams } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  Truck, 
  ChevronRight,
  Info,
  Weight,
  Ruler,
  Tag,
  FileText,
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

// Mock package data with images
const packageData = {
  id: "PKG-12345",
  name: "Electronics Package",
  description: "A fragile electronics shipment containing a new laptop and accessories",
  status: "In transit",
  category: "Electronics",
  location: "Distribution Center",
  eta: "Oct 27, 2023",
  lastUpdate: "3 hours ago",
  progress: 65,
  weight: 3.5,
  dimensions: "45cm x 35cm x 15cm",
  specialInstructions: "Handle with care. Fragile electronics inside.",
  createdAt: "Oct 15, 2023",
  images: [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ],
  sender: {
    name: "John Doe",
    address: "123 Main St, New York, NY 10001",
    phone: "+1 (555) 123-4567"
  },
  recipient: {
    name: "Jane Smith",
    address: "456 Elm St, San Francisco, CA 94107",
    phone: "+1 (555) 987-6543"
  }
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in transit':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'out for delivery':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <span className={cn("px-3 py-1 text-xs font-medium border rounded-full", getStatusColor(status))}>
      {status}
    </span>
  );
};

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  // In a real app, we would fetch package data based on the ID
  // const { data: packageData, isLoading } = useQuery(...)

  // For this example, we'll just use our mock data
  const pkg = packageData;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left side - Package images and details */}
              <div className="w-full md:w-2/3">
                {/* Package images carousel */}
                <GlassCard className="p-6 mb-6">
                  <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
                    <Package className="h-6 w-6 text-primary" />
                    {pkg.name}
                  </h2>
                  
                  <div className="mb-6">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {pkg.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                                <img 
                                  src={image} 
                                  alt={`Package ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </Carousel>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      Package ID: <span className="font-medium text-foreground">{pkg.id}</span>
                    </p>
                    <StatusBadge status={pkg.status} />
                  </div>
                  
                  <p className="text-base mb-6">{pkg.description}</p>
                  
                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Shipping Progress</span>
                      <span>{pkg.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          pkg.status === "Delivered" ? "bg-green-500" :
                          pkg.status === "Out for delivery" ? "bg-orange-500" :
                          "bg-primary"
                        )}
                        style={{ width: `${pkg.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </GlassCard>
                
                {/* Package details */}
                <GlassCard className="p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Package Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Tag className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="font-medium">{pkg.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Weight className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Weight</p>
                          <p className="font-medium">{pkg.weight} kg</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Ruler className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Dimensions</p>
                          <p className="font-medium">{pkg.dimensions}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Created On</p>
                          <p className="font-medium">{pkg.createdAt}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Last Update</p>
                          <p className="font-medium">{pkg.lastUpdate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Truck className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Arrival</p>
                          <p className="font-medium">{pkg.eta}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {pkg.specialInstructions && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">Special Instructions</p>
                          <p className="text-amber-700">{pkg.specialInstructions}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </div>
              
              {/* Right side - Shipping information and actions */}
              <div className="w-full md:w-1/3">
                {/* Shipping info */}
                <GlassCard className="p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Shipping Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">From</p>
                      <p className="font-medium">{pkg.sender.name}</p>
                      <p className="text-sm">{pkg.sender.address}</p>
                      <p className="text-sm">{pkg.sender.phone}</p>
                    </div>
                    
                    {/* Shipping arrow */}
                    <div className="flex justify-center my-2">
                      <div className="h-8 w-px bg-gray-200"></div>
                    </div>
                    <div className="flex justify-center -mt-2 mb-2">
                      <ChevronRight className="h-5 w-5 rotate-90 text-gray-400" />
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">To</p>
                      <p className="font-medium">{pkg.recipient.name}</p>
                      <p className="text-sm">{pkg.recipient.address}</p>
                      <p className="text-sm">{pkg.recipient.phone}</p>
                    </div>
                  </div>
                </GlassCard>
                
                {/* Actions */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Actions</h3>
                  
                  <div className="space-y-3">
                    <Button className="w-full" variant="outline">Track Package</Button>
                    <Button className="w-full" variant="outline">Contact Carrier</Button>
                    <Button className="w-full" variant="destructive">Report Issue</Button>
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
