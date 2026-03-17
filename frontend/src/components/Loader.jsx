export default function Loader({ size = 'md' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <div 
        className={`${sizes[size]} rounded-full border-gray-200 dark:border-gray-800 border-t-orange-500 animate-spin`}
      />
    </div>
  );
}
