import React from 'react';
import { Loader2 } from 'lucide-react';

function App() {
  const authLoading = false; // Placeholder - replace with actual auth loading state

  // Show loading state while Auth0 is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-fuchsia-400" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Rest of the component content */}
    </div>
  );
}

export default App;