export default function About() {
    return <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
            About This Website
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-4">
          This website uses the{" "}
          <span className="font-semibold text-indigo-600">
            <a href="https://data.gov.my/" className="text-blue-600 hover:underline">Data.gov.my</a> API
          </span>{" "}
          to provide you with the latest information and resources on healthcare facilities in Malaysia.

        </p>
            
        </div>
    </div>
}