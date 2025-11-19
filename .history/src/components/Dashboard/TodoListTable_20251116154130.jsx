"use client";
<Button variant="outline" size="sm" className="w-[150px] h-8 justify-start text-left">
<CalendarIcon className="mr-2 h-3 w-3" />
{editDate ? format(editDate, "PPP") : "Pick date"}
</Button>
</PopoverTrigger>
<PopoverContent className="w-auto p-0" align="start">
<Calendar mode="single" selected={editDate} onSelect={setEditDate} initialFocus />
</PopoverContent>
</Popover>
) : (
task.dueDate ? format(new Date(task.dueDate), "PPP") : "No date"
)}
</TableCell>


<TableCell>
<div className="flex gap-1">
{editingTaskId === getId(task) ? (
<>
<Button variant="ghost" size="sm" onClick={() => handleSaveEdit(task)} disabled={saving}>
<Save className="w-4 h-4" />
</Button>
<Button variant="ghost" size="sm" onClick={handleCancelEdit} disabled={saving}>
<X className="w-4 h-4" />
</Button>
</>
) : (
<>
<Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}>
<Edit className="w-4 h-4" />
</Button>
<Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task)}>
<Trash2 className="w-4 h-4" />
</Button>
</>
)}
</div>
</TableCell>
</TableRow>
))}
</TableBody>
</Table>


{filteredTasks.length === 0 && !loading && (
<div className="text-center py-8 text-muted-foreground">No tasks found. Create your first task!</div>
)}
</motion.div>
);
}