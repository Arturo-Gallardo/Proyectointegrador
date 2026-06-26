import * as React from "react";
import {
  Car,
  CircleHelp,
  House,
  Laptop,
  Package,
  Plus,
  TrendingUp,
} from "lucide-react";
import { CrudRowActions } from "components/crud/CrudRowActions";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { ConfirmDialog } from "components/dialogs/ConfirmDialog";
import { PrototypeFormDialog } from "components/dialogs/PrototypeFormDialog";
import { SuccessDialog } from "components/dialogs/SuccessDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { formatCurrency } from "lib/format";

const categories = [
  "Vehículo",
  "Tecnología",
  "Inversión",
  "Inmueble",
  "Coleccionable",
  "Otro",
];

const categoryIcons = {
  Vehículo: Car,
  Tecnología: Laptop,
  Inversión: TrendingUp,
  Inmueble: House,
  Coleccionable: Package,
  Otro: CircleHelp,
};

const initialAssets = [
  {
    id: 1,
    name: "Automóvil",
    description: "Toyota Corolla 2021",
    category: "Vehículo",
    current: 198000,
  },
  {
    id: 2,
    name: "Laptop",
    description: "MacBook Air M1 2020",
    category: "Tecnología",
    current: 18500,
  },
  {
    id: 3,
    name: "Fondo de inversión",
    description: "Índice S&P 500",
    category: "Inversión",
    current: 125000,
  },
];

function AssetIcon({ category }) {
  const Icon = categoryIcons[category] ?? CircleHelp;

  return (
    <span className="rounded-md bg-primary/10 p-2 text-primary">
      <Icon className="h-4 w-4" />
    </span>
  );
}

export default function AssetsPage() {
  useDocumentTitle("Activos");
  const [assets, setAssets] = React.useState(initialAssets);
  const [editingAsset, setEditingAsset] = React.useState(null);
  const [deletingAsset, setDeletingAsset] = React.useState(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [successConfig, setSuccessConfig] = React.useState({
    title: "Activo registrado",
    description:
      "El activo se ha registrado y ya forma parte de los cálculos financieros.",
  });
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState(categories[0]);
  const [value, setValue] = React.useState("");
  const total = assets.reduce((sum, item) => sum + item.current, 0);
  const editFields = React.useMemo(
    () => [
      {
        id: "name",
        label: "Nombre",
        defaultValue: editingAsset?.name,
        required: true,
      },
      {
        id: "category",
        label: "Categoría",
        type: "select",
        defaultValue: editingAsset?.category,
        required: true,
        options: categories.map((item) => ({ value: item, label: item })),
      },
      {
        id: "amount",
        label: "Monto (USD)",
        type: "number",
        min: "0",
        step: "0.01",
        prefix: "$",
        defaultValue: editingAsset?.current,
        required: true,
      },
      {
        id: "description",
        label: "Descripción",
        defaultValue: editingAsset?.description,
      },
    ],
    [editingAsset]
  );

  function addAsset(event) {
    event.preventDefault();
    if (!name.trim() || !description.trim() || !category || !value) return;
    setAssets((items) => [
      ...items,
      {
        id: Date.now(),
        name: name.trim(),
        description: description.trim(),
        category,
        current: Number(value),
      },
    ]);
    setName("");
    setDescription("");
    setCategory(categories[0]);
    setValue("");
    showSuccess({
      title: "Activo registrado",
      description:
        "El activo se ha registrado y ya forma parte de los cálculos financieros.",
    });
  }

  function showSuccess(config) {
    setSuccessConfig(config);
    setSuccessOpen(true);
  }

  function openEdit(asset) {
    setEditingAsset(asset);
    setEditOpen(true);
  }

  function openDelete(asset) {
    setDeletingAsset(asset);
    setDeleteOpen(true);
  }

  function handleEditSubmit(values) {
    if (!editingAsset) return;
    setAssets((items) =>
      items.map((asset) =>
        asset.id === editingAsset.id
          ? {
              ...asset,
              name: values.name || asset.name,
              category: values.category || asset.category,
              current: Number(values.amount || asset.current),
              description: values.description || asset.description,
            }
          : asset
      )
    );
    showSuccess({
      title: "Activo registrado",
      description:
        "El activo se ha registrado y ya forma parte de los cálculos financieros.",
    });
  }

  function handleDeleteConfirm() {
    if (!deletingAsset) return;
    setAssets((items) => items.filter((asset) => asset.id !== deletingAsset.id));
    showSuccess({
      title: "Activo eliminado",
      description: "El activo se ha eliminado.",
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activos</h1>
        <p className="text-sm text-muted-foreground">
          Registra bienes e inversiones que siguen formando parte de tu
          patrimonio.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Tus activos</CardTitle>
            <CardDescription>
              Usa un valor de reventa realista para conocer mejor tu patrimonio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Valor actual</TableHead>
                  <TableHead className="w-[90px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <AssetIcon category={item.category} />
                        <span>
                          <span className="block font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.category}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-primary">
                      {formatCurrency(item.current)}
                    </TableCell>
                    <TableCell className="text-right">
                      <CrudRowActions
                        itemLabel={item.name}
                        onEdit={() => openEdit(item)}
                        onDelete={() => openDelete(item)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardDescription>Valor total de activos</CardDescription>
              <CardTitle className="text-3xl text-primary">
                {formatCurrency(total)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Este valor forma parte de tu patrimonio, aunque no esté disponible
              como efectivo.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Agregar activo</CardTitle>
              <CardDescription>
                Agrega la misma información que aparecerá en tu lista y resumen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={addAsset}>
                <div className="space-y-2">
                  <Label htmlFor="asset-name">Nombre</Label>
                  <Input
                    id="asset-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Bicicleta"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset-description">Descripción</Label>
                  <Input
                    id="asset-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej. Bicicleta urbana 2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset-category">Categoría</Label>
                  <select
                    id="asset-category"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset-value">Valor actual (MXN)</Label>
                  <Input
                    id="asset-value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="15000"
                    required
                  />
                </div>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar activo
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <PrototypeFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Editar activo"
        description="Corrige los datos usados."
        fields={editFields}
        submitLabel="Guardar cambios"
        onSubmit={handleEditSubmit}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`¿Eliminar activo ${deletingAsset?.name ?? "ejemplo"}?`}
        description="Se quitará de la lista de activos. La información no se podrá recuperar."
        confirmLabel="Eliminar activo"
        destructive
        onConfirm={handleDeleteConfirm}
      />
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title={successConfig.title}
        description={successConfig.description}
      />
    </div>
  );
}
