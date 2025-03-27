import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { Package, Calendar, FileImage, ArrowRight, Upload, Trash2, User, MapPin, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createPackage } from '@/store/slices/packageSlice';
import { RootState, AppDispatch } from '@/store';
import { useNavigate } from 'react-router-dom';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import GlassCard from "@/components/GlassCard";

// Package categories
const PACKAGE_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Furniture",
  "Food",
  "Toys",
  "Documents",
  "Medical",
  "Other"
];

// Form schema validation
const packageFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  weight: z.number().min(0.1, "Weight must be at least 0.1kg"),
  dimensions: z.object({
    width: z.number().min(0, "Width must be positive").optional(),
    height: z.number().min(0, "Height must be positive").optional(),
    length: z.number().min(0, "Length must be positive").optional(),
  }).optional(),
  recipientName: z.string().min(3, "Recipient name must be at least 3 characters"),
  recipientContact: z.string().min(10, "Contact must be at least 10 characters"),
  location: z.string().optional(),
  eta: z.string().optional(),
});

type PackageFormValues = z.infer<typeof packageFormSchema>;

const CreatePackageForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.packages);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const [packageImages, setPackageImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [weight, setWeight] = useState(1);
  const [trackingId] = useState(generateTrackingId());

  // Initialize form
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      weight: 1,
      dimensions: {
        width: undefined,
        height: undefined,
        length: undefined
      },
      recipientName: "",
      recipientContact: "",
      location: "",
      eta: "",
    },
  });

  // Generate random tracking ID
  function generateTrackingId() {
    return `PKG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      if (packageImages.length + newFiles.length > 3) {
        toast({
          title: "Too many images",
          description: "Maximum 3 images allowed",
          variant: "destructive",
        });
        return;
      }
      
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPackageImages(prev => [...prev, ...newFiles]);
      setImageUrls(prev => [...prev, ...newUrls]);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    URL.revokeObjectURL(imageUrls[index]);
    setPackageImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };


  const onSubmit = async (data: PackageFormValues) => {
    console.log("current", currentUser);
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to create a package",
        variant: "destructive",
      });
      return;
    }
  
    try {
      // 1. Upload images to Cloudinary first
      const cloudinaryUrls = await Promise.all(
        packageImages.map(async (image) => {
          const cloudinaryFormData = new FormData();
          cloudinaryFormData.append('file', image);
          cloudinaryFormData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Replace with your upload preset
          cloudinaryFormData.append('cloud_name', 'YOUR_CLOUD_NAME'); // Replace with your cloud name
  
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, // Replace with your cloud name
            {
              method: 'POST',
              body: cloudinaryFormData,
            }
          );
  
          if (!response.ok) {
            throw new Error('Failed to upload image to Cloudinary');
          }
  
          const result = await response.json();
          return result.secure_url; 
        })
      );
  
      // 2. Prepare package data with Cloudinary URLs
      const packageData = {
        name: data.name,
        description: data.description,
        category: data.category,
        weight: data.weight,
        dimensions: data.dimensions,
        userId: currentUser.id,
        recipientName: data.recipientName,
        recipientContact: data.recipientContact,
        status: "processing",
        location: data.location || "",
        trackingId: trackingId,
        eta: data.eta || "",
        lastUpdate: new Date().toISOString(),
        images: cloudinaryUrls,
      };
  
      await dispatch(createPackage(packageData));
      
      toast({
        title: "Package created!",
        description: `Successfully created package: ${data.name}`,
      });
      
      // Reset form
      form.reset({
        name: "",
        description: "",
        category: "",
        weight: 1,
        dimensions: {
          width: undefined,
          height: undefined,
          length: undefined
        },
        recipientName: "",
        recipientContact: "",
        location: "",
        eta: "",
      })
      setPackageImages([]);
      setImageUrls([]);
      setWeight(1);
      navigate("/owner/dashboard")
    } catch (err) {
      console.error("Error creating package:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create package",
        variant: "destructive",
      });
    }
  };

  return (
    <GlassCard className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Create New Package
        </h2>
        <p className="text-muted-foreground mt-1">
          Fill in the details below to register a new package for shipping
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Package Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Birthday Gift" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PACKAGE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Brief description of your package" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Weight & Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <div className="space-y-2">
                    <Slider
                      min={0.1}
                      max={50}
                      step={0.1}
                      value={[weight]}
                      onValueChange={(value) => {
                        setWeight(value[0]);
                        field.onChange(value[0]);
                      }}
                    />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">0.1kg</span>
                      <span className="font-medium">{weight}kg</span>
                      <span className="text-muted-foreground text-sm">50kg</span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Dimensions (Optional)</h3>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="dimensions.width"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          placeholder="Width (cm)" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dimensions.height"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          placeholder="Height (cm)" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dimensions.length"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          placeholder="Length (cm)" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Recipient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Shipping Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Shipping Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FormLabel>Tracking ID</FormLabel>
                <Input value={trackingId} readOnly />
                <FormDescription>
                  This ID will be used to track your package
                </FormDescription>
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Current location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="eta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Arrival</FormLabel>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                <FileImage className="h-4 w-4" />
                Package Images
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload up to 3 images of your package (optional)
              </p>
            </div>

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="overflow-hidden rounded-md h-32 bg-muted">
                      <img 
                        src={url} 
                        alt={`Package preview ${index + 1}`} 
                        className="w-full h-full object-cover transition-all group-hover:scale-105"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {packageImages.length < 3 && (
              <div className="flex items-center">
                <label htmlFor="packageImages" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-transparent hover:bg-accent text-sm font-medium transition-colors">
                    <Upload className="h-4 w-4" />
                    {packageImages.length === 0 ? "Upload Images" : "Add More Images"}
                  </div>
                  <input
                    id="packageImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-muted-foreground ml-3">
                  {packageImages.length}/3 images
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Package"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>
    </GlassCard>
  );
};

export default CreatePackageForm;