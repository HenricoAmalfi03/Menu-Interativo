import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Waiter, CartItem } from "@shared/schema";

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: waiters = [], isLoading } = useQuery<Waiter[]>({
    queryKey: ["/api/waiters"],
  });

  useEffect(() => {
    // In a real app, cart would be in global state or localStorage
    // For now, we'll redirect back if cart is empty
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const waiter = waiters.find(w => w.id === data.waiter_id);
      
      // Calculate order details
      const orderItems = cartItems.map(item => {
        const price = item.product.is_promotion && item.product.promotion_price
          ? item.product.promotion_price
          : item.product.price;
        return {
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: price,
          total_price: price * item.quantity,
        };
      });

      const totalAmount = orderItems.reduce((sum, item) => sum + item.total_price, 0);

      // Format WhatsApp message
      const message = formatWhatsAppMessage({
        customer_name: data.customer_name,
        table_number: data.table_number,
        waiter_name: waiter?.name || "Não especificado",
        items: orderItems,
        payment_method: data.payment_method,
        observation: data.observation,
        total_amount: totalAmount,
      });

      // Send via WhatsApp (wa.me)
      const phoneNumber = waiter?.phone || "5511999999999"; // Default number
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
      
      // Save order to backend
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: data.customer_name,
          table_number: data.table_number,
          waiter_id: data.waiter_id,
          waiter_name: waiter?.name || "",
          items: orderItems,
          payment_method: data.payment_method,
          observation: data.observation,
          total_amount: totalAmount,
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar pedido");

      // Clear cart
      localStorage.removeItem("cart");
      
      // Open WhatsApp
      window.open(whatsappUrl, "_blank");
      
      toast({
        title: "Pedido enviado!",
        description: "Seu pedido foi enviado via WhatsApp com sucesso.",
      });
      
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar pedido",
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Cardápio
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold">Finalizar Pedido</h1>
          <p className="text-muted-foreground mt-2">
            Preencha os dados abaixo para enviar seu pedido
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : waiters.filter(w => w.active).length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Nenhum garçom disponível no momento
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Por favor, tente novamente mais tarde
            </p>
          </Card>
        ) : (
          <CheckoutForm
            waiters={waiters}
            cartItems={cartItems}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        )}
      </main>
    </div>
  );
}

function formatWhatsAppMessage(order: any) {
  const paymentMethodLabels: Record<string, string> = {
    debito: "Débito",
    credito: "Crédito",
    pix: "PIX",
    dinheiro: "Dinheiro",
  };

  let message = `🍽️ *NOVO PEDIDO* 🍽️\n\n`;
  message += `👤 *Cliente:* ${order.customer_name}\n`;
  message += `📍 *Mesa:* ${order.table_number}\n`;
  message += `👨‍🍳 *Garçom:* ${order.waiter_name}\n`;
  message += `💳 *Pagamento:* ${paymentMethodLabels[order.payment_method]}\n\n`;
  
  message += `📋 *Itens do Pedido:*\n`;
  order.items.forEach((item: any, index: number) => {
    message += `\n${index + 1}. ${item.product_name}\n`;
    message += `   Qtd: ${item.quantity} x R$ ${item.unit_price.toFixed(2)} = R$ ${item.total_price.toFixed(2)}`;
  });
  
  message += `\n\n💰 *TOTAL: R$ ${order.total_amount.toFixed(2)}*`;
  
  if (order.observation) {
    message += `\n\n📝 *Observações:*\n${order.observation}`;
  }
  
  return message;
}
