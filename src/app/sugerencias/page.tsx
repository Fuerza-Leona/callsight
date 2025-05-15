import ProtectedRoute from '@/components/ProtectedRoute';

export default function Suggestions() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Sugerencias</h1>
        <p className="mt-4 text-gray-600">En construcción.</p>
      </div>
    </ProtectedRoute>
  );
}
