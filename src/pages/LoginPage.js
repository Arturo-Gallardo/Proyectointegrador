import * as React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { PrototypeFormDialog } from "components/dialogs/PrototypeFormDialog";
import { SuccessDialog } from "components/dialogs/SuccessDialog";
import { APP_NAME } from "lib/app";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  useDocumentTitle("Iniciar sesión");
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/app";

  const [email, setEmail] = React.useState("owner@demo.local");
  const [password, setPassword] = React.useState("password");
  const [pending, setPending] = React.useState(false);
  const [loginError, setLoginError] = React.useState(false);
  const [forgotOpen, setForgotOpen] = React.useState(false);
  const [resetSentOpen, setResetSentOpen] = React.useState(false);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!emailPattern.test(email.trim()) || password.trim().length < 6) {
      setLoginError(true);
      return;
    }

    setLoginError(false);
    setPending(true);
    await login({ email: email.trim(), password, prototypeRole: "OWNER" });
    setPending(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Inicia sesión en {APP_NAME}
          </CardTitle>
          <CardDescription>
            Entra para consultar tu resumen financiero, registrar ingresos y
            gastos, revisar pagos recurrentes, administrar tus activos y anticipar
            cambios con alertas y pronósticos personales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" noValidate onSubmit={handleSubmit}>
            {loginError ? (
              <div className="flex items-center justify-between rounded-md border border-[#ef3b42] bg-[#ffdada] px-4 py-3 text-sm font-semibold text-black">
                <span>Correo electrónico o contraseña incorrecta.</span>
                <button
                  type="button"
                  aria-label="Cerrar error"
                  className="text-2xl font-normal leading-none"
                  onClick={() => setLoginError(false)}
                >
                  ×
                </button>
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLoginError(false);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError(false);
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tus datos financieros en un solo lugar</span>
              <button
                type="button"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                onClick={() => setForgotOpen(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <Button className="w-full" type="submit" disabled={pending}>
              {pending ? "Iniciando sesión…" : "Continuar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
              Crear una
            </Link>
          </p>
        </CardContent>
      </Card>

      <PrototypeFormDialog
        open={forgotOpen}
        onOpenChange={setForgotOpen}
        title="Recuperación de contraseña"
        description="Ingresa el correo asociado a tu cuenta. Te enviaremos un enlace seguro para crear una nueva contraseña."
        fields={[
          {
            id: "email",
            label: "Correo electrónico",
            type: "email",
            defaultValue: email,
            required: true,
            fullWidth: true,
            autoComplete: "email",
            helperText: "El enlace estará disponible durante 30 minutos.",
          },
        ]}
        submitLabel="Enviar enlace"
        onSubmit={() => setResetSentOpen(true)}
      />
      <SuccessDialog
        open={resetSentOpen}
        onOpenChange={setResetSentOpen}
        title="Enlace enviado"
        description={`Enviamos las instrucciones de recuperación a ${email}. Revisa también la carpeta de spam.`}
      />
    </div>
  );
}
