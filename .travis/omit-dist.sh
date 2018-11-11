#!/bin/bash
if [ $TRAVIS_BRANCH == "develop" ] && $(git diff --name-only $TRAVIS_COMMIT_RANGE | grep -qE "^(demo/)?dist/"); then
	echo 'Build output ("dist" and "demo/dist") not permitted in develop' >&2
	exit 1
fi
