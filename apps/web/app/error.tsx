'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Xatolik yuz berdi</h2>
        <p className="text-muted mb-6">{error.message || 'Noma\'lum xatolik'}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-primary text-bg rounded-lg font-bold"
        >
          Qayta urinib ko'ring
        </button>
      </div>
    </div>
  );
}
