import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider  from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
    CredentialsProvider({
        name: "credentials",
        credentials: {
            email: { label: "Email", type: "email", placeholder: "you@example.com" },
            password: { label: "Password", type: "password", placeholder: "your password" }
        },
        async authorize(credentials) { 
            if (!credentials?.email || !credentials?.password) {
                throw new Error("Email and password are required");
            } 
            const user = await prisma.user.findUnique({
                where: { email: credentials.email }
            })
            if(!user || !user.password){
                throw new Error("Invalid email or password");
            }
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (!isValid) {
                throw new Error("Invalid email or password");
            }
            return user;
        }
        
    }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/login",
        
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};