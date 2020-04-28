# Contributing

We welcome bug reports, feature requests and pull requests. If you want to help us out, please follow these guidelines, in order to avoid redundant work.

## Support

Before asking questions, read our [documentation](https://github.com/sampotts/plyr) and [FAQ](https://github.com/sampotts/plyr/wiki/FAQ).

If these doesn't answer your question

- Use [Stack Overflow](https://stackoverflow.com/) for questions that doesn't directly involve Plyr. This includes for example how to use Javascript, CSS or HTML5 media in general, and how to use other frameworks, libraries and technology.
- Use [our Slack](https://bit.ly/plyr-chat) if you need help using Plyr or have questions about Plyr.

## Commenting

When commenting, keep a civil tone and stay on topic. Don't ask for [support](#support), or post "+1" or "I agree" type of comments. Use the emojis instead.

Asking for the status on issues is discouraged. Unless someone has explicitly said in an issue that it's work in progress, most likely that means no one is working on it. We have a lot to do, and it may not be a top priority for us.

We _may_ moderate discussions. We do this to avoid threads being "hijacked", to avoid confusion in case the content is misleading or outdated, and to avoid bothering people with github notifications.

## Creating issues

Please follow the instructions in our issue templates. Don't use github issues to ask for [support](#support).

## Contributing features and documentation

- If you want to add a feature or make critical changes, you may want to ensure that this is something we also want (so you don't waste your time). Ask us about this in the corresponding issue if there is one, or on [our Slack](https://bit.ly/plyr-chat) otherwise.

- Fork Plyr, and create a new branch in your fork, based on the **develop** branch

- To test locally, you can use the demo site. First make sure you have installed the dependencies with `npm install` or `yarn`. Run `gulp` to build and it will run a local web server for development and watch for any changes.

### Online one-click setup for contributing

You can use Gitpod (a free online VS Code-like IDE) for contributing. With a single click it will launch a workspace and automatically:

- clone the plyr repo.
- install the dependencies.
- run `gulp` to the start the server.

So that you can start straight away.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/from-referrer/)

- Develop and test your modifications.

- Preferably commit your changes as independent logical chunks, with meaningful messages. Make sure you do not commit unnecessary files or changes, such as the build output, or logging and breakpoints you added for testing.

- If your modifications changes the documented behavior or add new features, document these changes in [README.md](README.md).

- When finished, push the changes to your GitHub repository and send a pull request to **develop**. Describe what your PR does.

- If the Travis build fails, or if you get a code review with change requests, you can fix these by pushing new or rebased commits to the branch.
