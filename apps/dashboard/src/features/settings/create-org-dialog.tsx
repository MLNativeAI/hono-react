import { zodResolver } from "@hookform/resolvers/zod";
import { slugify } from "@repo/shared/id";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useOrganization } from "@/hooks/use-organization";
import { authClient } from "@/lib/auth-client";

const createOrgFormSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(100, "Name must be less than 100 characters"),
});

type CreateOrgFormValues = z.infer<typeof createOrgFormSchema>;

interface CreateOrgDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateOrgDialog({ open, onOpenChange, onSuccess }: CreateOrgDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setActiveOrganization } = useOrganization();

  const form = useForm<CreateOrgFormValues>({
    resolver: zodResolver(createOrgFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: CreateOrgFormValues) => {
    setIsLoading(true);
    const slug = slugify(values.name);
    try {
      const { data, error } = await authClient.organization.create({
        name: values.name,
        slug: slug,
        keepCurrentActiveOrganization: false,
      });

      if (error) {
        toast.error("Failed to create an organization");
        return;
      }
      setActiveOrganization(data.id);

      toast.success("Organization created successfully");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to create organization");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>Enter a name for your new organization.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Organization Name</FormLabel>
                    <FormControl>
                      <Input id={field.name} placeholder="My Organization" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Organization"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
