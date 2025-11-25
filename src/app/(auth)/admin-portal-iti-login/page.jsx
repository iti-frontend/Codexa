"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth-schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";


export default function AdminLoginPage() {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const { handleAuth, setErr } = useAuthStore();

    const onSubmit = async (values) => {
        try {
            const res = await api.post(ENDPOINTS.ADMIN_AUTH.LOGIN, values);

            if (res.status === 200) {
                handleAuth(res.data);

                toast.success("Admin Login Successful", {
                    description: `Welcome back, ${res.data.admin.name}`,
                });

                router.push("/admin");
            }
        } catch (error) {
            toast.error("Login Failed", {
                description: setErr(error.response?.data?.message),
            });
        }
    };

    return (
        <div className=" flex items-center justify-center bg-muted/30 px-4 overflow-hidden">
            <Card className="w-full max-w-md shadow-lg border border-border rounded-2xl p-6">
                <CardHeader className="text-center space-y-1 p-0">
                    <h2 className="text-2xl font-bold text-primary">Admin Login</h2>
                    <p className="text-muted-foreground text-sm">
                        Sign in to access the admin panel
                    </p>
                </CardHeader>
                <CardContent className="space-y-4 p-0 mt-4">

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="admin@example.com"
                                {...form.register("email")}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                {...form.register("password")}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 p-0 mt-4">
                    <Button onClick={form.handleSubmit(onSubmit)} className="w-full">
                        Login
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                        Only authorized admins can access this portal
                    </p>
                </CardFooter>

            </Card>
        </div>
    );
}
