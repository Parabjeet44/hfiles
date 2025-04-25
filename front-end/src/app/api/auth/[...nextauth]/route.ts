import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userId: { label: 'User ID', type: 'text' },
      },
      async authorize(credentials) {
        if (credentials?.userId) {
          const userId = Number(credentials.userId);
          if (!isNaN(userId)) {
            return { id: userId }; // Must return id as a number
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id && typeof user.id === 'number') {
        token.id = user.id;
      } else if (typeof token.id !== 'number') {
        delete token.id; // Remove if it's not a number
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.id !== 'number') {
        throw new Error('Invalid token.id: expected a number');
      }

      session.user.id = token.id; // Guaranteed to be a number
      return session;
    },
  },
  secret: 'your-secret-key',
});

export { handler as GET, handler as POST };
