import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/study-data";
import { FREE_MODELS } from "@/lib/openrouter";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-3xl font-semibold">Settings</h2>
        <p className="mt-2 text-muted-foreground">Free-tier model routing and account details.</p>
      </div>
      <Card className="border-white/10 bg-card/80">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Managed by Supabase Auth.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Email:</span> {user.email}
          </p>
          <p>
            <span className="text-muted-foreground">User ID:</span> {user.id}
          </p>
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-card/80">
        <CardHeader>
          <CardTitle>OpenRouter free model fallback</CardTitle>
          <CardDescription>EduGenie retries only the approved free models.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {FREE_MODELS.map((model, index) => (
            <div key={model} className="flex items-center justify-between rounded-lg bg-background/50 p-3">
              <span className="font-mono text-sm">{model}</span>
              <Badge variant={index === 0 ? "default" : "secondary"}>
                {index === 0 ? "priority" : `fallback ${index}`}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
