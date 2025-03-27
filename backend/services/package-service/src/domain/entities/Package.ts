
export type PackageStatus = 'processing' | 'in transit' | 'delivered' | 'cancelled';

export interface Package {
  id?: string;
  name: string;
  description: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    length: number;
  };
  ownerId: string;
  recipientName: string;
  recipientAddress: string;
  recipientContact: string;
  status: PackageStatus;
  location?: string;
  trackingId: string;
  eta?: Date;
  category?: string;
  images?: string[];
  progress?: number;
  lastUpdate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
