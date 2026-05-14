import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { login, signup } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormProps = {
  mode: "login" | "signup";
  error?: string;
};

export function AuthForm({ mode, error }: AuthFormProps) {
  const isLogin = mode === "login";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border-white/10 bg-card/80 shadow-2xl shadow-cyan-950/30 backdrop-blur">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BrainCircuit className="size-6" />
          </div>
          <div>
            <CardTitle className="text-2xl">
              {isLogin ? "Welcome back" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Continue studying with your AI academic workspace."
                : "Start building smarter study materials in minutes."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          <form action={isLogin ? login : signup} className="space-y-4">
            {!isLogin ? (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" placeholder="Amina Rahman" required />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@university.edu" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" minLength={6} required />
            </div>
            <Button className="w-full" size="lg">
              {isLogin ? "Log in" : "Sign up"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "New to EduGenie AI?" : "Already have an account?"}{" "}
            <Link className="font-medium text-primary hover:underline" href={isLogin ? "/signup" : "/login"}>
              {isLogin ? "Create account" : "Log in"}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
