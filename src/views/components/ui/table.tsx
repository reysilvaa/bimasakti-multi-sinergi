import type { ComponentChildren, JSX } from "preact";

export function Table({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLTableElement> & { children?: ComponentChildren }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-left text-xs ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLTableSectionElement> & {
  children?: ComponentChildren;
}) {
  return (
    <thead
      className={`bg-mist-50/70 border-b border-black/[0.05] text-[11px] font-semibold text-ink-800/50 uppercase tracking-wider ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLTableSectionElement> & {
  children?: ComponentChildren;
}) {
  return (
    <tbody
      className={`divide-y divide-black/[0.04] text-ink-800/80 ${className}`}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLTableRowElement> & { children?: ComponentChildren }) {
  return (
    <tr
      className={`hover:bg-black/[0.02] transition-colors duration-150 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLTableCellElement> & {
  children?: ComponentChildren;
}) {
  return (
    <th className={`py-2.5 px-4 font-semibold ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLTableCellElement> & {
  children?: ComponentChildren;
}) {
  return (
    <td className={`py-3 px-4 ${className}`} {...props}>
      {children}
    </td>
  );
}
