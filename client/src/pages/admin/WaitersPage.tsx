import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, User } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertWaiterSchema, type Waiter, type InsertWaiter } from "@shared/schema";

export default function WaitersPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWaiter, setEditingWaiter] = useState<Waiter | null>(null);

  const { data: waiters = [], isLoading } = useQuery<Waiter[]>({
    queryKey: ["/api/waiters"],
  });

  const form = useForm<InsertWaiter>({
    resolver: zodResolver(insertWaiterSchema),
    defaultValues: {
      name: "",
      photo_url: "",
      phone: "",
      active: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertWaiter) => apiRequest("POST", "/api/waiters", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/waiters"] });
      toast({ title: "Garçom cadastrado com sucesso!" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro ao cadastrar garçom" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertWaiter }) =>
      apiRequest("PUT", `/api/waiters/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/waiters"] });
      toast({ title: "Garçom atualizado com sucesso!" });
      setIsDialogOpen(false);
      setEditingWaiter(null);
      form.reset();
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro ao atualizar garçom" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/waiters/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/waiters"] });
      toast({ title: "Garçom excluído com sucesso!" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro ao excluir garçom" });
    },
  });

  const handleSubmit = (data: InsertWaiter) => {
    if (editingWaiter) {
      updateMutation.mutate({ id: editingWaiter.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (waiter: Waiter) => {
    setEditingWaiter(waiter);
    form.reset({
      name: waiter.name,
      photo_url: waiter.photo_url,
      phone: waiter.phone,
      active: waiter.active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este garçom?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingWaiter(null);
    form.reset();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Garçons</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie os garçons que atendem os pedidos
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-waiter">
                <Plus className="w-4 h-4 mr-2" />
                Novo Garçom
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingWaiter ? "Editar Garçom" : "Novo Garçom"}
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-waiter-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="photo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Foto (opcional)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-waiter-photo" />
                        </FormControl>
                        {field.value && (
                          <div className="mt-2">
                            <Avatar className="h-20 w-20">
                              <AvatarImage src={field.value} />
                              <AvatarFallback>
                                <User className="h-8 w-8" />
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="5511999999999"
                            {...field}
                            data-testid="input-waiter-phone"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Formato: código do país + DDD + número (sem espaços)
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Ativo</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Garçom disponível para receber pedidos
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-waiter-active"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDialogClose}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      data-testid="button-save-waiter"
                    >
                      {(createMutation.isPending || updateMutation.isPending) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : waiters.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Nenhum garçom cadastrado
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Clique em "Novo Garçom" para começar
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {waiters.map((waiter) => (
              <Card key={waiter.id} data-testid={`card-waiter-${waiter.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={waiter.photo_url} alt={waiter.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {waiter.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-lg" data-testid={`text-waiter-name-${waiter.id}`}>
                          {waiter.name}
                        </h3>
                        <Badge variant={waiter.active ? "default" : "secondary"}>
                          {waiter.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      {waiter.phone && (
                        <p className="text-sm text-muted-foreground">
                          WhatsApp: {waiter.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(waiter)}
                      className="flex-1"
                      data-testid={`button-edit-${waiter.id}`}
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(waiter.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${waiter.id}`}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
