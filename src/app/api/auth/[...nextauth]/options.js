import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import { connectDb } from '@/lib/db';
import { User } from '@/models/user.model';

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDb();
        try {
          const user = await User.findOne({ email: credentials.email })
          if (!user) {
            throw new Error('No User found with this email address')
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password')
          }
        } catch (err) {
          throw new Error(err.message || "Login failed");
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/google",
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await connectDb();
        try {
          let existingUser = await User.findOne({ email: user?.email });
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          const imageUrl = profile?.image?.trim() || user?.image?.trim() || null;

          if (!existingUser) {
            existingUser = new User({
              fullName: user.name || profile?.name,
              email: user.email,
              password: hashedPassword,
              imageUrl,
              admin: user?.email === 'democoders2004@gmail.com',
              playlists: [],
              recentlyPlayed: [],
            })
            await existingUser.save();
          } else {
            if (!existingUser.imageUrl && imageUrl) {
              existingUser.imageUrl = imageUrl;
              await existingUser.save();
            }
          }
          user._id = existingUser?._id?.toString() || '';
          user.fullName = existingUser?.fullName;
          user.email = existingUser?.email;
          user.imageUrl = existingUser?.imageUrl;
          user.admin = existingUser?.admin
          return true;
        } catch (error) {
          console.error('Error while sign in with google', error)
          return '/error?message=Sign-in failed';
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        return { ...token, ...(session.user || session) }
      }
      if (user) {
        token._id = user._id?.toString()
        token.email = user.email
        token.fullName = user.fullName
        token.imageUrl = user.imageUrl || user.image || ''
        token.admin = user.admin
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session?.user,
          _id: token._id,
          fullName: token.fullName,
          email: token.email,
          imageUrl: token.imageUrl,
          admin: token.admin
        };
      }
      return session;
    }
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET_KEY,
}