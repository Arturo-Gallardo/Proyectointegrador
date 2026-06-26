import { CrudAddButton } from "components/crud/CrudAddButton";
import { CrudRowActions } from "components/crud/CrudRowActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { Badge } from "components/ui/badge";
import { suppliers } from "data/mockData";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { usePrototypeCrudUi } from "hooks/usePrototypeCrudUi";
import { createCrudHandlers } from "lib/formSchemas";
import { formatCurrency } from "lib/format";

export default function SuppliersPage() {
  useDocumentTitle("Proveedores");
  const crud = usePrototypeCrudUi();
  const supplierCrud = createCrudHandlers(crud, "supplier");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Proveedores</h1>
        <p className="text-sm text-muted-foreground">
          Contactos, historial de precios y calendario de pagos — datos de
          prototipo mostrados abajo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Proveedores activos</CardTitle>
            <CardDescription>Vinculados a este restaurante.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{suppliers.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cuentas por pagar</CardTitle>
            <CardDescription>Próximos 30 días.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tabular-nums">
            {formatCurrency(suppliers.reduce((s, x) => s + x.lastTotal, 0))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recordatorios de reorden</CardTitle>
            <CardDescription>Heurística basada en curvas de uso.</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="warning">3 próximos</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Directorio de proveedores</CardTitle>
            <CardDescription>Productos suministrados, última compra y próximo pago.</CardDescription>
          </div>
          <CrudAddButton variant="outline" onAdd={supplierCrud.onAdd}>
            Agregar proveedor
          </CrudAddButton>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Última compra</TableHead>
                <TableHead className="text-right">Último total</TableHead>
                <TableHead>Pago vence</TableHead>
                <TableHead className="w-[100px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.products}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div>{s.email}</div>
                    <div>{s.phone}</div>
                  </TableCell>
                  <TableCell>{s.lastPurchase}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(s.lastTotal)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{s.paymentDue}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <CrudRowActions
                      itemLabel={s.name}
                      onEdit={() => supplierCrud.onEdit(s)}
                      onDelete={() => supplierCrud.onDelete(s)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {crud.dialogs}
    </div>
  );
}
