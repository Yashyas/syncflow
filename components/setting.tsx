"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDashboardStore } from "@/app/store/dashboardStore";
import { signOut, useSession } from "next-auth/react";
import { Loader2, LogOut, ShieldOff, Trash2, TriangleAlert, User } from "lucide-react";
import { toast } from "sonner";
import { updateUser, updatePassword, deleteUser } from "@/app/actions/user"; // adjust path if needed

export default function Setting() {
  const isMobile = useIsMobile();
  const toggleSettingDrawer = useDashboardStore((state) => state.toggleSettingDrawer);
  const isSettingDrawerOpen = useDashboardStore((state) => state.isSettingDrawerOpen);

  if (!isMobile) {
    return (
      <Dialog open={isSettingDrawerOpen} onOpenChange={toggleSettingDrawer}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 overflow-y-auto max-h-[70vh]">
            <ProfileForm />
          </div>
          <DialogFooter className="pt-2 flex justify-between">
            <div className="flex gap-2">
              <TriangleAlert />
              <h1>Danger Zone</h1>
            </div>
            <div className="pt-2 gap-2 flex flex-row justify-between">
              <Button className="w-auto" onClick={() => signOut()}>
                <LogOut />
                Logout
              </Button>
              <DeleteAccountButton />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isSettingDrawerOpen} onOpenChange={toggleSettingDrawer}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="py-4 overflow-y-auto max-h-[70vh]">
          <ProfileForm />
        </div>
        <DrawerFooter className="pt-2 flex justify-between">
          <div className="flex gap-2">
            <TriangleAlert />
            <h1>Danger Zone</h1>
          </div>
          <div className="pt-2  gap-2 flex flex-row justify-between">
            <Button className="w-auto" onClick={() => signOut()}>
              <LogOut />
              Logout
            </Button>
            <DeleteAccountButton />
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// ─── ProfileForm ──────────────────────────────────────────────────────────────

function ProfileForm({ className }: React.ComponentProps<"form">) {
  const { data: session, update: updateSession } = useSession();

  // Personal info state
  const [name, setName] = React.useState(session?.user?.name ?? "");
  const [email, setEmail] = React.useState(session?.user?.email ?? "");
  const [isProfilePending, startProfileTransition] = React.useTransition();

  // Sync once session resolves on first render
  React.useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
    if (session?.user?.email) setEmail(session.user.email);
  }, [session?.user?.name, session?.user?.email]);

  function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    startProfileTransition(async () => {
      const result = await updateUser(name, email);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      // Refresh the NextAuth JWT/session so sidebar/avatar stays in sync
      await updateSession({ name: result.data?.name, email: result.data?.email });
      toast.success("Profile updated successfully.");
    });
  }

  // Determine whether this is a credential user (has a password) or pure OAuth.
  // session.user doesn't expose `password`, so we use a lightweight API call or
  // simply check whether the user signed in via credentials provider.
  // The cleanest signal available on the client is session.user — NextAuth's
  // default session doesn't expose the provider. We expose a `hasPassword` flag
  // via the session callback in authOptions (see note below).
  const hasPassword = Boolean((session?.user as { hasPassword?: boolean })?.hasPassword);

  return (
    <div className="flex flex-col gap-2">
      {/* ── Personal Information ────────────────────────────────────────────── */}
      <div className="flex gap-2">
        <User />
        <h1>Personal Information</h1>
      </div>
      <form
        onSubmit={handleProfileUpdate}
        className={cn("grid items-start gap-6 bg-accent p-4", className)}
      >
        <div className="grid gap-3">
          <Label htmlFor="username">Full Name</Label>
          <Input
            id="username"
            className="bg-background"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isProfilePending}
          />
        </div>
        <div className="flex justify-between">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              className="bg-background"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isProfilePending}
            />
          </div>
          <Button type="submit" className="self-end" disabled={isProfilePending}>
            {isProfilePending ? <Loader2 className="animate-spin" /> : "Update"}
          </Button>
        </div>
      </form>

      {/* ── Security ────────────────────────────────────────────────────────── */}
      <div className="flex gap-2">
        <User />
        <h1>Security</h1>
      </div>
        <PasswordForm/>
    </div>
  );
}

// ─── PasswordForm ─────────────────────────────────────────────────────────────

function PasswordForm({ className }: React.ComponentProps<"form">) {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [isPasswordPending, startPasswordTransition] = React.useTransition();

  function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    startPasswordTransition(async () => {
      const result = await updatePassword(currentPassword, newPassword);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    });
  }

  return (
    <form
      onSubmit={handlePasswordUpdate}
      className={cn("grid items-start gap-6 bg-accent p-4", className)}
    >
      <div className="grid gap-3">
        <Label htmlFor="current_password">Current Password</Label>
        <Input
          type="password"
          id="current_password"
          className="bg-background"
          placeholder="*********"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isPasswordPending}
        />
      </div>
      <div className="flex justify-between">
        <div className="grid gap-3">
          <Label htmlFor="new_password">New Password</Label>
          <Input
            type="password"
            className="bg-background"
            id="new_password"
            placeholder="*********"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isPasswordPending}
          />
        </div>
        <Button type="submit" className="self-end" disabled={isPasswordPending}>
          {isPasswordPending ? <Loader2 className="animate-spin" /> : "Update"}
        </Button>
      </div>
    </form>
  );
}

// ─── DeleteAccountButton ──────────────────────────────────────────────────────

function DeleteAccountButton() {
  const [isDeleting, startDeleteTransition] = React.useTransition();

  function handleDelete() {
    startDeleteTransition(async () => {
      const result = await deleteUser();
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Account deleted. Signing you out…");
      await new Promise((r) => setTimeout(r, 1200));
      await signOut({ callbackUrl: "/" });
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-auto" variant="destructive" disabled={isDeleting}>
          {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
          Delete User
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account along with{" "}
            <strong>all projects, tasks, and messages</strong>. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleDelete}
          >
            Yes, delete my account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}