import { UploadForm } from "@/components/upload-form";

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-3xl font-semibold">Upload notes</h2>
        <p className="mt-2 text-muted-foreground">
          PDF parsing happens server-side. Original files stay in a private Supabase bucket.
        </p>
      </div>
      <UploadForm error={params.error} />
    </div>
  );
}
