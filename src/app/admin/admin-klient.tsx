"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Shield, ShieldOff, Trash2, Users, Crown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  setUserRole,
  adminDeleteUser,
  type AdminUser,
} from "@/lib/admin-actions";

interface Props {
  initialUsers: AdminUser[];
  currentUserId: string;
}

export default function AdminKlient({ initialUsers, currentUserId }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [isPending, startTransition] = useTransition();

  const [sok, setSok] = useState("");
  const adminCount = users.filter((u) => u.role === "admin").length;

  const filtradeUsers = sok.trim()
    ? users.filter((u) => {
        const q = sok.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.companyName ?? "").toLowerCase().includes(q)
        );
      })
    : users;

  function handleRoleToggle(user: AdminUser) {
    const newRole = user.role === "admin" ? "user" : "admin";
    startTransition(async () => {
      const res = await setUserRole(user.id, newRole);
      if (!res.ok) {
        toast.error(res.error ?? "Kunde inte ändra roll");
        return;
      }
      toast.success(
        newRole === "admin"
          ? `${user.name} är nu admin`
          : `${user.name} är nu vanlig användare`,
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
      );
    });
  }

  function handleDelete(user: AdminUser) {
    startTransition(async () => {
      const res = await adminDeleteUser(user.id);
      if (!res.ok) {
        toast.error(res.error ?? "Kunde inte radera användare");
        setDeleteTarget(null);
        return;
      }
      toast.success(`${user.name} har raderats`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          icon={<Users className="h-5 w-5 text-blue-600" />}
          label="Totalt användare"
          value={users.length}
        />
        <StatCard
          icon={<Crown className="h-5 w-5 text-yellow-600" />}
          label="Admins"
          value={adminCount}
        />
      </div>

      {/* Användartabell */}
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Användare</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Sök namn, e-post eller företag..."
              value={sok}
              onChange={(e) => setSok(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtradeUsers.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">
                Inga användare matchar sökningen.
              </p>
            ) : null}
            {filtradeUsers.map((user) => {
              const isMe = user.id === currentUserId;
              const initials = user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={user.id}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  {/* Avatar */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{user.name}</span>
                      {isMe && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                          Du
                        </span>
                      )}
                      <RoleBadge role={user.role} />
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.companyName && (
                        <span className="mr-2">{user.companyName}</span>
                      )}
                      {user.jobCount} jobb &middot; registrerad{" "}
                      {new Date(user.createdAt).toLocaleDateString("sv-SE")}
                    </p>
                  </div>

                  {/* Åtgärder */}
                  {!isMe && (
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleRoleToggle(user)}
                        title={
                          user.role === "admin"
                            ? "Ta bort adminroll"
                            : "Gör till admin"
                        }
                      >
                        {user.role === "admin" ? (
                          <>
                            <ShieldOff className="h-3.5 w-3.5 mr-1.5" />
                            Ta bort admin
                          </>
                        ) : (
                          <>
                            <Shield className="h-3.5 w-3.5 mr-1.5" />
                            Gör admin
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        onClick={() => setDeleteTarget(user)}
                        aria-label="Radera användare"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Radera användare?</AlertDialogTitle>
            <AlertDialogDescription>
              Du håller på att permanent radera{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>{" "}
              ({deleteTarget?.email}) och all deras data — jobb, kunder och
              bilder. Åtgärden kan inte ångras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isPending ? "Raderar..." : "Radera"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return role === "admin" ? (
    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400">
      Admin
    </span>
  ) : (
    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
      Användare
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
