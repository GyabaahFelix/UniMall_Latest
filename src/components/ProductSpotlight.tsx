import { Link } from "react-router-dom";

export default function ProductSpotlight({ products }: { products: any[] }) {
  const spotlight = products?.slice(0, 3) || [];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">

        {/* Title */}
        <h2 className="text-4xl font-extrabold text-center mb-10">
          🔥 Product Spotlight
        </h2>

        {/* IF THERE ARE NO PRODUCTS */}
        {spotlight.length === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-2xl shadow-md">
            <p className="text-xl font-semibold text-gray-600">
              No spotlight products available yet.
            </p>
            <p className="text-gray-500 mt-2">
              Vendors will upload featured items soon.
            </p>
          </div>
        )}

        {/* IF THERE ARE PRODUCTS */}
        {spotlight.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {spotlight.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden bg-white"
              >
                <div className="h-60 w-full overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>

                  <p className="text-lg font-semibold text-primary mb-4">
                    GH₵ {product.price}
                  </p>

                  <Link to={`/product/${product.id}`}>
                    <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition">
                      View Product
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
