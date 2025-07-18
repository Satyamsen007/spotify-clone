import NextAuth from "next-auth";
import { authOptions } from "./options.js";


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };
