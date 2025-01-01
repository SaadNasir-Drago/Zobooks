import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg h-screen">
      <div className="p-4">
        <Link href="/" className="text-blue-600 text-2xl font-bold">
          Zillow
        </Link>
      </div>
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/saved"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Saved Homes
          </Link>
          <Link
            href="/dashboard/searches"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Saved Searches
          </Link>
          <Link
            href="/dashboard/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Profile
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
