import { useQuery } from "@tanstack/react-query";
import { Loader2, Receipt, User, Hash, DollarSign, Clock } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@shared/schema";

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const paymentMethodLabels: Record<string, string> = {
    debito: "Débito",
    credito: "Crédito",
    pix: "PIX",
    dinheiro: "Dinheiro",
  };

  const statusLabels: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    completed: "Concluído",
    cancelled: "Cancelado",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    confirmed: "bg-blue-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.created_at || "").getTime();
    const dateB = new Date(b.created_at || "").getTime();
    return dateB - dateA;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold">Pedidos</h1>
          <p className="text-muted-foreground mt-2">
            Histórico de pedidos recebidos
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">
              Nenhum pedido recebido ainda
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Os pedidos aparecerão aqui quando forem enviados
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <Card key={order.id} data-testid={`card-order-${order.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Receipt className="w-5 h-5" />
                        Pedido #{order.id.slice(0, 8)}
                      </CardTitle>
                      {order.created_at && (
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.created_at).toLocaleString("pt-BR")}
                        </p>
                      )}
                    </div>
                    <Badge
                      className={`${statusColors[order.status]} text-white`}
                      data-testid={`badge-status-${order.id}`}
                    >
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Cliente</p>
                        <p className="font-medium" data-testid={`text-customer-${order.id}`}>
                          {order.customer_name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Mesa</p>
                        <p className="font-medium" data-testid={`text-table-${order.id}`}>
                          {order.table_number}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Garçom</p>
                        <p className="font-medium" data-testid={`text-waiter-${order.id}`}>
                          {order.waiter_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-sm font-medium mb-2">Itens do Pedido:</p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                          data-testid={`order-item-${order.id}-${index}`}
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity}x R$ {item.unit_price.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold">
                            R$ {item.total_price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment & Total */}
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Pagamento</p>
                      <p className="font-medium" data-testid={`text-payment-${order.id}`}>
                        {paymentMethodLabels[order.payment_method]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold text-primary" data-testid={`text-total-${order.id}`}>
                        R$ {order.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Observation */}
                  {order.observation && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-1">Observações:</p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-observation-${order.id}`}>
                        {order.observation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
