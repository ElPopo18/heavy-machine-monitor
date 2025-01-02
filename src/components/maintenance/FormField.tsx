import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BaseFormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
}

interface SelectFieldProps extends BaseFormFieldProps {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
  placeholder: string;
}

interface InputFieldProps extends BaseFormFieldProps {
  type: "date";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
}

interface TextareaFieldProps extends BaseFormFieldProps {
  type: "textarea";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
}

type FormFieldProps = SelectFieldProps | InputFieldProps | TextareaFieldProps;

export const FormField = (props: FormFieldProps) => {
  const { label, required, error } = props;

  return (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      {props.type === "select" && (
        <Select value={props.value} onValueChange={props.onChange}>
          <SelectTrigger>
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {props.type === "date" && (
        <Input
          type="date"
          value={props.value}
          onChange={props.onChange}
          min={props.min}
        />
      )}
      {props.type === "textarea" && (
        <>
          <Textarea
            value={props.value}
            onChange={props.onChange}
            maxLength={props.maxLength}
            className="h-32"
          />
          <p className="text-sm text-muted-foreground">
            {props.value.length}/{props.maxLength} caracteres
          </p>
        </>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};