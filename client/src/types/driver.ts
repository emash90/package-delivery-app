export interface DriverInfo {
  id: string;
  name: string;
  email: string;
  role: 'driver';
  status: 'active' | 'inactive' | 'busy';
  createdAt: string;
  // Future fields when backend data model is enhanced
  phone?: string;
  profilePicture?: string;
  rating?: number;
  totalDeliveries?: number;
  yearsOfExperience?: number;
  vehicleInfo?: {
    type: string;
    model?: string;
    licensePlate?: string;
  };
  currentLocation?: string;
}

export interface CarrierInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string | null;
  packageInfo?: {
    trackingId: string;
    status: string;
    estimatedDelivery?: string;
  };
}