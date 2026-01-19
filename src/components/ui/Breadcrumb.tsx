export function Breadcrumb({
  items = [],
}: {
  items?: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="breadcrumb" className="text-sm mb-4">
      <ol className="flex items-center gap-2">
        {items.map((it, index) => (
          <li key={index} className="inline-flex items-center">
            {index !== 0 && <span className="mx-2">&gt;</span>}
            {it.href ? (
              <a href={it.href} className="hover:underline">
                {it.label}
              </a>
            ) : (
              <span className="font-medium">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
