import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Plus, Edit, Trash2, Ban, Database, Key, Users as UsersIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Institutions = () => {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [viewUsersOpen, setViewUsersOpen] = useState(false);
  const [selectedInst, setSelectedInst] = useState<any>(null);
  const [institutionUsers, setInstitutionUsers] = useState<any[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    contact_email: "",
    contact_phone: "",
    subscription_status: "active" as "active" | "suspended" | "trial",
    subscription_plan: "professional",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    const { data, error } = await supabase
      .from("institutions")
      .select(`
        *,
        subscriptions(
          id,
          plan,
          status,
          end_date,
          current_usage,
          monthly_question_limit
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) setInstitutions(data);
  };

  const handleAdd = async () => {
    try {
      // @ts-ignore - address and contact fields may not be in types
      const { data: institution, error } = await supabase.from("institutions").insert({
        name: form.name,
        email: form.contact_email,
      }).select().single();

      if (error) throw error;

      // Create subscription for the new institution
      // @ts-ignore - subscriptions table not in generated types yet
      const { error: subError } = await supabase.from("subscriptions").insert({
        institution_id: institution.id,
        plan: form.subscription_plan,
        status: form.subscription_status,
        monthly_question_limit: 10000,
        current_usage: 0,
      });

      if (subError) {
        console.error("Failed to create subscription:", subError);
      }

      toast({
        title: "Success!",
        description: "Institution added successfully",
      });

      setAddOpen(false);
      setForm({
        name: "",
        address: "",
        contact_email: "",
        contact_phone: "",
        subscription_status: "active",
        subscription_plan: "professional",
      });
      loadInstitutions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from("institutions")
        .update({
          name: form.name,
          address: form.address,
          contact_email: form.contact_email,
          contact_phone: form.contact_phone,
        })
        .eq("id", selectedInst.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Institution updated successfully",
      });

      setEditOpen(false);
      setSelectedInst(null);
      setForm({
        name: "",
        address: "",
        contact_email: "",
        contact_phone: "",
        subscription_status: "active",
        subscription_plan: "professional",
      });
      loadInstitutions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this institution? This will delete all associated data.")) return;

    try {
      const { error } = await supabase
        .from("institutions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Institution deleted successfully",
      });

      loadInstitutions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSuspend = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    
    try {
      // Note: This requires a subscription_status column in institutions table
      // For now, we'll show a message
      toast({
        title: "Feature Coming Soon",
        description: `Subscription management will be available soon. Would ${newStatus} this institution.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (!selectedInst || !newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the admin user for this institution
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, email")
        .eq("institution_id", selectedInst.id)
        .eq("role", "admin")
        .single();

      if (profileError) throw new Error("Admin user not found for this institution");

      // Update password using Supabase Admin API
      // Note: This requires the user to be authenticated as super_admin
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        profile.user_id,
        { password: newPassword }
      );

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: `Password updated for ${profile.email}`,
      });

      setPasswordOpen(false);
      setNewPassword("");
      setSelectedInst(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Make sure you have admin privileges.",
        variant: "destructive",
      });
    }
  };



  const loadInstitutionUsers = async (institutionId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("institution_id", institutionId)
        .eq("role", "admin")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInstitutionUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`)) return;

    try {
      // @ts-ignore - RPC function may not be in types
      const { error } = await supabase.rpc('delete_user_by_id', {
        p_user_id: userId
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `User ${userEmail} has been deleted`,
      });

      // Reload users list
      if (selectedInst) {
        await loadInstitutionUsers(selectedInst.id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Institutions</h1>
          <p className="text-muted-foreground">Manage all institutions on the platform</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Institution
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Institution</DialogTitle>
              <DialogDescription>
                Create a new institution account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Institution Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ABC University"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="123 Main St, City, Country"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  placeholder="admin@institution.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Contact Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.contact_phone}
                  onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <Button onClick={handleAdd} className="w-full">
                Add Institution
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card className="p-6 shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {institutions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No institutions found
                </TableCell>
              </TableRow>
            ) : (
              institutions.map((inst) => {
                const subscription = Array.isArray(inst.subscriptions) 
                  ? inst.subscriptions[0] 
                  : inst.subscriptions;
                
                return (
                  <TableRow key={inst.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{inst.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{inst.email || inst.contact_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {subscription ? (
                        <div>
                          <p className="text-sm font-medium capitalize">{subscription.plan}</p>
                          <p className="text-xs text-muted-foreground">
                            Questions: {subscription.current_usage} / {subscription.monthly_question_limit}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {/* @ts-ignore */}
                            Storage: {(subscription.storage_used_gb || 0).toFixed(2)} / {(subscription.storage_limit_gb || 10).toFixed(0)} GB
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No subscription</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {subscription ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          subscription.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : subscription.status === "suspended"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}>
                          {subscription.status}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                          None
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(inst.created_at).toLocaleDateString()}
                    </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* View Users Dialog */}
                      <Dialog
                        open={viewUsersOpen && selectedInst?.id === inst.id}
                        onOpenChange={(open) => {
                          setViewUsersOpen(open);
                          if (!open) {
                            setSelectedInst(null);
                            setInstitutionUsers([]);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedInst(inst);
                              loadInstitutionUsers(inst.id);
                            }}
                            title="View admin users"
                          >
                            <UsersIcon className="h-4 w-4 text-purple-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Admin Users for {inst.name}</DialogTitle>
                            <DialogDescription>
                              Manage admin users for this institution
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {institutionUsers.length === 0 ? (
                              <p className="text-center text-muted-foreground py-4">
                                No admin users found for this institution
                              </p>
                            ) : (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {institutionUsers.map((user) => (
                                    <TableRow key={user.id}>
                                      <TableCell>{user.full_name || 'N/A'}</TableCell>
                                      <TableCell>{user.email}</TableCell>
                                      <TableCell className="capitalize">{user.role}</TableCell>
                                      <TableCell className="text-right">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDeleteUser(user.user_id, user.email)}
                                        >
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {/* Password Change Dialog */}
                      <Dialog
                        open={passwordOpen && selectedInst?.id === inst.id}
                        onOpenChange={(open) => {
                          setPasswordOpen(open);
                          if (!open) {
                            setSelectedInst(null);
                            setNewPassword("");
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInst(inst)}
                            title="Change admin password"
                          >
                            <Key className="h-4 w-4 text-blue-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Admin Password</DialogTitle>
                            <DialogDescription>
                              Set a new password for the institution admin: {inst.email}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="new-password">New Password</Label>
                              <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password (min 6 characters)"
                              />
                            </div>
                            <Button onClick={handlePasswordChange} className="w-full">
                              Update Password
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {/* Edit Dialog */}
                      <Dialog
                        open={editOpen && selectedInst?.id === inst.id}
                        onOpenChange={(open) => {
                          setEditOpen(open);
                          if (!open) {
                            setSelectedInst(null);
                            setForm({
                              name: "",
                              address: "",
                              contact_email: "",
                              contact_phone: "",
                              subscription_status: "active",
                              subscription_plan: "professional",
                            });
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedInst(inst);
                              setForm({
                                name: inst.name,
                                address: inst.address || "",
                                contact_email: inst.contact_email || "",
                                contact_phone: inst.contact_phone || "",
                                subscription_status: "active",
                                subscription_plan: "professional",
                              });
                            }}
                            title="Edit institution"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Institution</DialogTitle>
                            <DialogDescription>
                              Update institution information.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-name">Institution Name</Label>
                              <Input
                                id="edit-name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-address">Address</Label>
                              <Textarea
                                id="edit-address"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-email">Contact Email</Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={form.contact_email}
                                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-phone">Contact Phone</Label>
                              <Input
                                id="edit-phone"
                                type="tel"
                                value={form.contact_phone}
                                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                              />
                            </div>
                            <Button onClick={handleEdit} className="w-full">
                              Update Institution
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSuspend(inst.id, "active")}
                        title="Suspend subscription"
                      >
                        <Ban className="h-4 w-4 text-amber-600" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(inst.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Institutions;
