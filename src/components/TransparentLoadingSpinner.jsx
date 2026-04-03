// src/components/TransparentLoadingSpinner.jsx
export default function TransparentLoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-muted-foreground">Processing...</p>
      </div>
    </div>
  );
}