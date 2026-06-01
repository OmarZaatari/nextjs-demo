"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE } from "@/lib/auth";

function getSafeCallbackUrl(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/books";
  }
  return value;
}

export async function signInAction(formData: FormData) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "true", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  redirect(getSafeCallbackUrl(formData.get("callbackUrl")));
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect("/login");
}
