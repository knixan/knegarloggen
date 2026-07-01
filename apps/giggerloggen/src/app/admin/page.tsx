import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") redirect("/mina-sidor");

  type UserWithSub = Awaited<ReturnType<typeof prisma.user.findMany>>[number] & {
    subscription: { status: string; trialEnd: Date | null } | null;
  };
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { subscription: { select: { status: true, trialEnd: true } } },
  }) as UserWithSub[];

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-bold mb-6">Admin – Användare ({users.length})</h1>
      <div className="space-y-3">
        {users.map((u) => (
          <Card key={u.id}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-muted-foreground">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {u.subscription && (
                  <Badge variant={u.subscription.status === "active" ? "default" : "secondary"}>
                    {u.subscription.status}
                  </Badge>
                )}
                {u.role === "admin" && <Badge>Admin</Badge>}
                <span className="text-xs text-muted-foreground">
                  {u.createdAt.toLocaleDateString("sv-SE")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
