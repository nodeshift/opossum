# Contributing to Opossum

## Issue contributions

### Did you find a bug ?

Open a [new issue](https://github.com/nodeshift/opossum/issues/new).
Be sure to include a title and clear description, with as much relevant information
as possible. If you have a code sample that illustrates the problem that would be even better!

## Code contributions

### Fork

Fork the project [on GitHub](https://github.com/nodeshift/opossum)
and check out your copy locally.

```
git clone git@github.com:username/opossum.git
cd opossum
git remote add upstream https://github.com/nodeshift/opossum.git
```

### Branch

Create a feature branch and start hacking:

```
git checkout -b my-contrib-branch
```

### Commit messages

Writing good commit logs is important. A commit log should describe what
changed and why. Follow these guidelines when writing one:

  1. The first line should be 50 characters or less and contain a short
    description of the change.
  2. Keep the second line blank.
  3. Wrap all other lines at 72 columns.

Example of commit message:

```
bug: promise timeout flakeyness resolved

Occasionally, when a circuit times out, the promise remains in an
unresolved state. This fixes that issue by modifying the frobjam
function to return the first framble it can find.

The body of the commit message can be several paragraphs, and
please do proper word-wrap and keep columns shorter than about
72 characters or so. That way `git log` will show things
nicely even when it is indented.
```

### Rebase to keep updated

Use `git rebase` to sync your work from time to time.

```
git fetch upstream
git rebase upstream/master
```

### Development cycle

Bug fixes and features should come with tests.
The tests are on `test` directory. Before submitting a pull request,
ensure that your change will pass CI.

```sh
$ make clean && npm install && make ci
```

### Push

```
git push origin my-contrib-branch
```

Go to https://github.com/yourusername/opossum and select your feature branch.
Click the 'Pull Request' button and fill out the form.

## Releasing

These are mostly notes for myself.

  * Make sure everything works: `make clean && npm install && make ci`
  * Run standard-version: `npm run release`
  * Push to GitHub: `git push --follow-tags origin master`
  * Publish to npmjs.com: `npm publish`
  * Assuming all goes well, head over to https://github.com/nodeshift/opossum/releases
    and update the release with any relevant notes. The generated CHANGELOG.md file should
    be updated, so you can use it to document release changes.
  * Tweet, blog and otherwise promote your awesome success!
