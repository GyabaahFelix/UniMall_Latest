import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  name: string;
  icon: string;
  count?: number;
}

export default function CategoryCard({ name, icon, count }: CategoryCardProps) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  
  return (
    <Link to={`/category/${slug}`}>
      <Card className="card-hover cursor-pointer h-full">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[160px]">
          <div className="text-5xl mb-3">{icon}</div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          {count !== undefined && (
            <p className="text-sm text-muted-foreground mt-1">
              {count} items
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
