// components/FormTextarea.js
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export const FormTextarea = ({
  control,
  name,
  label,
  placeholder,
  rows = 3,
  rules,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className="font-semibold text-sm">{label}</FormLabel>
          )}
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              rows={rows}
              className="resize-none"
            />
          </FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )}
    />
  );
};
