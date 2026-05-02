---
name: sync-template-upstream
description: Syncs an app derived from artyorsh/expo-template to the latest upstream main via git rebase --onto, preserving product-specific commits. Use when catching up with the template upstream, resolving replay conflicts, or fixing post-merge prebuild or CocoaPods issues.
disable-model-invocation: true
---

# Sync template upstream

## Who this is for

- Apps derived from this template (renamed repos, products on an old template tip) that need to catch up to current artyorsh/expo-template.
- This template repo rarely needs the workflow; the skill ships here so every project that inherits .cursor/skills gets the same instructions.

Convention: add the template as a Git remote (examples use the name upstream):

```bash
git remote add upstream git@github.com:artyorsh/expo-template.git
# or: https://github.com/artyorsh/expo-template.git
```

Use another remote name if you prefer; substitute it in all git commands below.

## When this applies

- You have fetched the latest upstream/main (or your remote name and default branch).
- History is linear: an old template snapshot, then a few product-only commits (features, rename, slim-down, bumps).
- Goal: move the base to latest upstream main, resolve conflicts mostly in the first product commit, then replay the rest in order.

## 1. Preparation

```bash
git fetch upstream main
```

Identify:

- Fork point: parent of the first product-only commit (example: git rev-parse at the commit before your first product commit). When the app was last aligned with the template, this often equals git merge-base with upstream/main.
- Commits to replay: ordered SHAs above that fork point.

Safety branch:

```bash
git branch backup/pre-rebase-template-$(date +%Y%m%d) HEAD
```

## 2. Core rebase

```bash
git rebase --onto upstream/main <fork-point-sha> main
```

Replace branch names if your default branch is not main.

This reapplies every commit after the fork point onto current upstream/main. The first replayed commit usually conflicts most; later conflicts depend on how far upstream moved—there is no fixed file list.

Related: for Expo SDK–aligned versions, doctor, and native follow-up, see [.cursor/skills/upgrading-expo/SKILL.md](../upgrading-expo/SKILL.md) (npx expo install --fix, expo-doctor, and the rest). This skill does not duplicate that matrix.

## 3. First replayed commit (upstream baseline + product delta)

Intent: upstream wins for shared infrastructure in that revision (Expo/RN, lint/test, navigation style, i18n/splash, etc.). Re-apply only product-specific packages, modules, routes, and assets.

Principles:

- Dependencies / lockfile — Shared graph should match what upstream would use for overlapping packages; keep product-only deps on top. Regenerate the lockfile after package.json is stable; do not hand-merge lockfile conflicts. Use the upgrading-expo skill if pins look inconsistent.
- Composition root (index.js or equivalent) — Union of modules upstream expects and product modules; preserve order where modules depend on each other (e.g. logging before consumers). Keep product bootstrap only if still required (e.g. reflect metadata).
- Navigation — Route map and route types must cover every navigable screen: upstream plus product, using whatever API this template revision uses. Do not drop upstream-only behavior (e.g. dev tooling wrappers) when adding product routes.
- Router tests — Match upstream’s test construction pattern for that revision; register routes so later replayed commits still apply.

Then:

```bash
git add -A
git rebase --continue
```

## 4. Later replayed commits

Rename / branding — Apply product slug, EAS ids, readme, etc. on top of current upstream app.config and docs.

Slim-down (drop upstream features the product does not ship):

- For modify/delete conflicts, git rm only paths the incoming commit deletes. Never run a blind git rm over all unmerged paths—that can delete correctly resolved index.js, lockfiles, or routers.

Stay architecturally aligned with upstream

- Compare index.js, src/app.tsx, and other bootstrap to upstream after hard steps. They should match upstream except intentional product wiring (extra modules or providers justified by deps).
- If a replay removes DI that root components still resolve, fix registration—do not strip app.tsx to hide a broken container.
- If history says a commit never touched src/app.tsx, git diff for that file between parent and commit should stay empty after conflict resolution.

Dependency bumps — Merge both sides in package.json, then reinstall and re-lock.

## 5. Post-rebase hygiene

- Typecheck vs app.config — See upgrading-expo (defaults, typings, New Architecture).
- Prebuild and pods — Native-linked packages often break only at pod install or expo prebuild. Prefer npx expo install --fix and upgrading-expo over hand-pinned versions.

## 6. Verification

Use this repo’s scripts (see package.json), e.g.:

```bash
bun run build
bun run test
```

If iOS native trees matter:

```bash
npx expo prebuild --clean
```

Resolve pod and native issues with upgrading-expo before considering the sync complete.

When git rebase finishes, run build and lint using this repo's scripts — for example bun run build and bun run test, plus bun run lint when the upgraded template pulls in stricter ESLint or React Compiler rules than your old tip.

### Keep history linear — no orphaned “post-rebase fix” commits

Problems often surface only after the full replay: TypeScript path issues, ESLint/display-name rules, brittle deep imports blocked by npm package exports, app.config drift from what upstream typed or documents, and similar noise. Fixing that with one more commit at the tip is tempting but leaves a dangling fix unrelated to narrative history.

Prefer folding corrections into whichever replayed commit actually introduced the need — so main stays roughly one deliberate change per commit.

1. Prefer catching breakage while you are still on the first replayed commit (section 3). After resolving its conflicts you can optionally run build, lint, and tests before the next git rebase --continue. If the fix belongs in that replay alone, amend that commit instead of stacking a new one. Use HUSKY=0 git commit --amend when hooks would widen the diff (unexpected i18n extract, codegen churn, etc.).

2. If you only verified after rebase finished, avoid leaving a stray cosmetic-only commit unless you mean to merge it blindly. Replay again from the same fork onto upstream and fold the deltas: start an interactive rebase from upstream/main or the first parent chain you replayed onto, drop the orphan fix commit, mark edit on the commits that should absorb the work (often the first product commit), re-apply the patch by hand or from a saved git show, amend, then git rebase --continue. Use HUSKY=0 git commit --amend when hooks touch unrelated catalogs.

3. git commit --fixup and GIT_SEQUENCE_EDITOR with autosquash work when fixup targets sit next to each other in the todo; the fixup line folds into the pick directly above it, so reorder the todo lines if Git's default order is wrong.

4. Corrections sometimes split across commits. Example: a product-specific env block or plugin array entry belongs with branding or native wiring commits; map-import and map-only lint fixes belong with the map feature commit. Prefer matching expo-template app.config defaults (omit flags the template does not carry) rather than papering over typings with suppression comments unless product needs truly diverge. Edit several commits in one interactive pass and amend each where it belongs.

When you publish, coordinate with your team's workflow — history moved, so pushing an updated main often means git push --force-with-lease.

## Pitfalls (short)

| Issue | Prevention |
|--------|------------|
| Entry points drift from upstream | Fix DI and index.js; do not gut app.tsx to compensate |
| Opaque history | git rebase -i, edit, then commit --amend instead of burying mistakes in fixups |
| Native or type errors after merge | upgrading-expo and expo install --fix |
| Accidental deletion of resolved files | Never bulk git rm all unmerged paths |

## Checklist

- [ ] Upstream fetched; fork point and replay list noted  
- [ ] Backup branch created  
- [ ] First commit: upstream baseline + product delta; lockfile regenerated  
- [ ] Bootstrap matches upstream + intentional product extensions  
- [ ] Full route surface (upstream + product) for current template APIs  
- [ ] Build, lint, tests, and prebuild (if applicable) pass; fold fixups into the originating replayed commits when you can rather than leaving a stray “post-rebase only” commit unless you intend to
- [ ] App runs locally for a final smoke check  
