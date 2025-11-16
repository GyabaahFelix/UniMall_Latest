import { Link } from "react-router-dom";

const categories = [
  { name: "Electronics", icon: "💻", image: "/src/assets/electronics.jpg" },
  { name: "Fashion", icon: "👗", image: "/src/assets/fashion-slide.jpg" },
  { name: "Books", icon: "📚", image: "/src/assets/books-slide.jpg" },
  { name: "Food", icon: "🍕", image: "/src/assets/food-slide.jpg" },
  { name: "Hostel Essentials", icon: "🛏️", image: "/src/assets/hostel-essentials.png" },
  { name: "Accessories", icon: "⌚", image: "/src/assets/accessories.png" },
];

export default function CategoriesSection() {
  return (
    <section className="section-padding bg-muted/10">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="relative rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-lg">
                <img src={cat.image} alt={cat.name} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xl font-bold">
                  {cat.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
