
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome to Advizall CRM.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-neumorph-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Prospects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-green-500">+2 this week</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-neumorph-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-green-500">+1 this week</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-neumorph-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Scheduled Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-blue-500">Next: Today at 3 PM</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-neumorph-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Pending Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-yellow-500">3 invoices unpaid</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-neumorph-sm">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <div className="text-sm">
                    <span className="font-medium">ABC Corp</span> converted from prospect to client
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <div className="text-sm">
                    <span className="font-medium">Meeting scheduled</span> with XYZ Inc.
                    <div className="text-xs text-gray-500">Yesterday at 4:30 PM</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <div className="text-sm">
                    <span className="font-medium">New prospect added:</span> Tech Solutions LLC
                    <div className="text-xs text-gray-500">2 days ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-neumorph-sm">
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Strategy Call: ABC Corp</h4>
                    <p className="text-sm text-gray-500">Today, 3:00 PM - 4:00 PM</p>
                  </div>
                  <Button variant="outline" size="sm">Join</Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Project Review: XYZ Inc</h4>
                    <p className="text-sm text-gray-500">Tomorrow, 10:00 AM - 11:00 AM</p>
                  </div>
                  <Button variant="outline" size="sm">Join</Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Onboarding: New Client</h4>
                    <p className="text-sm text-gray-500">May 2, 1:00 PM - 2:00 PM</p>
                  </div>
                  <Button variant="outline" size="sm">Join</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
