
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { packageApi } from '@/services/api';
import BackButton from '@/components/BackButton';

// Schema for tracking form validation
const trackingFormSchema = z.object({
  trackingId: z.string().min(5, {
    message: "Tracking ID must be at least 5 characters."
  })
});

type TrackingFormValues = z.infer<typeof trackingFormSchema>;

const TrackPackage = () => {
  const [trackingId, setTrackingId] = useState<string | null>(null);
  
  // Setup form
  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingFormSchema),
    defaultValues: {
      trackingId: '',
    },
  });

  // Package tracking query
  const { data: packageData, isLoading, error, refetch } = useQuery({
    queryKey: ['package', trackingId],
    queryFn: () => trackingId ? packageApi.trackById(trackingId) : null,
    enabled: !!trackingId,
  });

  // Handle form submission
  const onSubmit = (values: TrackingFormValues) => {
    setTrackingId(values.trackingId);
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500';
      case 'in transit':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 10;
      case 'in transit':
        return 50;
      case 'out for delivery':
        return 75;
      case 'delivered':
        return 100;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };


  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <BackButton />
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Track Your Package</h1>
                <p className="text-muted-foreground">
                  Enter your tracking ID to get real-time updates on your package status.
                </p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Package Tracker</CardTitle>
                  <CardDescription>
                    Enter the tracking ID provided in your confirmation email.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="trackingId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tracking ID</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input placeholder="Enter tracking ID" {...field} />
                              </FormControl>
                              <Button type="submit">
                                <Search className="mr-2 h-4 w-4" />
                                Track
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                  
                  {trackingId && (
                    <div className="mt-8">
                      <Separator className="my-4" />
                      
                      {isLoading && (
                        <div className="space-y-4">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-24 w-full" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      )}
                      
                      {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-md">
                          <p className="font-medium">Package not found</p>
                          <p className="text-sm">
                            We couldn't find a package with the tracking ID: {trackingId}. 
                            Please check the ID and try again.
                          </p>
                        </div>
                      )}
                      
                      {packageData && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{packageData.name}</h3>
                            <Badge className={getStatusColor(packageData.status)}>
                              {packageData.status}
                            </Badge>
                          </div>
                          
                          <div className="grid gap-2">
                            <div className="grid grid-cols-3 text-sm border-b pb-2">
                              <span className="font-medium">Current Location</span>
                              <span className="col-span-2">{packageData.location}</span>
                            </div>
                            
                            <div className="grid grid-cols-3 text-sm border-b pb-2">
                              <span className="font-medium">Estimated Arrival</span>
                              <span className="col-span-2">{packageData.eta}</span>
                            </div>
                            
                            <div className="grid grid-cols-3 text-sm border-b pb-2">
                              <span className="font-medium">Last Update</span>
                              <span className="col-span-2">{packageData.lastUpdate}</span>
                            </div>
                            
                            {packageData.recipientName && (
                              <div className="grid grid-cols-3 text-sm border-b pb-2">
                                <span className="font-medium">Recipient</span>
                                <span className="col-span-2">{packageData.recipientName}</span>
                              </div>
                            )}
                            
                            {packageData.category && (
                              <div className="grid grid-cols-3 text-sm border-b pb-2">
                                <span className="font-medium">Category</span>
                                <span className="col-span-2">{packageData.category}</span>
                              </div>
                            )}
                            
                            {packageData.weight && (
                              <div className="grid grid-cols-3 text-sm border-b pb-2">
                                <span className="font-medium">Weight</span>
                                <span className="col-span-2">{packageData.weight} kg</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="pt-2">
                            <h4 className="text-sm font-medium mb-2">Delivery Progress</h4>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${getProgressPercentage(packageData.status)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>Preparing</span>
                              <span>In Transit</span>
                              <span>Delivered</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default TrackPackage;
