export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ✅ Deployment Test Success!
        </h1>
        <p className="text-gray-600 mb-4">
          If you can see this page, the latest code is deployed.
        </p>
        <div className="text-sm text-gray-500">
          Commit: 8ea6e37 - Updated APIs and Styling
        </div>
      </div>
    </div>
  );
}