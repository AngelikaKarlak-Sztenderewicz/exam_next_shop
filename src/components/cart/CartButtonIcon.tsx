'use client';

export function CartButtonIcon({
  onClick,
  ariaLabel = 'Dodaj do koszyka',
}: {
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-30 h-30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v8M8 12h8"
        />
      </svg>
    </button>
  );
}
