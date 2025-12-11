"use client";

import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Trash,
    Mail,
    User,
    Shield,
    Calendar,
    KeyRound,
    CheckCircle,
} from "lucide-react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useState } from "react";
import { useAdminDeleteUsers } from "@/hooks/useAdminDelete";
import { toast } from "sonner";

export default function UserDetailsDrawer({
    open,
    onClose,
    user,
    loading = false,
    error = null,
    role = "",
    onRefetch = () => {},
}) {
    const { t } = useTranslation();
    const isEmpty = !user && !loading;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { deleteUsers } = useAdminDeleteUsers(role);

    async function confirmDelete() {
        try {
            const ok = await deleteUsers(user._id);

            if (ok) {
                toast.success(t("admin.users.toast.deleteSuccess"), {
                    description: t("admin.users.toast.userRemoved", { name: user.name }),
                });

                onRefetch();
                onClose();
            }
        } catch (err) {
            console.error("Delete error:", err);
            toast.error(t("admin.users.toast.deleteFailed"));
        } finally {
            setShowDeleteDialog(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg rounded-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {t("admin.users.details.title")}
                    </DialogTitle>
                </DialogHeader>

                {/* LOADING STATE */}
                {loading && (
                    <div className="py-12 flex justify-center">
                        <div className="animate-spin h-10 w-10 border-b-2 border-indigo-500 rounded-full"></div>
                    </div>
                )}

                {/* ERROR STATE */}
                {error && !loading && (
                    <p className="text-red-500 text-center py-8">{error}</p>
                )}

                {/* EMPTY STATE */}
                {isEmpty && !loading && (
                    <p className="text-center text-muted-foreground py-8">
                        {t("admin.users.details.noUser")}
                    </p>
                )}

                {/* USER CONTENT */}
                {!loading && user && (
                    <div className="space-y-6">
                        {/* AVATAR + NAME */}
                        <div className="flex flex-col items-center text-center gap-3">
                            <Avatar className="w-24 h-24 border shadow">
                                <AvatarImage src={user.profileImage} />
                                <AvatarFallback>
                                    {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <h2 className="text-xl font-semibold">{user.name}</h2>
                                <p className="text-muted-foreground text-sm">{user.email}</p>
                            </div>

                            <Badge variant="secondary" className="px-3 py-1 text-xs">
                                {user.role}
                            </Badge>
                        </div>

                        {/* INFO SECTION */}
                        <div className="space-y-4 border rounded-xl p-4 bg-muted/30">
                            {/* NAME */}
                            <InfoRow 
                                icon={<User />} 
                                label={t("admin.users.details.name")} 
                                value={user.name} 
                            />

                            {/* EMAIL */}
                            <InfoRow 
                                icon={<Mail />} 
                                label={t("admin.users.details.email")} 
                                value={user.email} 
                            />

                            {/* ROLE */}
                            <InfoRow
                                icon={<Shield />}
                                label={t("admin.users.details.role")}
                                value={user.role}
                            />

                            {/* VERIFIED */}
                            <InfoRow
                                icon={<CheckCircle />}
                                label={t("admin.users.details.emailVerified")}
                                value={user.emailVerified 
                                    ? t("admin.users.details.yes") 
                                    : t("admin.users.details.no")
                                }
                                valueClass={
                                    user.emailVerified
                                        ? "text-green-600"
                                        : "text-red-500"
                                }
                            />

                            {/* AUTH PROVIDER */}
                            <InfoRow
                                icon={<KeyRound />}
                                label={t("admin.users.details.authProvider")}
                                value={user.authProvider}
                            />

                            {/* JOIN DATE */}
                            <InfoRow
                                icon={<Calendar />}
                                label={t("admin.users.details.joined")}
                                value={new Date(user.createdAt).toLocaleDateString()}
                            />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={onClose}>
                                {t("admin.users.details.close")}
                            </Button>

                            <Button
                                variant="destructive"
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 hover:shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash size={16} />
                                {t("admin.users.details.deleteUser")}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>

            <DeleteConfirmDialog
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDelete}
                count={1}
            />
        </Dialog>
    );
}

/** Info Row Component */
function InfoRow({ icon, label, value, valueClass = "" }) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="h-4 w-4 text-muted-foreground">{icon}</span>
            <span className="font-medium">{label}:</span>
            <span className={`text-muted-foreground ${valueClass}`}>{value}</span>
        </div>
    );
}