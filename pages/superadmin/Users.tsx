import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users as UsersIcon, Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "admin" as "admin" | "super_admin",
    institution_id: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
    loadInstitutions();
  }, []);

  const loadUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select(`
        *,
        institutions(name)
      `)
      .order("created_at", { ascending: false });

    if (data) setUsers(data);
  };

  const loadInstitutions = async () => {
    const { data } = await supabase
      .from("institutions")
      .select("*")
      .order("name");

    if (data) setInstitutions(data);
  };

  const handleAddAdmin = async () => {
    try {
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", adminForm.email)
        .single();

      if (existingUser) {
        toast({
          title: "Error",
          description: "A user with this email already exists",
          variant: "destructive",
        });
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminForm.email,
        password: adminForm.password,
        options: {
          emailRedirectTo: undefined,
          data: {
            full_name: adminForm.full_name,
          }
        }
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          toast({
            title: "Error",
            description: "This email is already registered.",
            variant: "destructive",
          });
        } else {
          throw authError;
        }
        return;
      }

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: authData.user.id,
        email: adminForm.email,
        full_name: adminForm.full_name,
        role: adminForm.role,
        institution_id: adminForm.role === "super_admin" ? null : adminForm.institution_id,
      });

      if (profileError) {
        toast({
          title: "Error",
          description: `Failed to create user profile: ${profileError.message}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: `${adminForm.role === "admin" ? "Admin" : "Super Admin"} added successfully`,
      });

      setAddAdminOpen(false);
      setAdminForm({ email: "", password: "", full_name: "", role: "admin", institution_id: "" });
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: adminForm.full_name,
          email: adminForm.email,
          role: adminForm.role,
          institution_id: adminForm.role === "super_admin" ? null : adminForm.institution_id,
        })
        .eq("id", selectedUser.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "User updated successfully",
      });

      setEditUserOpen(false);
      setSelectedUser(null);
      setAdminForm({ email: "", password: "", full_name: "", role: "admin", institution_id: "" });
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "User deleted successfully",
      });

      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">All Users</h1>
          <p className="text-muted-foreground">Manage all users across all institutions</p>
        </div>
        <Dialog open={addAdminOpen} onOpenChange={setAddAdminOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Admin User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Admin User</DialogTitle>
              <DialogDescription>
                Add a new admin or super admin user
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={adminForm.full_name}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, full_name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={adminForm.email}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={adminForm.password}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, password: e.target.value })
                  }
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={adminForm.role}
                  onValueChange={(value: "admin" | "super_admin") =>
                    setAdminForm({ ...adminForm, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {adminForm.role === "admin" && (
                <div>
                  <Label htmlFor="institution">Institution</Label>
                  <Select
                    value={adminForm.institution_id}
                    onValueChange={(value) =>
                      setAdminForm({ ...adminForm, institution_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutions.map((institution) => (
                        <SelectItem key={institution.id} value={institution.id}>
                          {institution.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setAddAdminOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddAdmin}>Add User</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6 shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "super_admin"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                        : user.role === "admin" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      {user.role === "super_admin" 
                        ? "Super Admin" 
                        : user.role === "admin" 
                        ? "Admin" 
                        : "Student"}
                    </span>
                  </TableCell>
                  <TableCell>{user.institutions?.name || "N/A"}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={editUserOpen && selectedUser?.id === user.id}
                        onOpenChange={(open) => {
                          setEditUserOpen(open);
                          if (!open) {
                            setSelectedUser(null);
                            setAdminForm({ email: "", password: "", full_name: "", role: "admin", institution_id: "" });
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setAdminForm({
                                email: user.email,
                                password: "",
                                full_name: user.full_name,
                                role: user.role,
                                institution_id: user.institution_id || "",
                              });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                              Update user information
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit_full_name">Full Name</Label>
                              <Input
                                id="edit_full_name"
                                value={adminForm.full_name}
                                onChange={(e) =>
                                  setAdminForm({ ...adminForm, full_name: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_email">Email</Label>
                              <Input
                                id="edit_email"
                                type="email"
                                value={adminForm.email}
                                onChange={(e) =>
                                  setAdminForm({ ...adminForm, email: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_role">Role</Label>
                              <Select
                                value={adminForm.role}
                                onValueChange={(value: "admin" | "super_admin") =>
                                  setAdminForm({ ...adminForm, role: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="super_admin">Super Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {adminForm.role === "admin" && (
                              <div>
                                <Label htmlFor="edit_institution">Institution</Label>
                                <Select
                                  value={adminForm.institution_id}
                                  onValueChange={(value) =>
                                    setAdminForm({ ...adminForm, institution_id: value })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select institution" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {institutions.map((institution) => (
                                      <SelectItem key={institution.id} value={institution.id}>
                                        {institution.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            <div className="flex justify-end gap-3">
                              <Button
                                variant="outline"
                                onClick={() => setEditUserOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleEditUser}>Update User</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Users;
