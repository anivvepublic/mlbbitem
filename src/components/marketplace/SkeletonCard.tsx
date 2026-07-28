export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100 dark:bg-dark-700 animate-pulse" />
      <div className="p-[12px] space-y-[10px]">
        <div className="h-[14px] w-3/4 bg-gray-100 dark:bg-dark-700 rounded animate-pulse" />
        <div className="h-[12px] w-1/2 bg-gray-100 dark:bg-dark-700 rounded animate-pulse" />
        <div className="flex items-center justify-between pt-[6px]">
          <div className="h-[20px] w-1/3 bg-gray-100 dark:bg-dark-700 rounded animate-pulse" />
          <div className="h-[24px] w-[24px] bg-gray-100 dark:bg-dark-700 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}