import { Link } from "react-router-dom";
import vendorBanner from "./../assets/vendorBanner.jpg";

export default function BecomeVendorBanner() {
  return (
    <section className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg my-12">
      {/* Banner Image */}
      <img
        src={vendorBanner}
        alt="Vendor Banner"
        className="w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-16 text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
          Become a UniMall Vendor
        </h2>
        <p className="text-lg md:text-2xl mb-6 drop-shadow-md">
          Join hundreds of sellers earning on campus. Setup is fast and easy.
        </p>
        <Link
          to="/vendor/register"
          className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Start Selling
        </Link>
      </div>
    </section>
  );
}
