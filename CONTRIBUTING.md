# Contributing

We welcome bug reports, feature requests and pull requests. If you want to help us out, please follow these guidelines, in order to avoid redundant work.

## Commenting
When commenting, keep a civil tone and stay on topic. Don't ask for support (use [Stack Overflow](https://stackoverflow.com/) or [our Slack](https://bit.ly/plyr-chat) for that), or post "+1" or "I agree" type of comments. Use the emojis instead.

Asking for the status on issues is discouraged. Unless someone has explicitly said in an issue that it's work in progress, most likely that means no one is working on it. We have a lot to do, and it may not be a top priority for us.

We *may* moderate discussions. We do this to avoid threads being "hijacked", to avoid confusion in case the content is misleading or outdated, and to avoid bothering people with github notifications.

## Reporting issues

Our GitHub issue tracker is for bug reports and feature requests. Don't ask for support here. Use [Stack Overflow](https://stackoverflow.com/) or [our Slack](https://bit.ly/plyr-chat) for that.

Please verify that your issue hasn't already been answered by our [FAQ](https://github.com/sampotts/plyr/wiki/FAQ), and that there isn't already an open issue for it.

When applicable, check that your problem doesn't happen without Plyr (see [FAQ#1](https://github.com/sampotts/plyr/wiki/FAQ#1-does-plyr-work-with--)).

Verify that you are following the documentation, are using the latest version of Plyr, and aren't getting any errors in your own code, causing the issues.

Create one issue per problem or request (i.e. don't combine multiple problems to one git issue). Describe the issue as detailed as possible (see [Replication](#replication))

## Replication

In order to solve a problem, we first need to understand it. Please answer these questions when reporting issues or asking for help in [our Slack](https://bit.ly/plyr-chat).

* Does it happen only with specific options and/or specific browsers?
* Does is happen only with HTML5 video, audio, YouTube, Vimeo or a specific library?
* Does the issue happen on [our demo](https://plyr.io/)? If not, please recreate it with a **minimal** example online. You can use our Codepen templates to get started:
  * [HTML5 video](https://codepen.io/pen?template=bKeqpr)
  * [HTML5 audio](https://codepen.io/pen?template=rKLywR)
  * [YouTube](https://codepen.io/pen?template=GGqbbJ)
  * [Vimeo](https://codepen.io/pen?template=bKeXNq)
  * [Dash.js integration](https://codepen.io/pen?template=zaBgBy)
  * [Hls.js integration](https://codepen.io/pen?template=oyLKQb)
  * [Shaka Player integration](https://codepen.io/pen?template=ZRpzZO)

It's important that you keep the issue description and replication demo **minimal**. If your replication includes frameworks, libraries or customizations, this makes it harder to debug and understand the issue. While it may be relevant to bring this up (ex: "I need Plyr to trigger the event sooner or it breaks Framework X"), please keep these out of your replication demo if they aren't strictly needed to reproduce the issue. If the issue is caused by something a library does that Plyr doesn't handle, it's more helpful for us if you find out what it is, and replicate the same problem without the library. Otherwise any developer who is willing to help out with the issue has to understand the frameworks, libraries and customizations of *your* choice, or no one will try to fix your issue because it's too much work.

## Requesting features and improvements

If you are missing something in Plyr, you can create a GitHub issue for this as well. Since we prioritize fixing bugs first, and may have a lot of other suggestions and architectural changes to work on as well, these may not be at the top of our list. 

If your suggestion is important or urgent to you, you may want to first ensure it's something we want to have in Plyr, and then contribute it as a pull request. [Our Slack](https://bit.ly/plyr-chat) is the best place for questions like this.

## Contributing features and documentation

* Fork Plyr, and create a new branch in your fork, based on the **develop** branch

* To test locally, you can use the demo. First make sure you have installed the dependencies with `npm install` or `yarn`. Run `gulp` to build while you are working, and run a local server from the repository root directory. If you have Python installed, this command should work: `python -m SimpleHTTPServer 8080`. Then go to `http://localhost:8080/demo/`

* Develop and test your modifications.

* Preferably commit your changes as independent logical chunks, with meaningful messages. Make sure you do not commit unnecessary files or changes, such as the build output, or logging and breakpoints you added for testing.

* If your modifications changes the documented behavior or add new features, document these changes in readme.md.

* When finished, push the changes to your GitHub repository and send a pull request to **develop**. Describe what your PR does.

* If the Travis build fails, or if you get a code review with change requests, you can fix these by pushing new or rebased commits to the branch.
