// src/components/ui/divider.jsx
export function Divider({ children, className }) {
  return (
    <div className={`relative my-4 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      {children && (
        <div className="relative flex justify-center text-[16px] ">
          <span className="bg-white px-2 text-gray-800">{children}</span>
        </div>
      )}
    </div>
  );
}
