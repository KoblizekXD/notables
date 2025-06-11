export default async function ErrorPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};

  return (
    <main className="h-screen bg-background">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold text-primary">Error</h1>
        <p className="text-lg text-primary">An error occurred</p>
        {params?.error_description && (
          <p className="text-lg text-primary">
            Error code: {params.error_description}
          </p>
        )}
      </div>
    </main>
  );
}
