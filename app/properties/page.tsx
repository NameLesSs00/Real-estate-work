import Link from "next/link";

export default function PropertiesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-semibold mb-8 text-brand-primary">Properties</h1>
      <p className="mb-8 text-gray-600">
        Browse our collection of premium properties.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder link to test out the dynamic route */}
        <Link 
          href="/properties/modern-sea-view-apartment"
          className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
          <h2 className="text-2xl font-medium mb-2 text-brand-primary">Modern Sea View Apartment</h2>
          <p className="text-gray-500">El Gouna, Hurghada, Red Sea Governorate, Egypt</p>
        </Link>
      </div>
    </div>
  );
}
