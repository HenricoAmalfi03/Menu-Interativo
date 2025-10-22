import { ShoppingCart, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isPromotionActive = product.is_promotion && product.promotion_price;
  
  const today = new Date();
  const promotionValid = isPromotionActive && (
    !product.promotion_start || new Date(product.promotion_start) <= today
  ) && (
    !product.promotion_end || new Date(product.promotion_end) >= today
  );

  const displayPrice = promotionValid ? product.promotion_price! : product.price;
  const hasDiscount = promotionValid && product.promotion_price! < product.price;

  return (
    <Card className="overflow-hidden hover-elevate group" data-testid={`card-product-${product.id}`}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            data-testid={`img-product-${product.id}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        {hasDiscount && (
          <Badge
            variant="destructive"
            className="absolute top-2 left-2"
            data-testid={`badge-promotion-${product.id}`}
          >
            Promoção
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-serif font-semibold text-xl text-foreground line-clamp-1" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2" data-testid={`text-product-description-${product.id}`}>
            {product.description}
          </p>
        )}
        
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-serif font-bold text-2xl text-primary" data-testid={`text-price-${product.id}`}>
            R$ {displayPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through" data-testid={`text-original-price-${product.id}`}>
              R$ {product.price.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full"
          size="default"
          data-testid={`button-add-cart-${product.id}`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}
