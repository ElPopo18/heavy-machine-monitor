import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  accept?: string;  // Added this line to resolve the TypeScript error
}

export const FormField = ({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  required = false,
  accept,  // Added this parameter
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} {required && '*'}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        accept={accept}  // Added this prop to pass through to the input
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};