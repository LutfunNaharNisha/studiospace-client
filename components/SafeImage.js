'use client';
import { useEffect, useState } from 'react';
import { FiImage } from 'react-icons/fi';

// Shows a tidy placeholder instead of a broken-image icon when a URL fails.
export default function SafeImage({ src, alt, className = '', ...rest }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) {
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-gradient-to-br from-base-300 to-base-200 text-base-content/40 ${className}`}>
        <FiImage className="h-8 w-8" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} {...rest} />;
}
