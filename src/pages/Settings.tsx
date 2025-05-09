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
  User as UserIcon,
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
  Monitor,
  Trash2,
  UserPlus,
  Check,
  X,
  Edit,
  Shield,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { userService, UserFormData } from "@/services/userService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { User } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";

// Define UserRole type directly in this file
type UserRole = 'user' | 'moderator' | 'admin';

const Settings = () => {
  const { toast } = useToast();
  const { user, isUserRole, signOut, updateUserData } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [meetingReminders, setMeetingReminders] = useState(true);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<{
    name: string;
    email: string;
    role: UserRole;
  }>({
    name: '',
    email: '',
    role: 'user',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Adicionar este useEffect após o useEffect de verificação de login
  useEffect(() => {
    if (user) {
      // Atualiza os dados do formulário quando o usuário mudar
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        bio: user.bio || '',
        avatar_url: user.avatar_url || '',
        phone: user.phone || '',
        title: user.title || '',
        department: user.department || '',
      });
    }
  }, [user]);
  
  // Form data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    bio: user?.bio || '',
    avatar_url: user?.avatar_url || '',
    phone: user?.phone || '',
    title: user?.title || '',
    department: user?.department || '',
  });
  
  const [integrationData, setIntegrationData] = useState({
    calendarApiKey: '******************', // Masked by default
    calendarEmail: 'meetings@advizall.com',
    emailApiKey: '******************',
    emailFromName: 'Advizall CRM',
    emailFromAddress: 'notifications@advizall.com',
    webhookUrl: `https://api.n8n.advizall.com/webhook/${uuidv4().slice(0, 8)}`,
  });
  
  // Load users on init if admin
  useEffect(() => {
    if (isUserRole('admin')) {
      fetchUsers();
    }
  }, [isUserRole]);
  
  // Fetch users
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };
  
  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      // Update user in the database
      const updatedUser = await userService.updateUser(user.id, {
        name: profileData.name,
        email: profileData.email,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url,
        phone: profileData.phone,
        title: profileData.title,
        department: profileData.department,
      });
      
      // Atualiza o contexto de autenticação com os novos dados
      updateUserData(updatedUser);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Handle theme toggle
  const handleToggleTheme = () => {
    toggleDarkMode();
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
  
  // User management functions
  const handleOpenUserForm = (edit = false, user: User | null = null) => {
    setIsEditMode(edit);
    setSelectedUser(user);
    
    if (edit && user) {
      setUserFormData({
        name: user.name || '',
        email: user.email,
        role: user.role as UserRole,
      });
    } else {
      // Reset form for new user
      setUserFormData({
        name: '',
        email: '',
        role: 'user',
      });
    }
    
    setUserFormOpen(true);
  };
  
  const handleCloseUserForm = () => {
    setUserFormOpen(false);
    setSelectedUser(null);
    setIsEditMode(false);
  };
  
  const handleUserFormSubmit = async () => {
    // Validation
    if (!userFormData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a name for the user.",
        variant: "destructive",
      });
      return;
    }

    if (!isEditMode && !userFormData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an email address for the user.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      if (isEditMode && selectedUser) {
        // Update existing user
        await userService.updateUser(selectedUser.id, {
          name: userFormData.name,
          role: userFormData.role,
        });
        
        toast({
          title: "User Updated",
          description: `User ${userFormData.name} has been updated successfully.`,
        });
      } else {
        // Create new user with the required fields for UserFormData
        const newUserData = {
          name: userFormData.name,
          email: userFormData.email,
          role: userFormData.role,
        };
        
        await userService.createUser(newUserData as UserFormData);
        
        toast({
          title: "User Created",
          description: "User has been created successfully. A password reset email has been sent to the user.",
        });
      }
      
      // Refresh users list
      fetchUsers();
      handleCloseUserForm();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await userService.deleteUser(userToDelete.id);
      
      toast({
        title: "User Deleted",
        description: `User ${userToDelete.name || userToDelete.email} has been deleted.`,
      });
      
      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };
  
  const handleResetPassword = async (email: string) => {
    try {
      await userService.resetPassword(email);
      
      toast({
        title: "Password Reset Email Sent",
        description: `A password reset link has been sent to ${email}.`,
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
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
              <UserIcon className="h-4 w-4" />
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
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-24 h-24 rounded-full bg-gray-200 border flex items-center justify-center overflow-hidden">
                      {profileData.avatar_url ? (
                        <img 
                          src={profileData.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => setAvatarDialogOpen(true)}
                    >
                      <CloudUpload className="h-3 w-3 mr-1" />
                      Change Avatar
                    </Button>
                  </div>
                  
                  <div className="space-y-4 flex-1">
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
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      value={profileData.phone} 
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="title">Job Title</Label>
                    <Input 
                      id="title" 
                      value={profileData.title} 
                      onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                      placeholder="e.g. Marketing Manager"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department" 
                      value={profileData.department} 
                      onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                      placeholder="e.g. Marketing"
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
                </div>
                
                <div className="space-y-1 pt-2">
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
                <Button variant="outline" onClick={() => signOut(navigate)}>
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
                    
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Registered Users</h3>
                      <Button 
                        className="flex items-center"
                        onClick={() => handleOpenUserForm()}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add New User
                      </Button>
                    </div>
                    
                    <div className="rounded-md border">
                      <div className="p-4 font-medium bg-slate-50">
                        User Accounts
                      </div>
                      <div className="p-4">
                        {isLoadingUsers ? (
                          <div className="flex justify-center items-center py-8">
                            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                          </div>
                        ) : users.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left pb-2">Name</th>
                                  <th className="text-left pb-2">Email</th>
                                  <th className="text-left pb-2">Role</th>
                                  <th className="text-left pb-2">Last Login</th>
                                  <th className="text-right pb-2">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {users.map((userItem) => (
                                  <tr key={userItem.id} className="border-b">
                                    <td className="py-3">{userItem.name || 'No Name'}</td>
                                    <td className="py-3">{userItem.email}</td>
                                    <td className="py-3">
                                      <Badge className={getRoleBadgeColor(userItem.role)}>
                                        {userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}
                                      </Badge>
                                    </td>
                                    <td className="py-3">
                                      {userItem.last_login_at 
                                        ? new Date(userItem.last_login_at).toLocaleString() 
                                        : 'Never'}
                                    </td>
                                    <td className="py-3 text-right space-x-1">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleOpenUserForm(true, userItem)}
                                      >
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleResetPassword(userItem.email)}
                                      >
                                        <Shield className="h-4 w-4" />
                                        <span className="sr-only">Reset Password</span>
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleDeleteUser(userItem)}
                                        disabled={userItem.id === user?.id} // Can't delete yourself
                                        className={userItem.id === user?.id ? "opacity-50 cursor-not-allowed" : ""}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No users found. Add a new user to get started.
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm">
                      <h4 className="font-medium text-amber-800 mb-1">Role Information</h4>
                      <ul className="space-y-2 text-amber-700">
                        <li><span className="font-semibold">Admin:</span> Full access to all features, user management, and system settings.</li>
                        <li><span className="font-semibold">Moderator:</span> Can manage clients, prospects, and access credentials.</li>
                        <li><span className="font-semibold">User:</span> Basic access to assigned prospects and clients.</li>
                      </ul>
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
      
      {/* Avatar Upload Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new avatar image or enter an image URL.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-full bg-gray-200 border flex items-center justify-center overflow-hidden">
                {profileData.avatar_url ? (
                  <img 
                    src={profileData.avatar_url} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-16 w-16 text-gray-400" />
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Image URL</Label>
              <Input
                id="avatar_url"
                value={profileData.avatar_url || ''}
                onChange={(e) => setProfileData({...profileData, avatar_url: e.target.value})}
                placeholder="https://example.com/your-image.jpg"
              />
              <p className="text-xs text-gray-500">
                Enter a direct link to your image
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <Label htmlFor="avatar_file">Or upload an image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="avatar_file"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // In a real implementation, you would upload this to a storage service
                      // For now, we'll create a temporary URL for preview
                      const url = URL.createObjectURL(file);
                      setProfileData({...profileData, avatar_url: url});
                      
                      // In a real implementation with file upload:
                      // 1. Create a FormData object
                      // 2. Append the file to it
                      // 3. Send it to your server or storage service
                      // 4. Set the returned URL to profileData.avatar_url
                    }
                  }}
                />
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
                <span className="text-sm text-gray-500">
                  {fileInputRef.current?.files?.[0]?.name || "No file chosen"}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, GIF (max 5MB)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAvatarDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAvatarDialogOpen(false)}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Form Dialog */}
      <Dialog open={userFormOpen} onOpenChange={setUserFormOpen}>
        <DialogContent className="sm:max-w-[650px] p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold">
              {isEditMode ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-500 mt-1">
              {isEditMode 
                ? "Update user details and permissions"
                : "Fill in the details to create a new user account"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-8 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium block">
                Full Name
              </Label>
              <Input
                id="name"
                value={userFormData.name}
                onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                className="w-full h-11 text-base"
                placeholder="Enter user's full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium block">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                className="w-full h-11 text-base"
                placeholder="user@example.com"
                disabled={isEditMode} // Can't change email in edit mode
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium block">
                User Role
              </Label>
              <Select
                value={userFormData.role}
                onValueChange={(value) => setUserFormData({
                  ...userFormData, 
                  role: value as UserRole
                })}
              >
                <SelectTrigger className="w-full h-11 text-base">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Select the appropriate access level for this user
              </p>
            </div>
            {!isEditMode && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-700 mt-2">
                <p className="flex items-center">
                  <Info className="h-5 w-5 mr-3 flex-shrink-0 text-blue-600" />
                  <span>A temporary password will be created and the user will receive an email with instructions to set their own password.</span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-3 pt-6 mt-2">
            <Button variant="outline" onClick={handleCloseUserForm} className="h-11 px-5">
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleUserFormSubmit} 
              className="h-11 px-8 text-base"
              disabled={saving}
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? "Saving..." : "Creating..."}
                </>
              ) : (
                isEditMode ? "Save Changes" : "Create User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for{" "}
              <span className="font-medium">{userToDelete?.name || userToDelete?.email}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Settings; 