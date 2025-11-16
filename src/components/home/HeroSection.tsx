import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-banner-large.png";

export default function HeroSection() {
  return (
    <section
      className="relative h-[600px] md:h-[700px] w-full flex items-center"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="container-custom relative z-10 text-white max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
          Shop Smart. Campus Fast. 🏬🛒
        </h1>
        <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
          Discover top electronics, trendy fashion, and everyday essentials —
          all verified, all affordable, all delivered to your campus door!
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link to="/products">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-10 py-5 rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-500 transition-all"
            >
              Shop Now
            </Button>
          </Link>
          <Link to="/products">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold px-10 py-5 rounded-lg shadow-lg hover:from-rose-600 hover:to-pink-500 transition-all"
            >
              Explore Deals
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
