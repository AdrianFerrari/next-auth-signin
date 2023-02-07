import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "app/database/clientPromise";
import connectMongoDB from "app/database/connectMongo";
import userAuthSchema from "app/database/schema";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                name: {
                    label: "Username",
                    type: "text",
                    placeholder: "John Doe",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                connectMongoDB();
                if (!credentials) return null;
                if (req.method !== "POST")
                    throw new Error("Only POST methods accepted");
                const user = await userAuthSchema.findOne({
                    name: credentials.name,
                });
                if (!user) throw new Error("No user with that name");
                const match = await user.validatePassword(credentials.password);
                if (!match) throw new Error("Wrong password");

                const result = { id: user._id, name: user.name };
                return result;
            },
        }),
    ],
    pages: {
        error: "/",
    },
    adapter: MongoDBAdapter(clientPromise, {
      databaseName: 'nextauth_db'
    }),
    session: { strategy: "jwt" },
    callbacks: {
        async signIn({ user, account, credentials }) {
            if (credentials) {
              return true
            }
            const data = await fetch(
                process.env.NEXTAUTH_URL + "/api/auth/check",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: user.email,
                        provider: account?.provider,
                    }),
                }
            );
            const response = await data.json();
            console.log(response);

            const isAllowedToSignIn = response.ok;
            if (isAllowedToSignIn) {
                return true;
            } else {
                return `/error/wrong-account?provider=${response.error}`;
            }
        },
    },
};
export default NextAuth(authOptions);
