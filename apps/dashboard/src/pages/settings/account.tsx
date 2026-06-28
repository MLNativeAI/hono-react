import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { ModePicker } from "@/components/theme-toggle";
import AccountInfo from "@/features/settings/account-info";
import DeleteAccountForm from "@/features/settings/delete-account-form";

export default function AccountPage() {
  return (
    <div className="space-y-8">
      <AccountInfo />
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose your preferred theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <ModePicker />
        </CardContent>
      </Card>
      <DeleteAccountForm />
    </div>
  );
}
