'use client';

import { useState } from 'react';

type Props = {
  description: string;
};

export default function ProductDescription({ description }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="text-sm">
      <p className={expanded ? '' : 'line-clamp-2'}>{description}</p>

      {description.length > 170 && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 text-customOrange font-semibold hover:underline"
        >
          {expanded ? 'View less' : 'View more'}
        </button>
      )}
    </div>
  );
}
