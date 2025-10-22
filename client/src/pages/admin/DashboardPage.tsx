import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Tag, Users, Receipt, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Product, Category, Waiter, Order } from "@shared/schema";

export default function DashboardPage() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: waiters = [] } = useQuery<Waiter[]>({
    queryKey: ["/api/waiters"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const stats = [
    {
      title: "Total de Produtos",
      value: products.filter(p => p.active).length,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      title: "Categorias Ativas",
      value: categories.filter(c => c.active).length,
      icon: Tag,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      title: "Garçons Ativos",
      value: waiters.filter(w => w.active).length,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      title: "Pedidos Hoje",
      value: orders.filter(o => {
        const today = new Date().toDateString();
        return new Date(o.created_at || "").toDateString() === today;
      }).length,
      icon: Receipt,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
  ];

  const promotions = products.filter(p => p.is_promotion && p.active);
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Visão geral do sistema
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} data-testid={`card-stat-${index}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" data-testid={`text-stat-value-${index}`}>
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Promoções Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary" data-testid="text-promotions-count">
                {promotions.length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {promotions.length === 1 ? "produto em promoção" : "produtos em promoção"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary" data-testid="text-revenue">
                R$ {totalRevenue.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {orders.length} {orders.length === 1 ? "pedido" : "pedidos"} registrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/admin/products" className="block">
              <div className="p-4 border rounded-lg hover-elevate text-center">
                <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Adicionar Produto</p>
              </div>
            </a>
            <a href="/admin/categories" className="block">
              <div className="p-4 border rounded-lg hover-elevate text-center">
                <Tag className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Nova Categoria</p>
              </div>
            </a>
            <a href="/admin/waiters" className="block">
              <div className="p-4 border rounded-lg hover-elevate text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Cadastrar Garçom</p>
              </div>
            </a>
            <a href="/admin/orders" className="block">
              <div className="p-4 border rounded-lg hover-elevate text-center">
                <Receipt className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Ver Pedidos</p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
