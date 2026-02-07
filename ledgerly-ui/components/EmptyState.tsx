type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 py-16 text-center">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
        {title}
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}
