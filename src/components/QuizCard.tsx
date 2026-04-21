// src/components/QuizCard.tsx
interface QuizProps {
  title: string;
  category: string;
  questions: number;
}

export default function QuizCard({ title, category, questions }: QuizProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border hover:border-purple-400 transition cursor-pointer p-4">
      <div className="h-32 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
        <span className="text-4xl">🎮</span>
      </div>
      <p className="text-xs font-bold text-purple-500 uppercase">{category}</p>
      <h3 className="text-lg font-bold text-gray-800 mt-1">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">{questions} Pertanyaan</p>
      <button className="w-full mt-4 bg-gray-100 py-2 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition">
        Mainkan
      </button>
    </div>
  )
}