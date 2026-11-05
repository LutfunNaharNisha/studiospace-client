import Link from 'next/link';
import { FiAperture } from 'react-icons/fi';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight" aria-label="StudioSpace home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-content">
        <FiAperture className="h-5 w-5" />
      </span>
      <span>
        Studio<span className="text-primary">Space</span>
      </span>
    </Link>
  );
}
