"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  
  if(!name || !email || !password) return {error:"Missing fields"}

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User already exists" }
    }

    const hashedPassword = await bcrypt.hash(password, 12) // You should hash the password before storing it in production
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
    return {email:email, password:password}
    
  } catch (error) {
    return {error: "Something went wrong"}
  }
  
}
