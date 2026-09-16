// Type declarations for task dependencies that ship without them.

declare module 'svgstore' {
  interface Sprite {
    add(id: string, svg: string): Sprite;
    toString(options?: { inline?: boolean }): string;
  }
  export default function svgstore(): Sprite;
}
