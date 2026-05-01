import React from 'react';

export default async function AdminPage() {
  // Simulate a delay to show the splash screen
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#16273B]">Admin Dashboard</h1>
      <p className="mt-4 text-gray-600">Welcome to the admin panel. The splash screen you just saw is the loading state for this section.</p>
    </div>
  );
}
