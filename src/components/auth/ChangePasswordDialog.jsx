"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

const formSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function ChangePasswordDialog({ open, onOpenChange }) {
  const { userToken } = useAuthStore();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Send API request
      const res = await api.put(
        "/instructors/change-password",
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      console.log(res);

      // Show success toast
      toast.success("Password Changed", {
        description: "Your password has been updated successfully.",
        duration: 3000,
      });

      onOpenChange(false);
      form.reset();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to change password. Try again.";
      toast.error("Error", { description: message, duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <Input
              type="password"
              placeholder="Enter current password"
              {...form.register("currentPassword")}
            />
            {form.formState.errors.currentPassword && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <Input
              type="password"
              placeholder="Enter new password"
              {...form.register("newPassword")}
            />
            {form.formState.errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="Confirm new password"
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
