import { cva, VariantProps } from 'class-variance-authority';

export const toastVariants = cva(
  'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
  {
    variants: {
      variant: {
        default: 'group-[.toaster]:bg-background group-[.toaster]:text-foreground',

        destructive:
          'destructive group-[.toaster]:bg-red-600 group-[.toaster]:text-white group-[.toaster]:border-red-700 dark:group-[.toaster]:bg-red-700 dark:group-[.toaster]:border-red-800',
        success:
          'success group-[.toaster]:bg-green-600 group-[.toaster]:text-white group-[.toaster]:border-green-700 dark:group-[.toaster]:bg-green-700 dark:group-[.toaster]:border-green-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type ZardToastVariants = VariantProps<typeof toastVariants>;