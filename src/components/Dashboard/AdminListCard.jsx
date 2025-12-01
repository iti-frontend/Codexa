"use client";

import { useState, useMemo } from "react";
import {
    Search,
    MoreHorizontal,
    User,
    X,
    Trash,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";


export default function AdminListCard({
    title = "List",
    items = [],
    itemKey = "name",
    itemImageKey = "profileImage",
    itemSubKey = "email",

    // Callbacks
    onView = () => { },
    onDelete = () => { },
    onDeleteMany = () => { },

    // Optional filters → ["Student", "Instructor"]
    filters = [],
}) {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [selected, setSelected] = useState([]);

    // ------------------------------
    // Filter + Search Logic
    // ------------------------------
    const filteredItems = useMemo(() => {
        let result = [...items];

        if (activeFilter !== "all") {
            result = result.filter((i) => i.role === activeFilter);
        }

        if (search.trim()) {
            result = result.filter((i) =>
                i[itemKey]?.toLowerCase().includes(search.toLowerCase())
            );
        }

        return result;
    }, [items, search, activeFilter]);

    // ------------------------------
    // Selection Logic
    // ------------------------------
    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selected.length === filteredItems.length) {
            setSelected([]);
        } else {
            setSelected(filteredItems.map((i) => i._id));
        }
    };

    const clearFilters = () => {
        setSearch("");
        setActiveFilter("all");
    };

    const hasActiveFilters = search || activeFilter !== "all";

    // ------------------------------
    // UI Rendering
    // ------------------------------
    return (
        <Card className="w-full rounded-xl border bg-card p-4">
            {/* ================= SEARCH BAR (Centered) ================= */}
            <div className="w-full flex justify-center mb-6">
                <div className="relative w-full max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />

                    <Input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
                pl-12 pr-12
                h-12
                text-base
                rounded-xl
                border border-border
                bg-background/60
                focus:ring-2 focus:ring-primary/50
                transition-all
            "
                    />

                    {search && (
                        <X
                            className="
                    absolute right-4 top-1/2 -translate-y-1/2
                    h-5 w-5
                    text-muted-foreground cursor-pointer
                    hover:text-foreground transition
                "
                            onClick={() => setSearch("")}
                        />
                    )}
                </div>
            </div>

            {/* ================= DELETE SELECTED (Right aligned) ================= */}
            <div className="flex justify-end mb-4">
                {selected.length > 0 && (
                    <Button
                        variant="destructive"
                        className="
                flex items-center gap-2 px-4 py-2 text-sm
                bg-red-600 hover:bg-red-700
                hover:shadow-[0_0_10px_rgba(255,0,0,0.5)]
                transition-all duration-200
            "
                        onClick={() => onDeleteMany(selected)}
                    >
                        <Trash size={14} />
                        Delete Permanently ({selected.length})
                    </Button>
                )}
            </div>

            {/* ================= USER LIST ================= */}
            <CardContent className="space-y-3">
                {filteredItems.length === 0 && (
                    <p className="text-muted-foreground text-sm">No users found.</p>
                )}

                {/* Select All */}
                {filteredItems.length > 0 && (
                    <div className="flex items-center gap-3 px-2">
                        <input
                            type="checkbox"
                            checked={selected.length === filteredItems.length}
                            onChange={toggleSelectAll}
                        />
                        <span className="text-sm text-muted-foreground">Select All</span>
                    </div>
                )}

                {filteredItems.map((item) => (
                    <div
                        key={item._id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/40 transition"
                    >
                        <div className="flex items-center gap-3">

                            <input
                                type="checkbox"
                                checked={selected.includes(item._id)}
                                onChange={() => toggleSelect(item._id)}
                            />

                            {/* Avatar */}
                            {item[itemImageKey] ? (
                                <img
                                    src={item[itemImageKey]}
                                    className="w-12 h-12 rounded-full object-cover border"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                    <User className="text-muted-foreground" size={20} />
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <p className="font-medium text-foreground">{item[itemKey]}</p>
                                {item[itemSubKey] && (
                                    <p className="text-sm text-muted-foreground">
                                        {item[itemSubKey]}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreHorizontal className="cursor-pointer text-muted-foreground" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onView(item)}>
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-500"
                                    onClick={() => onDelete(item)}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
