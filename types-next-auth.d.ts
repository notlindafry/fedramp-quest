import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    role?: "owner" | "none";
    ver?: number;
  }
}
