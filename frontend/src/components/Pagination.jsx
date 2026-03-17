export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {[...Array(pages).keys()].map((p) => (
        <button
          key={p + 1}
          onClick={() => onPageChange(p + 1)}
          className={`w-10 h-10 rounded-xl font-medium transition-colors ${
            page === p + 1
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          {p + 1}
        </button>
      ))}
    </div>
  );
}
