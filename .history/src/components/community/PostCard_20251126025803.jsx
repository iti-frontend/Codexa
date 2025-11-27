// في PostCard.js - عدل دالة formatDate و getUserName
// أضف هذه الدالة داخل PostCard component
const getUserName = (postUser) => {
  if (!postUser) return 'Anonymous User';
  
  if (postUser.name && postUser.name !== 'Anonymous User') {
    return postUser.name;
  }
  
  if (postUser.email) {
    return postUser.email.split('@')[0];
  }
  
  if (postUser.displayName) {
    return postUser.displayName;
  }
  
  return 'User';
};

// ثم في JSX عدل هذا الجزء:
<div>
  <p className="font-medium text-sm">
    {getUserName(post.user)}
  </p>
  <p className="text-xs text-muted-foreground">
    {formatDate(post.createdAt)}
  </p>
</div>