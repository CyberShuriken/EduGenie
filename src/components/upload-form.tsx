import { uploadNote } from "@/app/upload/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function UploadForm({ error }: { error?: string }) {
  return (
    <Card className="border-white/10 bg-card/80 shadow-xl shadow-cyan-950/20">
      <CardHeader>
        <CardTitle>Upload study material</CardTitle>
        <CardDescription>
          Add a PDF or paste notes. EduGenie stores the file privately and reuses cached AI outputs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        <form action={uploadNote} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Note title</Label>
            <Input id="title" name="title" placeholder="Biology midterm chapter 4" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">PDF or text file</Label>
            <Input id="file" name="file" type="file" accept=".pdf,.txt,text/plain,application/pdf" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Paste notes</Label>
            <Textarea
              id="content"
              name="content"
              rows={10}
              placeholder="Paste lecture notes, textbook excerpts, or your own study outline..."
            />
          </div>
          <Button size="lg">Save note</Button>
        </form>
      </CardContent>
    </Card>
  );
}
