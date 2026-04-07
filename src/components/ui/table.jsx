import { cn } from '@/lib/utils';

function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-auto" data-slot="table-container">
      <table className={cn('w-full caption-bottom text-sm', className)} data-slot="table" {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }) {
  return <thead className={cn('[&_tr]:border-b', className)} data-slot="table-header" {...props} />;
}

function TableBody({ className, ...props }) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} data-slot="table-body" {...props} />;
}

function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      data-slot="table-row"
      {...props}
    />
  );
}

function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        'text-muted-foreground h-10 px-4 text-left align-middle text-[10px] font-medium tracking-[0.16em] uppercase whitespace-nowrap',
        className,
      )}
      data-slot="table-head"
      {...props}
    />
  );
}

function TableCell({ className, ...props }) {
  return <td className={cn('p-4 align-middle', className)} data-slot="table-cell" {...props} />;
}

function TableCaption({ className, ...props }) {
  return <caption className={cn('text-muted-foreground mt-4 text-sm', className)} data-slot="table-caption" {...props} />;
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption };
