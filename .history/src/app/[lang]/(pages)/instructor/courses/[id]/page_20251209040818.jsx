

// ----------------------------
// Sub Components
// ----------------------------
function HeaderSection({
  course,
  onEdit,
  onUpload,
  onUploadImage,
  onDelete,
  deleting,
}) {
  return (
    <div className="bg-card border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">
              {course.title}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge
                variant={course.status === "public" ? "default" : "secondary"}
                className="font-medium"
              >
                {course.status || "Draft"}
              </Badge>
              <span className="text-sm text-muted-foreground font-medium">
                {course.category || "General"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onUpload}>
            <Upload className="w-4 h-4 mr-2" />
           {t('instructor.courseDetails.uploadVideos')}
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={deleting}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the course and all its content.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function CoverImageSection({ course, onUploadImage }) {
  return (
    <div className="relative w-full h-80 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background border shadow-lg group">
      {course.coverImage?.url ? (
        <>
          <img
            src={course.coverImage.url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No cover image</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
        <Button onClick={onUploadImage} size="lg" className="shadow-xl">
          <ImageIcon className="w-5 h-5 mr-2" />
          {course.coverImage?.url ? "Change Cover" : "Upload Cover"}
        </Button>
      </div>
      {course.coverImage?.url && (
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            {course.title}
          </h2>
          <p className="text-white/90 mt-2 text-lg drop-shadow-md">
            {course.category}
          </p>
        </div>
      )}
    </div>
  );
}

function StatsSection({ course }) {
  const stats = [
    {
      label: "Price",
      value: `$${course.price}`,
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      borderColor: "border-emerald-200 dark:border-emerald-900",
    },
    {
      label: "Duration",
      value: course.duration || "N/A",
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-900",
    },
    {
      label: "Enrolled Students",
      value: course.enrolledStudents?.length || 0,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-900",
    },
    {
      label: "Level",
      value: course.level || "All Levels",
      icon: BarChart3,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      borderColor: "border-orange-200 dark:border-orange-900",
    },
    {
      label: "Progress Tracking",
      value: course.progress?.length || 0,
      icon: TrendingUp,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
      borderColor: "border-cyan-200 dark:border-cyan-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map(
        ({ label, value, icon: Icon, color, bgColor, borderColor }) => (
          <div
            key={label}
            className={cn(
              "bg-card rounded-xl p-5 border-2 shadow-sm hover:shadow-md transition-all",
              borderColor
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={cn(
                  "w-11 h-11 rounded-lg flex items-center justify-center",
                  bgColor
                )}
              >
                <Icon className={cn("w-5 h-5", color)} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
          </div>
        )
      )}
    </div>
  );
}

function InfoSection({ course }) {
  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-card-foreground">
          Course Description
        </h2>
      </div>
      <p className="text-muted-foreground leading-relaxed text-base">
        {course.description || "No description provided."}
      </p>
    </div>
  );
}

function PrerequisitesSection({ course }) {
  if (!course.prerequisites) return null;

  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-card-foreground">
          Prerequisites
        </h2>
      </div>
      <p className="text-muted-foreground leading-relaxed text-base">
        {course.prerequisites}
      </p>
    </div>
  );
}

function DetailsCard({ course }) {
  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <h2 className="text-xl font-bold text-card-foreground mb-5 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        Course Details
      </h2>
      <div className="space-y-4">
        <DetailItem
          icon={Globe}
          label="Language"
          value={course.language || "English"}
        />
        <DetailItem
          icon={BarChart3}
          label="Difficulty Level"
          value={course.level || "All Levels"}
        />
        <DetailItem
          icon={Video}
          label="Total Videos"
          value={`${course.videos?.length || 0} lessons`}
        />
        <DetailItem
          icon={Calendar}
          label="Created"
          value={
            course.createdAt
              ? new Date(course.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"
          }
        />
        <DetailItem
          icon={Calendar}
          label="Last Updated"
          value={
            course.updatedAt
              ? new Date(course.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"
          }
        />
      </div>
    </div>
  );
}

function InstructorCard({ course }) {
  if (!course.instructor) return null;

  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <h2 className="text-xl font-bold text-card-foreground mb-5 flex items-center gap-2">
        <UserCheck className="w-5 h-5 text-primary" />
        Instructor
      </h2>
      <div className="flex items-center gap-4">
        {course.instructor.profileImage ? (
          <img
            src={"/auth/login.png"}
            alt={course.instructor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
            <UserCheck className="w-8 h-8 text-primary" />
          </div>
        )}
        <div>
          <p className="font-bold text-card-foreground text-lg">
            {course.instructor.name}
          </p>
          <p className="text-sm text-muted-foreground">Course Instructor</p>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="font-semibold text-card-foreground">{value}</p>
      </div>
    </div>
  );
}

function EnrollmentSection({ course }) {
  const enrolledCount = course.enrolledStudents?.length || 0;

  if (enrolledCount === 0) return null;

  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Enrolled Students
        </h2>
        <Badge variant="secondary" className="text-base px-3 py-1">
          {enrolledCount} {enrolledCount === 1 ? "Student" : "Students"}
        </Badge>
      </div>
      <p className="text-muted-foreground">
        This course currently has {enrolledCount} enrolled{" "}
        {enrolledCount === 1 ? "student" : "students"}.
      </p>
    </div>
  );
}

function VideosSection({ course, onPlay, onDelete }) {
  if (!course.videos?.length) {
    return (
      <div className="bg-card rounded-xl p-12 border shadow-sm text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Video className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-card-foreground mb-2">
          No Videos Yet
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Start building your course by uploading video lessons. Your students
          will be able to access them once published.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          Course Content
        </h2>
        <Badge variant="secondary" className="text-base px-3 py-1">
          {course.videos.length}{" "}
          {course.videos.length === 1 ? "Video" : "Videos"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {course.videos.map((video, i) => (
          <div
            key={video._id || i}
            className="group relative rounded-xl border-2 overflow-hidden hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
          >
            <div className="relative aspect-video bg-muted">
              {video.url ? (
                <video src={video.url} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={() => onPlay(video)}
                  size="icon"
                  className="w-14 h-14 rounded-full shadow-xl"
                >
                  <PlayCircle className="w-7 h-7" />
                </Button>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => onDelete(video)}
                  className="rounded-full shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 bg-card">
              <p className="font-semibold text-sm text-card-foreground truncate">
                {video.title || `Lesson ${i + 1}`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Video {i + 1} of {course.videos.length}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditCourseDialog({
  open,
  setOpen,
  editData,
  setEditData,
  onSave,
  loading,
}) {
  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course Information</DialogTitle>
          <DialogDescription>
            Update your course details. All fields are optional - only updated
            fields will be changed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Course Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Enter course title"
                  value={editData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price ($) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={editData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what students will learn in this course..."
                value={editData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Input
                  id="category"
                  placeholder="e.g., Web Development"
                  value={editData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium">
                  Language
                </Label>
                <Input
                  id="language"
                  placeholder="e.g., English, Arabic"
                  value={editData.language}
                  onChange={(e) =>
                    handleInputChange("language", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Course Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Course Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-medium">
                  Difficulty Level
                </Label>
                <Select
                  value={editData.level}
                  onValueChange={(value) => handleInputChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="all levels">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Course Status
                </Label>
                <Select
                  value={editData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Additional Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="prerequisites" className="text-sm font-medium">
                Prerequisites
              </Label>
              <Textarea
                id="prerequisites"
                placeholder="What should students know before taking this course? (Optional)"
                value={editData.prerequisites}
                onChange={(e) =>
                  handleInputChange("prerequisites", e.target.value)
                }
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                List any required knowledge, skills, or tools students should
                have
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={
              loading ||
              !editData.title ||
              !editData.description ||
              !editData.price ||
              !editData.category
            }
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>

        {/* Required Fields Note */}
        <div className="text-xs text-muted-foreground border-t pt-3">
          <p>* Required fields: Title, Description, Price, and Category</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UploadCoverImageDialog({
  open,
  setOpen,
  selectedCoverImage,
  imagePreview,
  onFileSelect,
  onRemoveImage,
  onUpload,
  loading,
  currentCoverImage,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Cover Image</DialogTitle>
          <DialogDescription>
            Choose a new cover image for your course. Recommended: 1280x720
            pixels, max 5MB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Cover Image Preview */}
          {currentCoverImage && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Current Cover</Label>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={currentCoverImage}
                  alt="Current cover"
                  className="w-full h-32 object-cover"
                />
              </div>
            </div>
          )}

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">New Cover Image</Label>
            {!selectedCoverImage ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/40 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileSelect}
                  className="hidden"
                  id="cover-image-upload"
                />
                <label
                  htmlFor="cover-image-upload"
                  className="cursor-pointer block"
                >
                  <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to select an image
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, JPEG up to 5MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Selected Image</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onRemoveImage}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedCoverImage.name}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={onUpload} disabled={loading || !selectedCoverImage}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Cover
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UploadVideosDialog({
  open,
  setOpen,
  selectedFiles,
  onFileSelect,
  onUpload,
  loading,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload New Videos</DialogTitle>
          <DialogDescription>
            Select multiple video files to upload to this course.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/40 transition-colors">
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={onFileSelect}
              className="hidden"
              id="video-upload"
            />
            <label htmlFor="video-upload" className="cursor-pointer block">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to select video files
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports multiple files
              </p>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium text-foreground mb-2">
                Selected files ({selectedFiles.length}):
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="text-xs text-muted-foreground truncate"
                  >
                    • {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onUpload}
            disabled={loading || !selectedFiles.length}
          >
            <Upload className="w-4 h-4 mr-2" />
            {loading ? "Uploading..." : "Upload Videos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VideoDialog({ video, onClose }) {
  return (
    <Dialog open={!!video} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            {video?.title}
          </DialogTitle>
        </DialogHeader>
        {video && (
          <video
            src={video.url}
            controls
            autoPlay
            className="w-full rounded-lg border"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function DeleteVideoDialog({ video, onCancel, onConfirm }) {
  return (
    <AlertDialog open={!!video} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this video?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently remove "{video?.title}" from the
            course.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
