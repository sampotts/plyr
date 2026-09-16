import { SpeedInsights } from '@vercel/speed-insights/react';
import { Button } from './button';
import { Player } from './player';

export function App() {
  return (
    <>
      <SpeedInsights />
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-1 flex-col-reverse items-center gap-12 p-4 lg:max-w-7xl lg:flex-row lg:gap-20 lg:p-12">
        <header className="flex flex-col gap-8 pb-4 text-center md:text-left lg:max-w-96 lg:flex-1 lg:pb-0">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.15] font-bold tracking-tight text-balance text-brand">
            Plyr, meet Video.js 👋
          </h1>
          <p className="lg:text-normal leading-relaxed text-brand-900 dark:text-brand-100">
            The folks behind Plyr, Vidstack and Media Chrome have joined forces to build the latest version of Video.js:
            one modern, accessible player with the best of all three. Plyr will soon be deprecated, so give Video.js a
            try.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <Button href="https://videojs.org/?ref=plyr" variant="primary">
              Check out Video.js
            </Button>
            <Button href="https://github.com/sampotts/plyr">Docs for Plyr</Button>
          </div>
        </header>

        <main className="w-full min-w-0 text-center lg:m-auto lg:flex-1">
          <Player />
        </main>
      </div>
    </>
  );
}
