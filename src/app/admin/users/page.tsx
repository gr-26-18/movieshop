import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

async function updateUserRole(formData: FormData) {
  "use server";

  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const userId = formData.get("userId") as string;

  if (userId === session.user.id) {
    throw new Error("You cannot change your own role.");
  }

  const role = formData.get("role") as string;
  if (role !== "customer" && role !== "admin") {
    throw new Error("Invalid role");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-sm text-muted-foreground">
          Manage user accounts and roles.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y">
          <thead className="bg-muted/40 text-left text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Verified</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={
                      user.role === "admin"
                        ? "border-purple-200 bg-purple-100 text-purple-800"
                        : "border-gray-200 bg-gray-100 text-gray-800"
                    }
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {user.emailVerified ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-amber-600">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <form action={updateUserRole}>
                    <input type="hidden" name="userId" value={user.id} />
                    <select
                      name="role"
                      defaultValue={user.role}
                      className="h-8 rounded-md border bg-background px-2 text-xs mr-2"
                    >
                      <option value="customer">customer</option>
                      <option value="admin">admin</option>
                    </select>
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                    >
                      Update
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
            {users.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-center text-muted-foreground"
                  colSpan={6}
                >
                  No users found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
