// auth.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabase } from "./lib/supabase"

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { data, error } = await supabase
        .from("users")
        .upsert([
          { 
            email: user.email,
            name: user.name, 
            dietary_preferences: [],
          }], {
          onConflict: "email",
        });

        if (error) {
          console.error("Error upserting user:", error);
          return false;
        }
        return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})
