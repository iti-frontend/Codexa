"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash, Mail, User, Shield, Calendar } from "lucide-react";

export default function UserDetailsDrawer({
    open,
    onClose,
    user,
    onDelete,
}) {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg rounded-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        User Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">

                    {/* ========== USER AVATAR ========== */}
                    <div className="flex flex-col items-center text-center gap-3">
                        <Avatar className="w-24 h-24 border shadow">
                            <AvatarImage src={user.profileImage} />
                            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>

                        <div>
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-muted-foreground text-sm">{user.email}</p>
                        </div>

                        <Badge variant="secondary" className="px-3 py-1 text-xs">
                            {user.role || "User"}
                        </Badge>
                    </div>

                    {/* ========== USER INFO ========== */}
                    <div className="space-y-4 border rounded-xl p-4 bg-muted/30">
                        <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Name:</span>
                            <span className="text-muted-foreground">{user.name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Email:</span>
                            <span className="text-muted-foreground">{user.email}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Role:</span>
                            <span className="text-muted-foreground">
                                {user.role || "Student"}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Joined:</span>
                            <span className="text-muted-foreground">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* ========== ACTIONS ========== */}
                    <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>

                        <Button
                            variant="destructive"
                            className="
                flex items-center gap-2 bg-red-600 
                hover:bg-red-700 hover:shadow-[0_0_10px_rgba(255,0,0,0.5)"
                            onClick={() => onDelete(user)}
                        >
                            <Trash size={16} />
                            Delete User
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
