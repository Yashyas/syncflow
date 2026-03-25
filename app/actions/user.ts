"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcryptjs";

type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

// update email 
export async function updateUser(
  name: string,
  email: string,
): Promise<ActionResult<{ name: string | null; email: string | null }>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated." };
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      return { success: false, error: "Name cannot be empty." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    // If the user is changing their email, make sure it isn't taken
    if (trimmedEmail !== session.user.email.toLowerCase()) {
      const existing = await prisma.user.findUnique({
        where: { email: trimmedEmail },
        select: { id: true },
      });
      if (existing) {
        return {
          success: false,
          error: "That email is already in use by another account.",
        };
      }
    }

    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: trimmedName,
        email: trimmedEmail,
      },
      select: { name: true, email: true },
    });

    return { success: true, data: updated };
  } catch (err) {
    console.error("[updateUser]", err);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

// update password 
export async function updatePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated." };
    }
 
    if (!currentPassword || !newPassword) {
      return { success: false, error: "Both password fields are required." };
    }
 
    if (newPassword.length < 8) {
      return {
        success: false,
        error: "New password must be at least 8 characters.",
      };
    }
 
    if (currentPassword === newPassword) {
      return {
        success: false,
        error: "New password must be different from the current one.",
      };
    }
 
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, password: true },
    });
 
    if (!user) {
      return { success: false, error: "User not found." };
    }
 
    if (!user.password) {
      return {
        success: false,
        error:
          "Your account uses OAuth sign-in. Password management is handled by your provider.",
      };
    }
 
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, error: "Current password is incorrect." };
    }
 
    const hashed = await bcrypt.hash(newPassword, 12);
 
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });
 
    return { success: true };
  } catch (err) {
    console.error("[updatePassword]", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}



// delete user 
export async function deleteUser(): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated." };
    }

    await prisma.user.delete({
      where: { email: session.user.email },
    });

    return { success: true };
  } catch (err) {
    console.error("[deleteUser]", err);
    return {
      success: false,
      error: "Failed to delete account. Please try again.",
    };
  }
}