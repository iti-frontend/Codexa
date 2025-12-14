"use client";

import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function DeleteConfirmDialog({
    open,
    onClose,
    onConfirm,
    type = "item",     // "course", "user", "item"
    name = "",
    count = 1,
}) {
    const { t } = useTranslation();

    // Translate type
    const translatedType = t(`admin.deleteDialog.${type}`);

    // Build label
    const label = count > 1
        ? `${count} ${translatedType}s`
        : name
            ? `"${name}"`
            : `${t("admin.deleteDialog.this")} ${translatedType}`;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
                        </div>
                        <DialogTitle className="text-xl font-semibold">
                            {t("admin.deleteDialog.title", { label })}
                        </DialogTitle>
                    </div>

                    <DialogDescription className="text-base space-y-2">
                        <p>
                            {t("admin.deleteDialog.description")}{" "}
                            <span className="font-semibold text-red-600 dark:text-red-500">
                                {t("admin.deleteDialog.cannotUndo")}
                            </span>.
                        </p>
                        <p>
                            {t("admin.deleteDialog.willBeRemoved", { type: translatedType })}{" "}
                            {name && <span className="font-semibold">"{name}"</span>}{" "}
                            {t("admin.deleteDialog.permanently")}.
                        </p>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex gap-2 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        {t("admin.deleteDialog.cancel")}
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                        {t("admin.deleteDialog.confirmDelete")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}