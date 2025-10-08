import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

export const RememberForgot = ({ control }) => {
  return (
    <div className="flex items-center justify-between">
      <FormField
        control={control}
        name="remember"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-primary"
              />
            </FormControl>
            <FormLabel className="text-sm font-normal cursor-pointer">
              Remember me
            </FormLabel>
          </FormItem>
        )}
      />
      <Link
        to="/forgot-password"
        className="text-sm text-primary hover:underline transition-colors"
      >
        Forgot password?
      </Link>
    </div>
  );
};
