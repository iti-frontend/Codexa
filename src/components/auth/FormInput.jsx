import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const FormInput = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  error,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className="font-semibold text-sm">{label}</FormLabel>
          )}
          <div className="flex items-center relative">
            {Icon && (
              <span className="absolute left-3 flex items-center justify-center">
                <Icon className="h-5 w-5 text-gray-400" />
              </span>
            )}
            <FormControl>
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                className={`${Icon ? "pl-10" : ""} transition-colors ${
                  error ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
              />
            </FormControl>
          </div>
          <FormMessage className="text-red-500 text-xs border border-border p-2 rounded-lg" />
        </FormItem>
      )}
    />
  );
};
