"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export function DeleteConfirmDialog({
    open,
    onClose,
    onConfirm,
    type = "item",     // "course", "user"
    name = "",         // item name
    count = 1,
}) {
    const label = count > 1
        ? `${count} ${type}s`
        : name
            ? `"${name}"`
            : `this ${type}`;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Delete {label}?
                    </DialogTitle>

                    <DialogDescription className="text-sm leading-relaxed">
                        This action{" "}
                        <span className="font-semibold text-red-500">
                            cannot be undone
                        </span>. <br />
                        The {type} {name && <span className="font-semibold">"{name}"</span>}
                        will be permanently removed from the system.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-3 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        className="flex items-center gap-2"
                        onClick={onConfirm}
                    >
                        <Trash size={16} />
                        Delete Permanently
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
