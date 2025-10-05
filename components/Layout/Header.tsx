import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-5 bg-white shadow-sm sticky top-0 z-10 md:px-15">
      <Link href="/" className="text-xl font-bold text-emerald-800">
        Startup Valuation Calculator
      </Link>
      <nav className="flex space-x-6">
        <Link href="/" className="text-gray-700 font-medium hover:text-emerald-600 transition-colors">
          Home
        </Link>
        <Link href="/calculator" className="text-gray-700 font-medium hover:text-emerald-600 transition-colors">
          Calculator
        </Link>
      </nav>
    </header>
  );
}