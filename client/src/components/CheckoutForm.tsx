import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard, Smartphone, Banknote, DollarSign, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Waiter, CartItem } from "@shared/schema";

const checkoutSchema = z.object({
  customer_name: z.string().min(1, "Nome é obrigatório"),
  table_number: z.string().min(1, "Número da mesa é obrigatório"),
  waiter_id: z.string().min(1, "Selecione um garçom"),
  payment_method: z.enum(["debito", "credito", "pix", "dinheiro"]),
  observation: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  waiters: Waiter[];
  cartItems: CartItem[];
  onSubmit: (data: CheckoutFormData) => void;
  isLoading?: boolean;
}

const paymentMethods = [
  { value: "debito", label: "Débito", icon: CreditCard },
  { value: "credito", label: "Crédito", icon: CreditCard },
  { value: "pix", label: "PIX", icon: Smartphone },
  { value: "dinheiro", label: "Dinheiro", icon: Banknote },
] as const;

export function CheckoutForm({ waiters, cartItems, onSubmit, isLoading }: CheckoutFormProps) {
  const [selectedWaiter, setSelectedWaiter] = useState<string>("");
  
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: "",
      table_number: "",
      waiter_id: "",
      payment_method: "dinheiro",
      observation: "",
    },
  });

  const handleSubmit = (data: CheckoutFormData) => {
    onSubmit(data);
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = item.product.is_promotion && item.product.promotion_price
      ? item.product.promotion_price
      : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seu Nome</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Digite seu nome"
                      {...field}
                      className="pl-10"
                      data-testid="input-customer-name"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="table_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número da Mesa</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Ex: 12"
                      {...field}
                      className="pl-10"
                      data-testid="input-table-number"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="waiter_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Escolha seu Garçom</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedWaiter(value);
                  }}
                  value={field.value}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                >
                  {waiters.filter(w => w.active).map((waiter) => (
                    <div key={waiter.id}>
                      <RadioGroupItem
                        value={waiter.id}
                        id={waiter.id}
                        className="peer sr-only"
                        data-testid={`radio-waiter-${waiter.id}`}
                      />
                      <label
                        htmlFor={waiter.id}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer hover-elevate peer-data-[state=checked]:border-primary transition-colors"
                      >
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={waiter.photo_url} alt={waiter.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {waiter.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-center" data-testid={`text-waiter-name-${waiter.id}`}>
                          {waiter.name}
                        </span>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forma de Pagamento</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {paymentMethods.map(({ value, label, icon: Icon }) => (
                    <div key={value}>
                      <RadioGroupItem
                        value={value}
                        id={value}
                        className="peer sr-only"
                        data-testid={`radio-payment-${value}`}
                      />
                      <label
                        htmlFor={value}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer hover-elevate peer-data-[state=checked]:border-primary transition-colors"
                      >
                        <Icon className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm font-medium">{label}</span>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Alguma observação sobre o pedido?"
                  {...field}
                  rows={3}
                  data-testid="input-observation"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card className="p-4 bg-muted/50">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total do Pedido</span>
            <span className="text-2xl font-serif font-bold text-primary" data-testid="text-checkout-total">
              R$ {totalAmount.toFixed(2)}
            </span>
          </div>
        </Card>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isLoading}
          data-testid="button-submit-order"
        >
          <DollarSign className="w-5 h-5 mr-2" />
          {isLoading ? "Enviando..." : "Enviar Pedido via WhatsApp"}
        </Button>
      </form>
    </Form>
  );
}
