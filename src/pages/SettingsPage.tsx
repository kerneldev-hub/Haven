import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '../components/ui/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { User, Shield, Bell, Key, CreditCard, MonitorSmartphone } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your identity, security, and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground">
              <User className="w-4 h-4" /> Profile
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground">
               <Shield className="w-4 h-4" /> Security
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground">
               <Bell className="w-4 h-4" /> Notifications
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground">
               <CreditCard className="w-4 h-4" /> Billing
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground">
               <Key className="w-4 h-4" /> API Keys
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground">
               <MonitorSmartphone className="w-4 h-4" /> Sessions
            </button>
          </nav>
        </aside>

        {/* Form Container */}
        <div className="flex-1 space-y-8">
           <Card>
              <CardHeader>
                 <CardTitle>Public Profile</CardTitle>
                 <CardDescription>This is how others will see you on the platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xl font-medium border border-border">
                       JD
                    </div>
                    <div>
                       <Button variant="outline" size="sm" className="mr-2">Change Avatar</Button>
                       <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                    </div>
                 </div>

                 <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                       <label className="text-sm font-medium">Display Name</label>
                       <input type="text" defaultValue="John Doe" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium">Username</label>
                       <input type="text" defaultValue="johndoe" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-muted-foreground" disabled />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea defaultValue="Full-stack developer building things for the web." className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
                    <p className="text-xs text-muted-foreground">Brief description for your profile. URLs are hyperlinked.</p>
                 </div>

                 <Button>Save Preferences</Button>
              </CardContent>
           </Card>

           <Card>
              <CardHeader>
                 <CardTitle className="text-destructive">Danger Zone</CardTitle>
                 <CardDescription>Irreversible and destructive actions.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                    <div>
                       <h4 className="font-medium text-sm">Delete Account</h4>
                       <p className="text-xs text-muted-foreground">Permanently remove your account and all its data.</p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
