import { cn } from "../lib/utils";

export const Card = ({ children, className = "", ...props }) => (
  <div
    className={cn(
      "rounded-lg border border-purple-500/20 bg-white/5 backdrop-blur-sm shadow-lg",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = "", ...props }) => (
  <div className={cn("p-6 pb-0", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "", ...props }) => (
  <h3
    className={cn("text-2xl font-bold leading-none text-white", className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({ children, className = "", ...props }) => (
  <p className={cn("text-purple-200 mt-2", className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = "", ...props }) => (
  <div className={cn("p-6", className)} {...props}>
    {children}
  </div>
);
