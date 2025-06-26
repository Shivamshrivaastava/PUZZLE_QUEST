import { cn } from "../lib/utils";

const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-purple-500/30 bg-white/10 px-3 py-2 text-white placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
};

export default Input;
