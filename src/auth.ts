import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sendRequest } from "./utils/api";
import { InactiveAccountError, InvalidEmailPasswordError } from "./utils/error";
import { IUser } from "./types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log(" check credentials ", credentials);

        let res = await sendRequest<IBackendRes<ILogin>>({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/auth/login`,
          body: {
            username: credentials.username,
            password: credentials.password,
          },
        });
        if (+res.statusCode === 201) {
          return {
            _id: res.data?.user._id,
            name: res.data?.user.name,
            email: res.data?.user.email,
            access_token: res.data?.access_token,
          };
        } else if (+res.statusCode === 401) {
          throw new InvalidEmailPasswordError();
        } else if (+res.statusCode === 400) {
          throw new InactiveAccountError();
        } else {
          throw new Error("Loi o phai server ");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  //  By default, the `id` property does not exist on `token` or `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // console.log("check user vào ", user);

        // User is available during sign-in
        token.user = user as IUser;
      }
      // console.log("check token 1", token);

      return token;
    },
    session({ session, token }) {
      // console.log("check token 2", token.user);

      (session.user as IUser) = token.user;
      // console.log("check session", session);
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
