import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "esale-session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "change-this-to-a-long-secret-key-32-chars"
);

export type Session = {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
};

export async function createSession(payload: Session) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  (await cookies()).set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<Session | null> {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, secret, {
      algorithms: ["HS256"],
    });
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
