import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};

  const getErrorMessage = (error: string | string[] | undefined) => {
    if (!error) return "An unknown error occurred";
    const errorStr = Array.isArray(error) ? error[0] : error;
    switch (errorStr) {
      case "access_denied":
        return "Access was denied. You may have cancelled the authorization or the provider rejected the request.";
      case "invalid_request":
        return "Invalid request. Please try signing in again.";
      case "unauthorized_client":
        return "The application is not authorized to use this authentication method.";
      case "unsupported_response_type":
        return "The authorization server does not support this response type.";
      case "invalid_scope":
        return "The requested scope is invalid or unknown.";
      case "server_error":
        return "The authorization server encountered an unexpected condition.";
      case "temporarily_unavailable":
        return "The authorization server is temporarily unavailable. Please try again later.";
      default:
        return `Authentication error: ${errorStr}`;
    }
  };

  return (
    <main className="h-screen bg-background">
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Authentication Error
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-6">
          {getErrorMessage(params?.error)}
        </p>
        {params?.error_description && (
          <p className="text-sm text-muted-foreground text-center mb-6">
            Details: {params.error_description}
          </p>
        )}
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/sign-in">Try Again</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
