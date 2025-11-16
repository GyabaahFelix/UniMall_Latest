import { Link } from "react-router-dom";

export default function SalesBanner() {
  return (
    <section className="my-12">
      <div className="container-custom">
        <Link to="/products">
          <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
            <img
              src="/src/assets/promo-school.jpg"
              alt="Back to School Sale"
              className="w-full h-full object-cover"
            />
            {/* Darker overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center px-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg text-center">
                Back to School Deals
              </h2>
              <p className="text-lg md:text-xl text-white mb-6 drop-shadow-md text-center">
                Everything you need at unbeatable prices
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-500 transition-all text-lg">
                Shop Now
              </button>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
