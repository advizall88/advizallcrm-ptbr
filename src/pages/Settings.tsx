import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  UserCog, 
  ShieldCheck, 
  Calendar, 
  Mail, 
  Database, 
  RefreshCw, 
  Download, 
  Upload, 
  Bell, 
  Moon, 
  Sun, 
  Languages, 
  Globe, 
  Clock,
  CalendarRange,
  LifeBuoy,
  CloudUpload,
  Monitor
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const Settings = () => {
  const { toast } = useToast();
  const { user, isUserRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [meetingReminders, setMeetingReminders] = useState(true);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Form data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    bio: '',
    avatar: '',
  });
  
  const [integrationData, setIntegrationData] = useState({
    calendarApiKey: '******************', // Masked by default
    calendarEmail: 'meetings@advizall.com',
    emailApiKey: '******************',
    emailFromName: 'Advizall CRM',
    emailFromAddress: 'notifications@advizall.com',
    webhookUrl: `https://api.n8n.advizall.com/webhook/${uuidv4().slice(0, 8)}`,
  });
  
  // Handle profile update
  const handleUpdateProfile = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    }, 1000);
  };
  
  // Handle theme toggle
  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
    // In a real implementation, you would update the theme here
    toast({
      title: `${!darkMode ? "Dark" : "Light"} Mode Activated`,
      description: "Your theme preference has been updated.",
    });
  };
  
  // Handle backup
  const handleBackup = () => {
    setBackupInProgress(true);
    
    // Simulate backup process
    setTimeout(() => {
      setBackupInProgress(false);
      toast({
        title: "Backup Complete",
        description: "Database backup has been completed successfully.",
      });
    }, 2000);
  };
  
  // Handle restore
  const handleRestore = () => {
    setRestoreInProgress(true);
    
    // Simulate restore process
    setTimeout(() => {
      setRestoreInProgress(false);
      toast({
        title: "Restore Complete",
        description: "Database has been restored successfully.",
      });
    }, 3000);
  };
  
  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin':
        return "bg-red-500 hover:bg-red-600";
      case 'moderator':
        return "bg-amber-500 hover:bg-amber-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };
  
  return (
    <AppLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:grid-cols-5 h-auto">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="app" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span>App Settings</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4" />
              <span>Integrations</span>
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2"
              disabled={!isUserRole('admin')}
            >
              <UserCog className="h-4 w-4" />
              <span>Users & Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Backup & Restore</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">User Profile</CardTitle>
                <CardDescription>
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={profileData.name} 
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={profileData.email} 
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label>Role</Label>
                  <div>
                    <Badge className={getRoleBadgeColor(profileData.role)}>
                      {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                    </Badge>
                    <p className="mt-2 text-sm text-gray-500">
                      {profileData.role === 'admin' 
                        ? 'Full access to all features and settings'
                        : profileData.role === 'moderator'
                        ? 'Can manage clients and view credentials'
                        : 'Basic access to assigned prospects and clients'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about yourself"
                    value={profileData.bio} 
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
                <Button 
                  onClick={handleUpdateProfile} 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* App Settings Tab */}
          <TabsContent value="app" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">App Settings</CardTitle>
                <CardDescription>
                  Configure application preferences and notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Appearance</h3>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="theme">Dark Mode</Label>
                      <p className="text-sm text-gray-500">Use dark theme for the application</p>
                    </div>
                    <div className="flex items-center">
                      <Sun className="h-5 w-5 mr-2 text-gray-500" />
                      <Switch 
                        id="theme"
                        checked={darkMode}
                        onCheckedChange={handleToggleTheme}
                      />
                      <Moon className="h-5 w-5 ml-2 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="language">Language</Label>
                      <p className="text-sm text-gray-500">Choose your preferred language</p>
                    </div>
                    <div className="flex items-center">
                      <select 
                        id="language"
                        className="flex h-10 w-40 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="en-US">English (US)</option>
                        <option value="pt-BR">Portuguese (BR)</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="timezone">Time Zone</Label>
                      <p className="text-sm text-gray-500">Select your local time zone</p>
                    </div>
                    <div className="flex items-center">
                      <select 
                        id="timezone"
                        className="flex h-10 w-60 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="America/Chicago">America/Chicago (UTC-06:00)</option>
                        <option value="America/New_York">America/New_York (UTC-05:00)</option>
                        <option value="America/Los_Angeles">America/Los_Angeles (UTC-08:00)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Browser Notifications</Label>
                      <p className="text-sm text-gray-500">Receive browser push notifications</p>
                    </div>
                    <Switch 
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="meeting-reminders">Meeting Reminders</Label>
                      <p className="text-sm text-gray-500">Get reminded about upcoming meetings</p>
                    </div>
                    <Switch 
                      id="meeting-reminders"
                      checked={meetingReminders}
                      onCheckedChange={setMeetingReminders}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => {
                  toast({
                    title: "Settings Saved",
                    description: "Your app settings have been updated successfully.",
                  });
                }}>
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Google Calendar Integration</CardTitle>
                <CardDescription>
                  Connect with Google Calendar to manage meetings and events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="calendar-api-key">API Key</Label>
                  <div className="flex">
                    <Input 
                      id="calendar-api-key" 
                      type="password"
                      value={integrationData.calendarApiKey} 
                      onChange={(e) => setIntegrationData({...integrationData, calendarApiKey: e.target.value})}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => {
                        setIntegrationData({
                          ...integrationData, 
                          calendarApiKey: integrationData.calendarApiKey === '******************' 
                            ? 'AIzaSyB6KlVjJX0eiJ3URb' 
                            : '******************'
                        });
                      }}
                    >
                      {integrationData.calendarApiKey === '******************' ? 'Show' : 'Hide'}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="calendar-email">Calendar Email</Label>
                  <Input 
                    id="calendar-email" 
                    type="email"
                    value={integrationData.calendarEmail} 
                    onChange={(e) => setIntegrationData({...integrationData, calendarEmail: e.target.value})}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="space-y-0.5">
                    <p className="font-medium">Connection Status</p>
                    <p className="text-sm text-gray-500">Last synced: Today at 10:45 AM</p>
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-600">
                    Connected
                  </Badge>
                </div>
                
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => {
                      toast({
                        title: "Calendar Synced",
                        description: "Google Calendar has been successfully synced.",
                      });
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Email Integration</CardTitle>
                <CardDescription>
                  Configure email service for notifications and client communications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email-api-key">API Key</Label>
                  <div className="flex">
                    <Input 
                      id="email-api-key" 
                      type="password"
                      value={integrationData.emailApiKey} 
                      onChange={(e) => setIntegrationData({...integrationData, emailApiKey: e.target.value})}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => {
                        setIntegrationData({
                          ...integrationData, 
                          emailApiKey: integrationData.emailApiKey === '******************' 
                            ? 'SG.pU2XxVfLSJm5KZ23q1' 
                            : '******************'
                        });
                      }}
                    >
                      {integrationData.emailApiKey === '******************' ? 'Show' : 'Hide'}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input 
                    id="from-name" 
                    value={integrationData.emailFromName} 
                    onChange={(e) => setIntegrationData({...integrationData, emailFromName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input 
                    id="from-email" 
                    type="email"
                    value={integrationData.emailFromAddress} 
                    onChange={(e) => setIntegrationData({...integrationData, emailFromAddress: e.target.value})}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="space-y-0.5">
                    <p className="font-medium">Service Provider</p>
                    <p className="text-sm text-gray-500">Using SendGrid for email delivery</p>
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-600">
                    Connected
                  </Badge>
                </div>
                
                <div className="mt-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Test Email Sent",
                        description: "Check your inbox for the test email.",
                      });
                    }}
                  >
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Webhook Configuration</CardTitle>
                <CardDescription>
                  Manage webhooks for n8n automation workflows
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <div className="flex">
                    <Input 
                      id="webhook-url" 
                      value={integrationData.webhookUrl} 
                      onChange={(e) => setIntegrationData({...integrationData, webhookUrl: e.target.value})}
                      className="flex-1"
                      readOnly
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => {
                        navigator.clipboard.writeText(integrationData.webhookUrl);
                        toast({
                          title: "URL Copied",
                          description: "Webhook URL has been copied to clipboard.",
                        });
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Use this URL in your n8n workflow to receive webhook events
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="space-y-0.5">
                    <p className="font-medium">Webhook Events</p>
                    <div className="flex gap-2 flex-wrap mt-2">
                      <Badge className="bg-blue-500">meeting.created</Badge>
                      <Badge className="bg-blue-500">meeting.updated</Badge>
                      <Badge className="bg-blue-500">client.converted</Badge>
                      <Badge className="bg-blue-500">prospect.updated</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIntegrationData({
                        ...integrationData,
                        webhookUrl: `https://api.n8n.advizall.com/webhook/${uuidv4().slice(0, 8)}`
                      });
                      toast({
                        title: "Webhook Regenerated",
                        description: "A new webhook URL has been generated.",
                      });
                    }}
                  >
                    Regenerate Webhook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Users & Permissions Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">User Management</CardTitle>
                <CardDescription>
                  Manage users and assign roles (Admin access only)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isUserRole('admin') ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      This section allows you to manage users and their permissions.
                      You can add new users, edit existing ones, and assign appropriate roles.
                    </p>
                    
                    <div className="rounded-md border">
                      <div className="p-4 font-medium bg-slate-50">
                        Registered Users
                      </div>
                      <div className="p-4">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left pb-2">Name</th>
                              <th className="text-left pb-2">Email</th>
                              <th className="text-left pb-2">Role</th>
                              <th className="text-right pb-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-3">Admin User</td>
                              <td className="py-3">admin@advizall.com</td>
                              <td className="py-3">
                                <Badge className="bg-red-500">Admin</Badge>
                              </td>
                              <td className="py-3 text-right">
                                <Button variant="ghost" size="sm">Edit</Button>
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3">John Doe</td>
                              <td className="py-3">john@advizall.com</td>
                              <td className="py-3">
                                <Badge className="bg-amber-500">Moderator</Badge>
                              </td>
                              <td className="py-3 text-right">
                                <Button variant="ghost" size="sm">Edit</Button>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-3">Jane Smith</td>
                              <td className="py-3">jane@advizall.com</td>
                              <td className="py-3">
                                <Badge className="bg-blue-500">User</Badge>
                              </td>
                              <td className="py-3 text-right">
                                <Button variant="ghost" size="sm">Edit</Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        className="flex items-center"
                        onClick={() => {
                          toast({
                            title: "Feature Coming Soon",
                            description: "User management will be available in the next update.",
                          });
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Add New User
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <ShieldCheck className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium">Admin Access Required</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-md">
                      You need administrator privileges to access user management. 
                      Please contact your system administrator for assistance.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Backup & Restore Tab */}
          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Backup & Restore</CardTitle>
                <CardDescription>
                  Manage database backups and restoration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Database Backup</h3>
                  <Separator />
                  
                  <p className="text-sm text-gray-500">
                    Create a backup of your entire database. This includes all prospects, clients, 
                    projects, credentials, and other data stored in the system.
                  </p>
                  
                  <div className="rounded-md border p-4 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Last Backup</p>
                        <p className="text-sm text-gray-500">April 30, 2024 at 09:15 AM</p>
                      </div>
                      <Badge className="bg-green-500">Successful</Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="default"
                      className="flex items-center"
                      onClick={handleBackup}
                      disabled={backupInProgress}
                    >
                      {backupInProgress ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Creating Backup...
                        </>
                      ) : (
                        <>
                          <CloudUpload className="h-4 w-4 mr-2" />
                          Create Backup
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex items-center"
                      onClick={() => {
                        toast({
                          title: "Backup Downloaded",
                          description: "Your database backup has been downloaded.",
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Latest
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4 mt-8">
                  <h3 className="text-lg font-medium">Database Restore</h3>
                  <Separator />
                  
                  <p className="text-sm text-gray-500">
                    Restore your database from a previous backup. This will replace all current data
                    with the data from the selected backup.
                  </p>
                  
                  <div className="rounded-md border p-4 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Available Backups</p>
                        <div className="mt-2">
                          <select 
                            className="flex h-10 w-full md:w-80 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="apr-30-2024">April 30, 2024 (09:15 AM)</option>
                            <option value="apr-29-2024">April 29, 2024 (10:30 PM)</option>
                            <option value="apr-28-2024">April 28, 2024 (11:45 AM)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive"
                      className="flex items-center"
                      onClick={handleRestore}
                      disabled={restoreInProgress}
                    >
                      {restoreInProgress ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Restoring...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Restore Selected Backup
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex items-center"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.json,.sql';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            toast({
                              title: "Backup Uploaded",
                              description: `File '${file.name}' has been uploaded.`,
                            });
                          }
                        };
                        input.click();
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Backup File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Help & Support</CardTitle>
                <CardDescription>
                  Access resources and support for Advizall CRM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <LifeBuoy className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Documentation
                  </Button>
                </div>
                
                <div className="rounded-md border p-4 bg-slate-50">
                  <p className="font-medium">System Information</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-500">App Version:</span> 1.0.0
                    </div>
                    <div>
                      <span className="text-gray-500">Database:</span> Supabase
                    </div>
                    <div>
                      <span className="text-gray-500">Last Update:</span> April 30, 2024
                    </div>
                    <div>
                      <span className="text-gray-500">Environment:</span> Production
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings; 