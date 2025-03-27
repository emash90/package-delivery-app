
import React from 'react';
import { Package, MapPin, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/GlassCard';
import { cn } from '@/lib/utils';
import { Package as PackageType } from '@/store/slices/packageSlice';

interface AvailablePackagesTableProps {
  packages: PackageType[];
  onPackageSelect: (packageId: string) => void;
}

const AvailablePackagesTable: React.FC<AvailablePackagesTableProps> = ({ 
  packages = [], 
  onPackageSelect 
}) => {
  if (packages.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-xl font-medium mb-2">No packages available</h3>
        <p className="text-muted-foreground">Check back later for new delivery opportunities</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <GlassCard key={pkg.id} className="p-5 hover:shadow-md transition-all duration-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="md:w-[20%]">
              {pkg.images && pkg.images.length > 0 ? (
                <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src={pkg.images[0].url} 
                    alt={pkg.name} 
                    className="object-cover h-full w-full"
                  />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-md bg-gray-100 flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="md:w-[40%]">
              <p className="text-sm font-medium text-muted-foreground mb-1">{pkg.id}</p>
              <h3 className="font-medium text-lg">{pkg.name}</h3>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  pkg.status === "Available" ? "bg-green-500" : "bg-orange-500"
                )} />
                <span>{pkg.status}</span>
              </div>
            </div>
            
            <div className="md:w-[40%] flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{pkg.location}</span>
                </div>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{pkg.eta}</span>
                </div>
              </div>
              
              <Button 
                className="mt-3 md:mt-0"
                onClick={() => onPackageSelect(pkg.id)}
              >
                <span className="mr-1">View Details</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default AvailablePackagesTable;
