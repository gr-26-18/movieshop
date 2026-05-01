/**
 * This file was added today
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid gap-8 max-w-2xl">
        {/* Profile Section */}
        <div className="rounded-lg border bg-white p-6 space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">Profile Information</h2>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="Samir" disabled />
              <p className="text-xs text-muted-foreground">
                Display name for your account.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input placeholder="samir@example.com" disabled />
              <p className="text-xs text-muted-foreground">
                This email is linked to your Better Auth account.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
             <Button variant="outline" disabled>
               Edit Profile
             </Button>
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-lg border bg-white p-6 space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">Security</h2>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-sm">Password</p>
              <p className="text-sm text-muted-foreground">
                Manage your account password and security settings.
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Update Password
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <div className="rounded-lg border bg-blue-50 border-blue-200 p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Profile and password management will be fully active once the Better Auth integration is finalized by the authentication team.
          </p>
        </div>
      </div>
    </div>
  );
}
