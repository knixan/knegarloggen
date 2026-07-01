import { CustomerForm } from "@/components/minasidor/kunder/customer-form";

export default function NyKundPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ny kund</h1>
        <p className="text-sm text-muted-foreground">Registrera en ny kund.</p>
      </div>
      <div className="max-w-2xl">
        <CustomerForm />
      </div>
    </div>
  );
}
