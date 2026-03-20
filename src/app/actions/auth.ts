"use server";

import { redirect } from "next/navigation";
import { loginUser, registerUser } from "@/lib/esale";
import { createSession, deleteSession } from "@/lib/auth";

export type AuthState = {
  error?: string;
};

export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await loginUser({ email, password });

    await createSession({
      token: response.token,
      userId: response.userId,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Login failed." };
  }

  redirect("/dashboard");
}

export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await registerUser({
      firstName,
      lastName,
      email,
      password,
    });

    await createSession({
      token: response.token,
      userId: response.userId,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Registration failed.",
    };
  }

  redirect("/dashboard");
}

export async function signOut() {
  await deleteSession();
  redirect("/login");
}
