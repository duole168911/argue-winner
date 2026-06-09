import { ArgumentForm } from "@/components/argument-form";

export default function Home() {
  return (
    <main className="relative flex h-dvh w-full justify-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-indigo-100 via-white to-pink-100"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-300/40 to-pink-300/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-80 w-80 rounded-full bg-gradient-to-br from-pink-300/30 to-indigo-300/30 blur-3xl"
      />
      <div className="flex h-full w-full max-w-md flex-col px-4 py-4 sm:max-w-lg sm:px-6 sm:py-6">
        <ArgumentForm />
      </div>
    </main>
  );
}
