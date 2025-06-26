import { cn } from "../lib/utils";

// Badge Component
export const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-purple-600 text-white",
    outline: "border border-purple-400 text-purple-400",
    secondary: "bg-purple-200 text-purple-900",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};

// Progress Component
export const Progress = ({ value = 0, className = "" }) => (
  <div className={cn("w-full bg-purple-900/30 rounded-full h-2", className)}>
    <div
      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

// Label Component
export const Label = ({ children, className = "", ...props }) => (
  <label
    className={cn("text-sm font-medium text-purple-200", className)}
    {...props}
  >
    {children}
  </label>
);

// RadioGroup Components
export const RadioGroup = ({
  children,
  value,
  onValueChange,
  className = "",
}) => (
  <div
    className={cn("space-y-2", className)}
    onChange={(e) => onValueChange && onValueChange(e.target.value)}
  >
    {children}
  </div>
);

export const RadioGroupItem = ({ value, id, className = "", ...props }) => (
  <input
    type="radio"
    id={id}
    name="radio-group"
    value={value}
    className={cn(
      "h-4 w-4 text-purple-600 border-purple-400 focus:ring-purple-500 bg-transparent",
      className,
    )}
    {...props}
  />
);

// ScrollArea Component (simplified)
export const ScrollArea = ({ children, className = "" }) => (
  <div className={cn("overflow-auto", className)}>{children}</div>
);
