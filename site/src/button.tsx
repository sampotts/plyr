import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

const button = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm ring-1 shadow-sm text-center font-medium no-underline motion-safe:transition-all',
    'hocus:shadow-md hocus:shadow-black/5 dark:hocus:shadow-black/40',
    'motion-safe:active:translate-y-px motion-safe:active:shadow-none',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-white ring-brand/15 text-brand-600 hocus:ring-brand/30 dark:bg-brand/10 dark:text-brand-100 dark:ring-brand/20 dark:hocus:ring-brand/30',
        primary:
          'bg-brand ring-brand-600 dark:ring-brand-400 text-white text-shadow-2xs hocus:ring-brand-700 dark:hocus:ring-brand-300',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

type AnchorProps = ComponentProps<'a'> & { href: string };
type NativeButtonProps = ComponentProps<'button'> & { href?: undefined };

export type ButtonProps = VariantProps<typeof button> & (AnchorProps | NativeButtonProps);

/** Renders a link when given an `href`, otherwise a `<button type="button">`. */
export function Button({ variant, className, ...props }: ButtonProps) {
  const classes = button({ variant, className });
  if (props.href !== undefined) return <a {...props} className={classes} />;
  return <button type="button" {...props} className={classes} />;
}
