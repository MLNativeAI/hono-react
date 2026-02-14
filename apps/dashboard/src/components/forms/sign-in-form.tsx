import { Link } from "@tanstack/react-router";
import { useState } from "react";
import MagicLinkForm from "@/components/forms/magic-link-form";
import { SocialForm } from "@/components/forms/social-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SignInForm({
  className,
  invitationId,
  ...props
}: React.ComponentProps<"div"> & { invitationId?: string }) {
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>Choose your preferred sign-in method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <SocialForm setError={setError} isLoading={isLoading} setIsLoading={setIsLoading} />
            <MagicLinkForm
              magicLinkSent={magicLinkSent}
              setMagicLinkSent={setMagicLinkSent}
              setError={setError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
            {error && <div className="text-sm text-red-500">{error.message}</div>}
          </div>

          <div className="flex flex-col mt-6 text-center text-sm gap-2">
            <div>
              Don&apos;t have an account?{" "}
              <Link from="/auth/sign-in" to="/auth/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
