import { Link } from "react-router-dom";
import dealsBanner from "./../assets/dealsBanner.jpg";

export default function ShopTheBestDeals() {
  return (
    <section className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg my-12">
      {/* Banner Image */}
      <img
        src={dealsBanner}
        alt="Deals Banner"
        className="w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-16 text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
          Shop the Best Deals Today
        </h2>
        <p className="text-lg md:text-2xl mb-6 drop-shadow-md">
          Exclusive campus discounts — save up to 40% on top products.
        </p>
        <Link
          to="/products"
          className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
