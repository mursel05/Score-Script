import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      evaluateCount: number;
      resetLimitAt: Date | null;
      blocked: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    evaluateCount: number;
    resetLimitAt: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    evaluateCount: number;
    resetLimitAt: Date | null;
  }
}
