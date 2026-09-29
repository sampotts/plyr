import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

/** Shared chrome for the button-shaped variants. Kept out of the base so the `link` variant stays a plain inline link. */
const chrome = [
  'inline-flex items-center justify-center gap-1 rounded-lg px-4 py-2.5 text-sm ring-1 shadow-sm text-center motion-safe:transition-[box-shadow,background]',
  'hocus:shadow-md hocus:shadow-black/5 dark:hocus:shadow-black/40',
  'motion-safe:active:translate-y-px motion-safe:active:shadow-none!',
];

const button = cva('font-medium no-underline', {
  variants: {
    variant: {
      default: [
        ...chrome,
        'bg-white ring-brand/15 text-brand-600 hocus:ring-brand/30 dark:bg-brand/10 dark:text-brand-100 dark:ring-brand/20 dark:hocus:bg-brand/20',
      ],
      primary: [
        ...chrome,
        'bg-brand ring-brand-600 dark:ring-brand-400 text-white text-shadow-2xs hocus:ring-brand-700 dark:hocus:bg-brand-600 dark:hocus:ring-brand-500',
      ],
      /* Inline text link. The underline is a pseudo-element that thickens from 1px to 2px on hover and focus.
         `inline-block` keeps the link on one line so the absolutely positioned underline covers all of it, and
         forced-colours mode falls back to a real underline because backgrounds are stripped there. */
      link: [
        'relative inline-block text-brand-800 dark:text-brand-100 hocus:text-brand-900 dark:hocus:text-white',
        'after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-current',
        'motion-safe:transition-colors motion-safe:after:transition-[height] hocus:after:h-0.5',
        'forced-colors:underline',
      ],
    },
  },
  defaultVariants: { variant: 'default' },
});

type AnchorProps = ComponentProps<'a'> & { href: string };
type NativeButtonProps = ComponentProps<'button'> & { href?: undefined };

export type ButtonProps = VariantProps<typeof button> & (AnchorProps | NativeButtonProps);

/** Renders a link when given an `href`, otherwise a `<button type="button">`. */
export function Button({ variant, className, ...props }: ButtonProps) {
  const classes = button({ variant, className });
  if (props.href !== undefined) return <a {...props} className={classes} />;
  return <button type="button" {...props} className={classes} />;
}
