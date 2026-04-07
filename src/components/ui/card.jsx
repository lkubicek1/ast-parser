import { cn } from '@/lib/utils';

function Card({ className, ...props }) {
  return (
    <div
      className={cn('bg-card text-card-foreground flex flex-col rounded-none border', className)}
      data-slot="card"
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-1.5 px-4 pt-4 md:px-5 md:pt-5', className)} data-slot="card-header" {...props} />;
}

function CardTitle({ className, ...props }) {
  return (
    <h2
      className={cn('text-sm font-medium tracking-[0.18em] text-primary uppercase', className)}
      data-slot="card-title"
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return <p className={cn('text-muted-foreground text-xs leading-5', className)} data-slot="card-description" {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn('px-4 pb-4 md:px-5 md:pb-5', className)} data-slot="card-content" {...props} />;
}

function CardFooter({ className, ...props }) {
  return <div className={cn('flex items-center px-4 pb-4 md:px-5 md:pb-5', className)} data-slot="card-footer" {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
