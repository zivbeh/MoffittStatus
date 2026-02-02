import Link from 'next/link';

export function Navbar() {

  return (
    <nav className="w-full border-b bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          {/* <div className="h-8 w-8 bg-gray-300" /> */}
          <span className="text-lg font-bold text-foreground">
            MoffittStatus
          </span>
        </Link>
      </div>
    </nav>
  );
}