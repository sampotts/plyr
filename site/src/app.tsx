import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Button } from './button';
import { Player } from './player';

export function App() {
  return (
    <>
      <Analytics />
      <SpeedInsights />

      <div className="mx-auto flex min-h-svh w-full max-w-lg flex-col-reverse items-center justify-center gap-12 p-4 lg:max-w-7xl lg:flex-row lg:gap-20 lg:p-12">
        <header className="flex flex-col gap-8 pb-4 text-center md:text-left lg:max-w-96 lg:flex-1 lg:pb-0">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.15] font-bold tracking-tight text-balance text-brand">
            Plyr, meet Video.js 👋
          </h1>
          <p className="lg:text-normal leading-relaxed text-brand-800 dark:text-brand-100">
            The folks behind Plyr, Vidstack and Media Chrome have joined forces to build the latest version of Video.js:
            one modern, accessible player with the best of all three. Plyr is now deprecated and receives security
            updates only. Use Video.js 10 for new projects.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <Button href="https://videojs.org/?utm_source=plyr" variant="primary">
              Check out Video.js
            </Button>
            <Button href="https://videojs.org/docs/framework/html/guides/migrate-from-plyr?utm_source=plyr">
              Migrate from Plyr
            </Button>
          </div>
          <p className="text-sm text-brand-800 dark:text-brand-100/80">
            The{' '}
            <Button href="https://github.com/sampotts/plyr" variant="link">
              Plyr docs are on GitHub
            </Button>{' '}
            if you need them.
          </p>
        </header>

        <main className="w-full min-w-0 text-center lg:m-auto lg:flex-1">
          <Player />
        </main>
      </div>
    </>
  );
}
