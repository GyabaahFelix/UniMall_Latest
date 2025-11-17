import { Link } from "react-router-dom";
import deliveryBanner from "./../assets/deliveryBanner.jpg";

export default function FastDeliveryBanner() {
  return (
    <section className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg my-12">
      {/* Banner Image */}
      <img
        src={deliveryBanner}
        alt="Fast Delivery Banner"
        className="w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-16 text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
          Fast Delivery on Campus
        </h2>
        <p className="text-lg md:text-2xl mb-6 drop-shadow-md">
          Get your orders delivered within minutes anywhere on campus.
        </p>
        <Link
          to="/products"
          className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Order Now
        </Link>
      </div>
    </section>
  );
}
