import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center sm:items-start">
        <h1 className="text-4xl mb-4">RetroFlow</h1>
        <div className="flex flex-col gap-4 items-center justify-center">
        <Link href="/new">Create new project</Link>
        <Link href="/projects">Load existing</Link>
        </div>
      </main>
        
    </div>
  );
}