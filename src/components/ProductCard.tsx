import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  seller?: string;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  seller,
  onFavorite,
  isFavorite = false,
}: ProductCardProps) {
  return (
    <Card className="group card-hover overflow-hidden">
      <Link to={`/product/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.preventDefault();
              onFavorite?.();
            }}
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? "fill-accent text-accent" : ""}`}
            />
          </Button>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xl font-bold text-primary">GH₵{price.toFixed(2)}</p>
          {seller && (
            <p className="text-xs text-muted-foreground">by {seller}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
