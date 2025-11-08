export function Divider({ children }) {
  return (
    <div className="flex items-center my-4">
      <span className="flex-1 border-t border-gray-300"></span>
      {children && (
        <span className="mx-2 text-base text-primary px-2">{children}</span>
      )}
      <span className="flex-1 border-t border-gray-300"></span>
    </div>
  );
}
