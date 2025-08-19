// app/GlobalLoading.tsx
'use client';

export default function GlobalLoading() {
  return (
    <div
      className="fixed inset-0 z-50 bg-n-7/80 backdrop-blur-sm flex items-center justify-center"
      role="presentation"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-10 w-10 rounded-full border-4 border-n-4/40 border-t-n-1 animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
        <span className="sr-only" role="status" aria-live="polite">
          Loading…
        </span>
      </div>
    </div>
  );
}
