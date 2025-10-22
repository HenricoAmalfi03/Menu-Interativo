import { ShoppingCart, X, Minus, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import type { CartItem } from "@shared/schema";

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => {
    const price = item.product.is_promotion && item.product.promotion_price
      ? item.product.promotion_price
      : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          data-testid="button-cart-toggle"
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center"
              data-testid="badge-cart-count"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="font-serif text-2xl">
            Seu Pedido
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Seu carrinho está vazio
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Adicione produtos para fazer seu pedido
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {items.map((item) => {
                  const price = item.product.is_promotion && item.product.promotion_price
                    ? item.product.promotion_price
                    : item.product.price;
                  const itemTotal = price * item.quantity;
                  
                  return (
                    <Card key={item.product.id} className="p-4" data-testid={`cart-item-${item.product.id}`}>
                      <div className="flex gap-3">
                        {item.product.image_url && (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm line-clamp-1" data-testid={`text-cart-product-${item.product.id}`}>
                              {item.product.name}
                            </h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0"
                              onClick={() => onRemoveItem(item.product.id)}
                              data-testid={`button-remove-${item.product.id}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <p className="text-sm text-primary font-semibold mt-1">
                            R$ {price.toFixed(2)}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => onUpdateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                                data-testid={`button-decrease-${item.product.id}`}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium" data-testid={`text-quantity-${item.product.id}`}>
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                data-testid={`button-increase-${item.product.id}`}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <span className="font-semibold" data-testid={`text-item-total-${item.product.id}`}>
                              R$ {itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
            
            <SheetFooter className="p-6 pt-4 border-t space-y-4">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary font-serif text-2xl" data-testid="text-cart-total">
                    R$ {totalAmount.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={onCheckout}
                  className="w-full"
                  size="lg"
                  data-testid="button-checkout"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Finalizar Pedido
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
