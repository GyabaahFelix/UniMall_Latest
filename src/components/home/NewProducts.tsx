import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function NewProducts({ products }: { products: any[] }) {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <h2 className="text-3xl font-bold mb-8">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-xl transition-shadow rounded-xl"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.images?.[0] || "/images/placeholder.png"}
                  alt={product.title}
                  className="w-full h-64 object-cover rounded-t-xl"
                />
              </Link>
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                <p className="text-secondary font-bold mb-2">
                  ${product.price}
                </p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < product.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    ({product.reviews || 0})
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sold by: {product.profiles?.name || "Unknown"}
                </p>
                <Link to={`/product/${product.id}`}>
                  <button
                    className="mt-3 w-full py-3 font-bold text-white text-lg rounded-lg shadow-lg 
                     bg-gradient-to-r from-secondary to-primary 
                     hover:from-primary hover:to-secondary transition-all"
                  >
                    View Details
                  </button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
