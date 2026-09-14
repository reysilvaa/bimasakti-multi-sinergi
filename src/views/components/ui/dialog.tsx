import type { ComponentChildren, JSX } from "preact";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ComponentChildren;
  id?: string;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  children,
  id,
  className = "",
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div
      id={id}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm print:static print:p-0 print:bg-transparent ${className}`}
    >
      {children}
    </div>
  );
}

export function DialogContent({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren }) {
  return (
    <div
      className={`bg-white rounded-2xl max-w-md w-full shadow-2xl border border-black/[0.08] overflow-hidden print:w-full print:max-w-none print:shadow-none print:border-none print:p-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogHeader({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren }) {
  return (
    <div
      className={`px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-mist-50/40 print:hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogTitle({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLHeadingElement> & { children?: ComponentChildren }) {
  return (
    <h3 className={`text-sm font-bold text-ink-900 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function DialogFooter({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren }) {
  return (
    <div
      className={`px-6 py-4 border-t border-black/[0.06] flex items-center justify-end gap-2.5 bg-mist-50/30 print:hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
