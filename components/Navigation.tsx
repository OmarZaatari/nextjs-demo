import Link from "next/link";
import { cookies } from "next/headers";
import { signOutAction } from "@/actions/auth";
import { AUTH_COOKIE, isAuthenticatedCookie } from "@/lib/auth";

export default async function Navigation() {
  const cookieStore = await cookies();
  const isAuthenticated = isAuthenticatedCookie(
    cookieStore.get(AUTH_COOKIE)?.value,
  );

  return (
    <nav className="bg-zinc-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold hover:text-zinc-300 transition-colors"
            >
              📚 BookHub
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="hover:text-zinc-300 transition-colors font-medium"
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/books"
                  className="hover:text-zinc-300 transition-colors font-medium"
                >
                  Books
                </Link>
                <Link
                  href="/authors"
                  className="hover:text-zinc-300 transition-colors font-medium"
                >
                  Authors
                </Link>
                <Link
                  href="/publishers"
                  className="hover:text-zinc-300 transition-colors font-medium"
                >
                  Publishers
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="hover:text-zinc-300 transition-colors font-medium"
                >
                  Sign out
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="bg-white text-zinc-900 px-4 py-2 rounded-lg font-medium hover:bg-zinc-100 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
