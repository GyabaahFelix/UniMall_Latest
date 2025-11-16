import promoSchoolImg from "@/assets/promo-school.jpg";
import electronicsImg from "@/assets/electronics.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const promotions = [
  {
    title: "Back to School",
    subtitle: "Get everything you need for the semester",
    image: promoSchoolImg,
    link: "/products",
  },
  {
    title: "Gadget Deals",
    subtitle: "Best laptops and accessories at low prices",
    image: electronicsImg,
    link: "/products",
  },
];

export default function PromotionalBannerSection() {
  return (
    <section className="section-padding">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-8">
        {promotions.map((promo, index) => (
          <Link to={promo.link} key={index}>
            <Card className="rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative h-64 md:h-80">
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                <CardContent className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{promo.title}</h2>
                  <p className="mb-4 text-lg">{promo.subtitle}</p>
                  <button className="btn-gradient-secondary px-6 py-3">Shop Now</button>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
