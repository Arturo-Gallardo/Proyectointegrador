import * as React from "react";
import { Link, Navigate } from "react-router-dom";
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
import { APP_NAME } from "lib/app";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
  /^(?=.*[A-ZÁÉÍÓÚÜÑ])(?=.*[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]).{6,}$/;

function ErrorIcon() {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#ef3b42] text-xs font-bold leading-none text-[#ef3b42]">
      !
    </span>
  );
}

function ErrorBubble({ children, className = "" }) {
  return (
    <div
      className={`absolute left-[calc(100%+1.75rem)] top-0 z-10 hidden w-72 rounded bg-[#ef3b42] px-4 py-3 text-sm font-bold leading-snug text-white shadow-sm before:absolute before:-left-4 before:top-4 before:border-y-[10px] before:border-r-[16px] before:border-y-transparent before:border-r-[#ef3b42] lg:block ${className}`}
    >
      {children}
    </div>
  );
}

export default function SignUpPage() {
  useDocumentTitle("Crear cuenta");
  const { signup, isAuthenticated } = useAuth();

  const [firstName, setFirstName] = React.useState("Jordan");
  const [lastName, setLastName] = React.useState("Lee");
  const [email, setEmail] = React.useState("jordan@demo.local");
  const [password, setPassword] = React.useState("password");
  const [pending, setPending] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const emailInvalid = submitted && !emailPattern.test(email.trim());
  const passwordInvalid = submitted && !passwordPattern.test(password);

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    if (!emailPattern.test(email.trim()) || !passwordPattern.test(password)) {
      return;
    }

    setPending(true);
    await signup({
      email: email.trim(),
      password,
      firstName,
      lastName,
      prototypeRole: "OWNER",
    });
    setPending(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Regístrate en {APP_NAME}
          </CardTitle>
          <CardDescription>
            Crea una cuenta para consultar tu resumen financiero, registrar
            ingresos y gastos, revisar pagos recurrentes, administrar tus
            activos y anticipar cambios con alertas y pronósticos personales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" noValidate onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={emailInvalid}
                  className={emailInvalid ? "border-[#ef3b42] pr-10" : undefined}
                />
                {emailInvalid ? (
                  <>
                    <ErrorIcon />
                    <ErrorBubble>
                      El correo ingresado no es un correo válido.
                    </ErrorBubble>
                  </>
                ) : null}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={passwordInvalid}
                  className={
                    passwordInvalid ? "border-[#ef3b42] pr-10" : undefined
                  }
                />
                {passwordInvalid ? (
                  <>
                    <ErrorIcon />
                    <ErrorBubble className="top-[-0.25rem]">
                      <p>La contraseña ingresada no es una contraseña válida.</p>
                      <p className="mt-4 font-semibold">
                        La contraseña debe incluir al menos un carácter no
                        alfabético (-, _, !, .).
                      </p>
                      <p className="mt-4 font-semibold">
                        La contraseña debe incluir al menos una letra mayúscula
                        (A-Z).
                      </p>
                    </ErrorBubble>
                  </>
                ) : null}
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={pending}>
              {pending ? "Creando…" : "Continuar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
