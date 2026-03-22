"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, api } from "@/lib/api";
import { LoginSchema, type FormState } from "@/lib/definitions";

export async function login(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validated.data;

  let response: Awaited<ReturnType<typeof api.auth.login>>;

  try {
    response = await api.auth.login({ email, password });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return {
        message: "Invalid email or password. Please try again.",
      };
    }

    return {
      message: "Unable to reach the server. Please try again later.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set("auth-token", response.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  cookieStore.set(
    "user",
    JSON.stringify({
      id: response.user.id,
      email: response.user.email,
      name: response.user.name ?? null,
    }),
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    },
  );

  const callbackUrl = formData.get("callbackUrl") as string | null;
  const destination = callbackUrl?.startsWith("/") ? callbackUrl : "/tasks";

  redirect(destination);
}
