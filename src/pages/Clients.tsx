
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dummyClients = [
  { 
    id: 1, 
    name: "ABC Corporation", 
    industry: "Technology",
    accountManager: "Jane Smith",
    plan: "Premium", 
    monthlyFee: "$2,500",
    adBudget: "$10,000",
    projects: [
      { id: 1, service: "Website", status: "doing", description: "Redesign corporate website", deadline: "June 15" },
      { id: 2, service: "Paid Ads", status: "todo", description: "Google Ads campaign", deadline: "June 20" },
    ],
    credentials: [
      { id: 1, system: "Hosting", login: "admin@abc.com" },
      { id: 2, system: "Domain", login: "registrar@abc.com" },
    ],
    payments: [
      { id: 1, amount: "$2,500", description: "Monthly Retainer - May", date: "May 1, 2025", paid: true },
      { id: 2, amount: "$10,000", description: "Ad Budget - May", date: "May 1, 2025", paid: false },
    ]
  },
  { 
    id: 2, 
    name: "XYZ Inc", 
    industry: "Marketing",
    accountManager: "John Doe",
    plan: "Standard", 
    monthlyFee: "$1,500",
    adBudget: "$5,000",
    projects: [
      { id: 3, service: "Branding", status: "done", description: "Logo redesign", deadline: "Completed" },
      { id: 4, service: "Organic", status: "doing", description: "SEO optimization", deadline: "May 30" },
    ],
    credentials: [
      { id: 3, system: "Facebook", login: "social@xyz.com" },
      { id: 4, system: "Instagram", login: "insta@xyz.com" },
    ],
    payments: [
      { id: 3, amount: "$1,500", description: "Monthly Retainer - May", date: "May 1, 2025", paid: true },
      { id: 4, amount: "$5,000", description: "Ad Budget - May", date: "May 1, 2025", paid: true },
    ]
  },
];

const ClientCard = ({ client }: { client: any }) => {
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  const handleViewDetails = (id: number) => {
    setSelectedClient(id);
  };

  return (
    <Card className="mb-4 shadow-neumorph-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg font-bold">{client.name}</CardTitle>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {client.plan}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Industry</p>
            <p className="font-medium">{client.industry}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Manager</p>
            <p className="font-medium">{client.accountManager}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Fee</p>
            <p className="font-medium">{client.monthlyFee}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ad Budget</p>
            <p className="font-medium">{client.adBudget}</p>
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => handleViewDetails(client.id)}
          >
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Schedule Meeting
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ClientDetailTabs = ({ client }: { client: any }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "bg-yellow-100 text-yellow-800";
      case "doing": return "bg-blue-100 text-blue-800";
      case "done": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="credentials">Credentials</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="finance">Finance</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{client.name}</p>
              <p className="text-sm text-gray-500 mt-2">contact@{client.name.toLowerCase().replace(/\s+/g, '')}.com</p>
              <p className="text-sm text-gray-500">+1 (123) 456-7890</p>
              <p className="text-sm text-gray-500 mt-2">123 Business St, Chicago, IL</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Account Manager:</span>
                <span className="font-medium">{client.accountManager}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Plan:</span>
                <span className="font-medium">{client.plan}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Monthly Fee:</span>
                <span className="font-medium">{client.monthlyFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Ad Budget:</span>
                <span className="font-medium">{client.adBudget}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">Schedule Meeting</Button>
              <Button variant="outline" size="sm" className="w-full">Create Invoice</Button>
              <Button variant="outline" size="sm" className="w-full">Add Project</Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="credentials" className="p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Credentials</CardTitle>
              <Button size="sm" variant="secondary">+ Add Credential</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">System</th>
                    <th className="text-left py-2 px-4">Login</th>
                    <th className="text-left py-2 px-4">Password</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {client.credentials.map((cred: any) => (
                    <tr key={cred.id} className="border-b">
                      <td className="py-2 px-4">{cred.system}</td>
                      <td className="py-2 px-4">{cred.login}</td>
                      <td className="py-2 px-4">
                        <Button size="sm" variant="ghost">
                          👁️ Show
                        </Button>
                      </td>
                      <td className="py-2 px-4">
                        <Button size="sm" variant="ghost">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="projects" className="p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Projects</CardTitle>
              <Button size="sm" variant="secondary">+ Add Project</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {client.projects.map((project: any) => (
                <Card key={project.id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md">{project.service}</CardTitle>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{project.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Deadline: {project.deadline}</span>
                      <Button size="sm" variant="outline">Tasks</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="finance" className="p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Payments</CardTitle>
              <Button size="sm" variant="secondary">Create Invoice</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Description</th>
                    <th className="text-left py-2 px-4">Amount</th>
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-left py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {client.payments.map((payment: any) => (
                    <tr key={payment.id} className="border-b">
                      <td className="py-2 px-4">{payment.description}</td>
                      <td className="py-2 px-4">{payment.amount}</td>
                      <td className="py-2 px-4">{payment.date}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${payment.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {payment.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="files" className="p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Files & Documents</CardTitle>
              <Button size="sm" variant="secondary">Upload File</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              No files uploaded yet.
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

const Clients = () => {
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  
  const handleBackToList = () => {
    setSelectedClient(null);
  };
  
  const client = dummyClients.find(c => c.id === selectedClient);
  
  return (
    <AppLayout>
      <div className="space-y-6">
        {selectedClient ? (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  className="mr-2" 
                  onClick={handleBackToList}
                >
                  ← Back
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                  {client?.name}
                </h1>
              </div>
              <Button variant="default" className="bg-secondary hover:bg-secondary/90">
                Convert to Lead
              </Button>
            </div>
            {client && <ClientDetailTabs client={client} />}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
                <p className="text-gray-500">Manage your active client accounts.</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">Filter</Button>
                <Button variant="default" className="bg-secondary hover:bg-secondary/90">
                  + Add Client
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {dummyClients.map((client) => (
                <ClientCard 
                  key={client.id} 
                  client={client} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Clients;
