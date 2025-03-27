
import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import AnimatedButton from '@/components/AnimatedButton';
import { 
  Package,
  Truck,
  Users,
  AlertCircle,
  CheckCircle,
  BarChart4,
  TrendingUp,
  TrendingDown,
  Map,
  Search,
  Calendar,
  Settings,
  FileText,
  Layers,
  User,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for the performance metrics
const performanceData = [
  { day: "M", onTime: 92, late: 8 },
  { day: "T", onTime: 95, late: 5 },
  { day: "W", onTime: 88, late: 12 },
  { day: "T", onTime: 94, late: 6 },
  { day: "F", onTime: 97, late: 3 },
  { day: "S", onTime: 85, late: 15 },
  { day: "S", onTime: 90, late: 10 },
];

// Mock data for recent incidents
const incidents = [
  {
    id: "INC-12345",
    type: "Delivery Delay",
    package: "PKG-67890",
    location: "Downtown Area",
    time: "2 hours ago",
    status: "Resolved",
  },
  {
    id: "INC-23456",
    type: "Damaged Package",
    package: "PKG-54321",
    location: "Sorting Facility",
    time: "5 hours ago",
    status: "Investigating",
  },
  {
    id: "INC-34567",
    type: "Driver Issue",
    package: "Multiple",
    location: "Northern Route",
    time: "1 day ago",
    status: "Resolved",
  },
  {
    id: "INC-45678",
    type: "Customer Complaint",
    package: "PKG-98765",
    location: "Customer Address",
    time: "2 days ago",
    status: "Pending",
  },
];

const AdminDashboard = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-6">
            <header className="mb-10">
              <h1 className="text-3xl font-display font-bold mb-4">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor operations, manage users, and optimize delivery performance.
              </p>
            </header>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { title: "Active Packages", value: "248", change: "+12% ↑", icon: <Package className="h-6 w-6" />, color: "text-blue-500" },
                { title: "Active Drivers", value: "42", change: "+3% ↑", icon: <Truck className="h-6 w-6" />, color: "text-green-500" },
                { title: "Total Users", value: "1,893", change: "+8% ↑", icon: <Users className="h-6 w-6" />, color: "text-purple-500" },
                { title: "Open Issues", value: "6", change: "-2% ↓", icon: <AlertCircle className="h-6 w-6" />, color: "text-orange-500" },
              ].map((stat, index) => (
                <GlassCard key={index} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-3 rounded-full", `${stat.color}/10`)}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      stat.change.includes("↑") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                </GlassCard>
              ))}
            </div>
            
            {/* Charts and Maps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Delivery Performance Chart */}
              <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-primary" />
                    Delivery Performance
                  </h2>
                  <select className="px-2 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                  </select>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>On-time vs Delayed Deliveries</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-primary/70 rounded-sm"></div>
                        <span>On-time</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
                        <span>Delayed</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[240px] flex items-end justify-between gap-3">
                    {performanceData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="flex flex-col w-full h-full">
                          <div 
                            className="w-full bg-orange-400 rounded-t-sm"
                            style={{ height: `${data.late * 2}%` }}
                          ></div>
                          <div 
                            className="w-full bg-primary/70 rounded-b-sm"
                            style={{ height: `${data.onTime * 2}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground mt-2">{data.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Average Time</span>
                    </div>
                    <p className="text-2xl font-semibold mt-2">18.5 min</p>
                    <p className="text-xs text-muted-foreground mt-1">-2.3% from last week</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Success Rate</span>
                    </div>
                    <p className="text-2xl font-semibold mt-2">96.8%</p>
                    <p className="text-xs text-muted-foreground mt-1">+1.2% from last week</p>
                  </div>
                </div>
              </GlassCard>
              
              {/* Live Map */}
              <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />
                    Live Operations Map
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs">42 Drivers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-xs">103 Active Deliveries</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg overflow-hidden h-[330px] bg-gray-100 relative">
                  {/* This would be your live map component */}
                  <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Map className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Interactive map would load here</p>
                      <p className="text-sm">Showing real-time delivery operations</p>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 right-4">
                    <AnimatedButton size="sm" className="bg-white/90 text-foreground hover:bg-white">
                      Full Screen
                    </AnimatedButton>
                  </div>
                </div>
              </GlassCard>
            </div>
            
            {/* Issues and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              {/* Recent Incidents */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Recent Incidents</h2>
                  <AnimatedButton size="sm" variant="outline" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    View All
                  </AnimatedButton>
                </div>
                
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <GlassCard key={incident.id} className="p-4 hover:shadow-md transition-all-300 hover:border-primary/20 border border-transparent">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="md:w-[60%]">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              incident.status === "Resolved" ? "bg-green-100 text-green-700" :
                              incident.status === "Investigating" ? "bg-blue-100 text-blue-700" :
                              "bg-orange-100 text-orange-700"
                            )}>
                              {incident.status}
                            </span>
                            <span className="text-xs text-muted-foreground">{incident.id}</span>
                          </div>
                          <h3 className="font-medium">{incident.type}</h3>
                          <p className="text-sm text-muted-foreground mt-1">Package: {incident.package}</p>
                        </div>
                        
                        <div className="md:w-[40%] flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{incident.location}</p>
                            <p className="text-xs text-muted-foreground">{incident.time}</p>
                          </div>
                          
                          <AnimatedButton size="sm" variant="outline" className="mt-2 md:mt-0">
                            Details
                          </AnimatedButton>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div>
                <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: "Generate Reports", icon: <FileText className="h-5 w-5" /> },
                    { title: "Manage Users", icon: <Users className="h-5 w-5" /> },
                    { title: "System Settings", icon: <Settings className="h-5 w-5" /> },
                    { title: "Schedule", icon: <Calendar className="h-5 w-5" /> },
                    { title: "Inventory", icon: <Layers className="h-5 w-5" /> },
                    { title: "Notifications", icon: <Bell className="h-5 w-5" /> },
                  ].map((action, index) => (
                    <GlassCard key={index} className="p-4 hover-scale cursor-pointer">
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <div className="text-primary">{action.icon}</div>
                        </div>
                        <span className="text-sm font-medium">{action.title}</span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
                
                {/* Today's Summary */}
                <div className="mt-6">
                  <GlassCard className="p-5">
                    <h3 className="font-medium mb-4">Today's Summary</h3>
                    <div className="space-y-3">
                      {[
                        { label: "New Users", value: "12", icon: <User className="h-4 w-4 text-blue-500" /> },
                        { label: "Packages Delivered", value: "87", icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
                        { label: "Revenue", value: "$8,254", icon: <TrendingUp className="h-4 w-4 text-green-500" /> },
                        { label: "Customer Issues", value: "3", icon: <TrendingDown className="h-4 w-4 text-orange-500" /> },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <span className="text-sm">{item.label}</span>
                          </div>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
