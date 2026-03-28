"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, api } from "@/lib/api";
import { RegisterSchema, type FormState } from "@/lib/definitions";

export async function register(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validated = RegisterSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validated.data;

  let response: Awaited<ReturnType<typeof api.auth.register>>;

  try {
    response = await api.auth.register({ email, password });
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return {
        errors: {
          email: ["An account with this email already exists."],
        },
      };
    }

    return {
      message: "Registration failed. Please try again.",
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

  redirect("/tasks");
}
