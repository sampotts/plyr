#!/bin/bash
if [ "$TRAVIS_PULL_REQUEST" != "false" ] && [ $TRAVIS_BRANCH == "master" ] && $(git diff --name-only $TRAVIS_COMMIT_RANGE | grep -q "^src/"); then
	echo 'The base branch for pull requests must be "develop"' >&2
	exit 1
fi
