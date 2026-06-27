export default function StatsCard({
  title,
  value,
  color,
  icon,
}) {
  return (
    <div
      className="
        group
        bg-white
        dark:bg-gray-800
        rounded-2xl
        shadow-md
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
        border
        border-gray-200
        dark:border-gray-700
        overflow-hidden
      "
    >
      <div className="p-6">

        <div className="flex items-center justify-between">

          <div className="flex-1">

            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {title}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </h2>

          </div>

          <div
            className={`
              h-16
              w-16
              rounded-2xl
              flex
              items-center
              justify-center
              shadow-lg
              group-hover:scale-110
              transition-transform
              duration-300
              ${color}
            `}
          >
            {icon}
          </div>

        </div>

      </div>

      {/* Bottom Accent Line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

    </div>
  );
}