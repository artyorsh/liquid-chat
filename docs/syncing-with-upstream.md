# Syncing with upstream

Use this when your app started from [expo-template](https://github.com/artyorsh/expo-template) and you want to rebase your product commits onto the latest template main branch (new Expo stack, fixes, and patterns).

## Remote

Add the template repository as a remote (the usual name is upstream):

```bash
git remote add upstream git@github.com:artyorsh/expo-template.git
```

Run git fetch upstream main before replaying commits.

## Full workflow

Step-by-step conflict handling, verification, and pitfalls are in the repo skill (readable in Cursor or on GitHub):

- [.cursor/skills/sync-template-upstream/SKILL.md](../.cursor/skills/sync-template-upstream/SKILL.md)

In Cursor, you can also invoke the sync-template-upstream skill.

## TL;DR

After you know your fork point (parent of the first commit that exists only in your app):

```bash
git fetch upstream main
git rebase --onto upstream/main <fork-point-sha> main
```

The first replayed commit usually needs the heaviest manual merge; use the skill for principles and checklists.
