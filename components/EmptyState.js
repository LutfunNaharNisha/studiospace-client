import Link from 'next/link';

export default function EmptyState({ icon: Icon, title, text, cta }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-base-300 bg-base-200/50 px-6 py-14 text-center">
      {Icon && <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-2xl text-accent-content"><Icon /></span>}
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-base-content/70">{text}</p>
      {cta && <Link href={cta.href} className="btn btn-primary mt-6">{cta.label}</Link>}
    </div>
  );
}
