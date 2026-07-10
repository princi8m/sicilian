import { loginAction } from "./actions";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form action={loginAction} className="w-full max-w-sm bg-panel border border-white/10 rounded-lg p-6 space-y-4">
        <h1 className="text-xl font-semibold">Admin sign in</h1>
        {searchParams.error && <p className="text-red-300 text-sm">Invalid email or password.</p>}
        <input name="email" id="email" type="email" autoComplete="username" placeholder="Email" className="w-full bg-ink border border-white/10 rounded px-3 py-2" />
        <input name="password" id="password" type="password" autoComplete="current-password" placeholder="Password" className="w-full bg-ink border border-white/10 rounded px-3 py-2" />
        <button className="w-full py-2 rounded bg-accent text-ink font-medium">Sign in</button>
      </form>
    </div>
  );
}
