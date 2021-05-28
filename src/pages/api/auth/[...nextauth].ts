import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';
import { session } from 'next-auth/client';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user',
    }),
  ],
  /* jwt: {
    signingKey: process.env.SIGNIN_KEY,
  }, */
  callbacks: {
    async signIn(user, account, profile) {
      const { email } = user;
      try {
        //querys criando insert
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index('user_by_email'), q.Casefold(user.email))
              )
            ),
            q.Create(q.Collection('users'), {
              data: { email },
            }),
            q.Get(q.Match(q.Index('user_by_email'), q.Casefold(user.email)))
          )
        );
        return true;
      } catch {
        return false;
      }
    },
    /* async redirect(url, baseUrl) {
      return baseUrl
    },
    async session(session, user) {
      return session
    },
    async jwt(token, user, account, profile, isNewUser) {
      return token
    } */
  },
});
