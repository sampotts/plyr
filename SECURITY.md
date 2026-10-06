# Security policy

## Supported versions

Plyr is deprecated and receives security updates only.

| Version | Supported                           |
| ------- | ----------------------------------- |
| 3.x     | Security updates until January 2028 |
| < 3     | No                                  |

After January 2028, no versions receive fixes. We recommend migrating to [Video.js 10](https://videojs.org?utm_source=plyr), which combines Plyr, Vidstack and Media Chrome into one modern, accessible player. See the migration guide for [HTML](https://videojs.org/docs/framework/html/guides/migrate-from-plyr?utm_source=plyr) or [React](https://videojs.org/docs/framework/react/guides/migrate-from-plyr?utm_source=plyr).

## Reporting a vulnerability

Please don't open a public issue or discussion for a security problem.

Report it privately with GitHub's [private vulnerability reporting](https://github.com/sampotts/plyr/security/advisories/new).

Include the version of Plyr you're using, a description of the issue and its impact, and steps to reproduce it. We'll acknowledge your report, keep you updated while we investigate, and credit you in the advisory unless you'd rather stay anonymous.

Security updates cover issues that let an attacker run script, read data, or otherwise compromise a site that embeds the player. Other bugs aren't fixed.
