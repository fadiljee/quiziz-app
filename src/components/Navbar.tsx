// src/components/Navbar.tsx
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 bg-white border-b shadow-sm">
      <div className="text-2xl font-bold text-purple-600">
        Quiz<span className="text-yellow-500">Kuy</span>
      </div>
      <div className="space-x-4">
        <button className="px-4 py-2 font-medium text-gray-600 hover:text-purple-600">
          Cari Kuis
        </button>
        <button className="px-6 py-2 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition">
          Login
        </button>
      </div>
    </nav>
  )
}