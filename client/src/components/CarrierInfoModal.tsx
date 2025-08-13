import React, { useState, useEffect } from 'react';
import { userApi } from '@/services/api';
import { DriverInfo, CarrierInfoModalProps } from '@/types/driver';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Star,
  Truck,
  MapPin,
  Clock,
  X,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const CarrierInfoModal: React.FC<CarrierInfoModalProps> = ({
  isOpen,
  onClose,
  packageId,
  packageInfo
}) => {
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && packageId) {
      fetchDriverInfo();
    }
  }, [isOpen, packageId]);

  const fetchDriverInfo = async () => {
    if (!packageId) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await userApi.getDriverInfoForPackage(packageId);
      setDriverInfo(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load carrier information';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallDriver = () => {
    if ((driverInfo as any)?.phone) {
      window.location.href = `tel:${(driverInfo as any).phone}`;
    } else {
      toast({
        title: "Phone Number Not Available",
        description: "This driver's phone number is not available for contact.",
        variant: "default",
      });
    }
  };

  const handleEmailDriver = () => {
    if (driverInfo?.email) {
      window.location.href = `mailto:${driverInfo.email}?subject=Package Delivery Inquiry - ${packageInfo?.trackingId}`;
    } else {
      toast({
        title: "Email Not Available",
        description: "This driver's email is not available for contact.",
        variant: "default",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Carrier Information</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Carrier Information</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchDriverInfo} variant="outline">
                Try Again
              </Button>
            </div>
          ) : driverInfo ? (
            <div className="space-y-6">
              {/* Driver Profile Section */}
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  {driverInfo.profilePicture ? (
                    <img
                      src={driverInfo.profilePicture}
                      alt={driverInfo.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{driverInfo.name}</h3>
                  <p className="text-sm text-gray-600">Professional Delivery Driver</p>
                  <div className="flex items-center mt-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full mr-2",
                      driverInfo.status === 'active' ? 'bg-green-500' :
                      driverInfo.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                    )} />
                    <span className="text-sm text-gray-600 capitalize">{driverInfo.status}</span>
                  </div>
                </div>
              </div>

              {/* Package Context */}
              {packageInfo && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Your Package</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Tracking ID:</strong> {packageInfo.trackingId}</p>
                    <p><strong>Status:</strong> <span className="capitalize">{packageInfo.status}</span></p>
                    {packageInfo.estimatedDelivery && (
                      <p><strong>Estimated Delivery:</strong> {format(new Date(packageInfo.estimatedDelivery), 'MMM d, yyyy HH:mm')}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Driver Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{driverInfo.email}</span>
                    </div>
                    {(driverInfo as any).phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{(driverInfo as any).phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Member since {format(new Date(driverInfo.createdAt), 'MMM yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Driver Stats */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800">Driver Stats</h4>
                  <div className="space-y-2">
                    {(driverInfo as any).rating && (
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">{(driverInfo as any).rating}/5.0 Rating</span>
                      </div>
                    )}
                    {(driverInfo as any).totalDeliveries && (
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{(driverInfo as any).totalDeliveries} Deliveries Completed</span>
                      </div>
                    )}
                    {(driverInfo as any).yearsOfExperience && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{(driverInfo as any).yearsOfExperience} Years Experience</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              {(driverInfo as any).vehicleInfo && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Vehicle Information</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Type:</strong> {(driverInfo as any).vehicleInfo.type}</p>
                    {(driverInfo as any).vehicleInfo.model && (
                      <p><strong>Model:</strong> {(driverInfo as any).vehicleInfo.model}</p>
                    )}
                    {(driverInfo as any).vehicleInfo.licensePlate && (
                      <p><strong>License Plate:</strong> {(driverInfo as any).vehicleInfo.licensePlate}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Current Location */}
              {(driverInfo as any).currentLocation && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-800 font-medium">Current Location</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{(driverInfo as any).currentLocation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                {(driverInfo as any).phone && (
                  <Button onClick={handleCallDriver} className="flex items-center justify-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Call Driver</span>
                  </Button>
                )}
                <Button onClick={handleEmailDriver} variant="outline" className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Send Email</span>
                </Button>
                <Button onClick={onClose} variant="outline" className="flex items-center justify-center">
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Carrier Information Available</h3>
              <p className="text-gray-600 mb-4">This package doesn't have an assigned carrier yet.</p>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarrierInfoModal;