import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Enterprise SaaS Starter Kit</h1>
      </div>

      <div className="mt-8 flex gap-4">
        <Link 
          href="/login" 
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Login
        </Link>
        <Link 
          href="/register" 
          className="rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
        >
          Register
        </Link>
      </div>
    </main>
  );
}
