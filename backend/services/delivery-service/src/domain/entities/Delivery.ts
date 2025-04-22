
export type DeliveryStatus = 'pending' | 'assigned' | 'in transit' | 'delivered' | 'failed';

export interface Delivery {
  id?: string;
  packageId: string;
  driverId?: string;
  ownerId: string;
  status: DeliveryStatus;
  startTime?: Date;
  images?: string[];
  endTime?: Date;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
  notes?: string;
  issue?: string;
  trackingId?: string;
  distance?: number;
  createdAt?: Date;
  updatedAt?: Date;
  lastUpdate?: Date;
}
