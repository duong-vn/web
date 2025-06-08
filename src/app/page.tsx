export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-6 my-20">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          Welcome to <span className="text-indigo-400">SocialHub</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Connect with others, share your thoughts, and join communities that
          matter to you.
        </p>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">
            Featured Content
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Explore our curated collection of articles, news, and updates from
            our community. Stay informed and engaged with the latest trends and
            discussions.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">
            Latest Updates
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Discover our newest features and improvements. We're constantly
            evolving to provide you with the best social networking experience.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-100 mb-8 text-center">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-4">
            <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Fast & Reliable
            </h3>
            <p className="text-gray-400">
              Experience lightning-fast performance and reliable service
              whenever you need it.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Secure</h3>
            <p className="text-gray-400">
              Your data is protected with enterprise-grade security measures and
              encryption.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              24/7 Support
            </h3>
            <p className="text-gray-400">
              Our dedicated support team is always ready to help you with any
              questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
