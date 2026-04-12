// components/Card.tsx
interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  onClick?: () => void;
}

export function Card({
  title,
  subtitle,
  children,
  className = '',
  header,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      {header ? (
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          {header}
        </div>
      ) : title ? (
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      ) : null}

      <div className="px-6 py-4">{children}</div>
    </div>
  );
}
