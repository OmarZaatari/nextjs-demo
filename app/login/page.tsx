import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { signInAction } from "@/actions/auth";
import { AUTH_COOKIE, isAuthenticatedCookie } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const cookieStore = await cookies();
  if (isAuthenticatedCookie(cookieStore.get(AUTH_COOKIE)?.value)) {
    redirect("/books");
  }

  const { callbackUrl } = await searchParams;
  const safeCallbackUrl =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/books";

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Sign in to BookHub
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Demo authentication — no real credentials required.
        </p>

        <form action={signInAction} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={safeCallbackUrl} />
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue="reader@bookhub.demo"
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              defaultValue="demo"
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
