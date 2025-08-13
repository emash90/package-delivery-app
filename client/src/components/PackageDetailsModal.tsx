import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import AnimatedButton from './AnimatedButton';
import { FileImage } from 'lucide-react';

interface PackageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: any;
  onStartDelivery?: (delivery: any) => void;
}

const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({
  isOpen,
  onClose,
  delivery,
  onStartDelivery
}) => {
  if (!isOpen || !delivery) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Package Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Package Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Package Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Tracking ID:</span>
                <p className="text-sm text-gray-800">{delivery.trackingId}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Package Name:</span>
                <p className="text-sm text-gray-800">{delivery.packageName || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Weight:</span>
                <p className="text-sm text-gray-800">{delivery.weight ? `${delivery.weight} kg` : 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Category:</span>
                <p className="text-sm text-gray-800">{delivery.category || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-gray-500">Description:</span>
                <p className="text-sm text-gray-800">{delivery.description || 'No description available'}</p>
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Recipient Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <p className="text-sm text-gray-800">{delivery.recipientName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Phone:</span>
                <p className="text-sm text-gray-800">{delivery.recipientPhone}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-gray-500">Address:</span>
                <p className="text-sm text-gray-800">{delivery.recipientAddress}</p>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Delivery Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
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
                <span className="text-sm font-medium text-gray-500">Created:</span>
                <p className="text-sm text-gray-800">
                  {format(new Date(delivery.createdAt), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Estimated Delivery:</span>
                <p className="text-sm text-gray-800">
                  {format(new Date(delivery.estimatedDeliveryTime), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              {delivery.startTime && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Started:</span>
                  <p className="text-sm text-gray-800">
                    {format(new Date(delivery.startTime), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
              )}
              {delivery.completedAt && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Completed:</span>
                  <p className="text-sm text-gray-800">
                    {format(new Date(delivery.completedAt), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Package Images */}
          {delivery.packageImages && delivery.packageImages.length > 0 ? (
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Package Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {delivery.packageImages.map((imageUrl: string, index: number) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={`Package ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => window.open(imageUrl, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : delivery.images && delivery.images.length > 0 ? (
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Package Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {delivery.images.map((imageUrl: string, index: number) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={`Package ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => window.open(imageUrl, '_blank')}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center bg-gray-100">
                      <FileImage className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <AnimatedButton
            size="sm"
            variant="outline"
            onClick={onClose}
            className="text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            Close
          </AnimatedButton>
          {delivery.status === 'pending' && onStartDelivery && (
            <AnimatedButton
              size="sm"
              onClick={() => {
                onClose();
                onStartDelivery(delivery);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Start Delivery
            </AnimatedButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsModal;