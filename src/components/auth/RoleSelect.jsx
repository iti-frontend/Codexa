import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PiChalkboardTeacher, PiStudent } from "react-icons/pi";

const RoleSelect = () => {
  return (
    <div className="border-input group bg-sidebar focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:ring-destructive/20 overflow-hidden dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive relative w-full rounded-md border shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-[input:is(:disabled)]:*:pointer-events-none">
      <label
        htmlFor={"role"}
        className="text-foreground py-2 dark:group-hover:bg-input/50 block px-3 text-xs font-medium border-b bg-background
        "
      >
        Role Selection
      </label>
      <Select defaultValue="1">
        <SelectTrigger
          id={"role"}
          className=" w-full rounded-t-none border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
        >
          <SelectValue placeholder="Choose your role" />
        </SelectTrigger>
        <SelectContent className="w-[--radix-select-trigger-width] min-w-[var(--radix-select-trigger-width)]">
          <SelectItem value="1">
            <PiStudent /> Student
          </SelectItem>
          <SelectItem value="2">
            <PiChalkboardTeacher />
            Teacher
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelect;
