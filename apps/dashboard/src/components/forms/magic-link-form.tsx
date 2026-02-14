import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getDashboardUrl } from "@/lib/url";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function MagicLinkForm({
  magicLinkSent,
  setMagicLinkSent,
  setError,
  isLoading,
  setIsLoading,
}: {
  magicLinkSent: boolean;
  setMagicLinkSent: (_: boolean) => void;
  setError: (_: { message: string; status?: number } | null) => void;
  isLoading: boolean;
  setIsLoading: (_: boolean) => void;
}) {
  const handleMagicLinkSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const { error } = await authClient.signIn.magicLink({
        email,
        callbackURL: `${getDashboardUrl()}`,
      });

      if (error) {
        setError({ message: "Failed to send magic link ", status: 500 });
        return;
      }

      setMagicLinkSent(true);
      toast.success("Magic link sent! Check your email.");
    } catch (_err) {
      setError({ message: "Failed to send magic link ", status: 500 });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {!magicLinkSent ? (
        <form onSubmit={handleMagicLinkSignIn}>
          <div className="flex flex-col gap-3">
            <div className="grid gap-2">
              <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={isLoading} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in with magic link
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-3">
          <div className="text-sm text-muted-foreground">
            Magic link sent! Check your email and click the link to sign in.
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setMagicLinkSent(false);
              setError({ message: "Failed to send magic link ", status: 500 });
            }}
          >
            Send another link
          </Button>
        </div>
      )}
    </div>
  );
}
