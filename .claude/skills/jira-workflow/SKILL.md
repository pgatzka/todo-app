---
name: jira-workflow
description: "Use this skill for ALL development work. Every task — features, bugs, refactors, dependency updates, docs — must be tracked by a Jira issue. Triggers: any coding or implementation request, any time the user says 'work on TA-X', any time new work is proposed. Activates immediately when coding work is requested, even if the user does not mention Jira. Enforces the strict rule that no code is written outside of a Jira-coordinated branch."
---

# Jira-coordinated development workflow

## Overview

All development work is coordinated through Jira. This skill encodes a strict workflow where every change is tied to an issue, every issue gets its own branch, every transition is commented, and every piece of work ends at a pull request — not at a merge, and not at the next issue.

**This skill's rules are non-negotiable.** If a situation seems to call for skipping a step, stop and ask the user instead of improvising.

## The unbreakable rules

1. **No issue, no work.** Every change requires a Jira Task. If no Task exists, stop and follow the planning protocol below.
2. **Never commit to main.** Main is off-limits for direct commits. All work happens on an issue branch.
3. **The issue key is the identifier everywhere.** Branch name, commit messages, and PR title all lead with the issue key. Exact rules below.
4. **Every status transition requires a comment.** No exceptions. The comment explains what happened and why the transition is appropriate.
5. **Acceptance criteria must exist before work starts.** A Task with no acceptance criteria, or with vague/unverifiable criteria, is not workable. If you are asked to start work on such a Task, stop and fix the Task first (with user approval).
6. **One issue at a time. Never more.** Only one Task may be In Progress at any moment. Do not start a second Task while another is In Progress or In Review. No exceptions — not "just a quick fix on another Task," not "while I'm waiting for review on TA-2, let me start TA-3." Never.
7. **Stop at the PR.** When an issue moves to In Review and the PR is open, the work is done. Do not start the next issue. Wait for the user.

## Issue key naming rules (strict)

When working on issue `TA-2`:

- **Branch name:** exactly `TA-2`. Nothing else.
  - Not `feature/TA-2`, not `TA-2-add-login`, not `ta-2`, not `TA2`. Exactly `TA-2`.
- **Every commit message:** starts with `TA-2: `.
  - Example: `TA-2: add todo persistence via localStorage`
  - Not `Added persistence (TA-2)`, not `TA-2 add persistence`, not `[TA-2] add persistence`. Format is `TA-2: <description>`.
- **Pull request title:** starts with `TA-2: `, followed by the issue summary.
  - Example: `TA-2: User can mark a todo as complete`
  - Match the issue's summary as closely as possible; do not invent a new title.

These rules exist so the Jira ↔ Bitbucket integration can automatically link the branch, commits, and PR to the issue, and so the Development panel on the Jira issue shows everything connected to it. Deviating from the format breaks the integration silently — there is no error, just missing links.

If you catch yourself about to write a branch name, commit message, or PR title that does not follow this format, stop and correct it before proceeding.

## The Task description template is mandatory

Every Task has a description template with sections for context, acceptance criteria, and notes. When creating a Task:

- **Use the template as-is.** Do not delete sections. Do not leave placeholder text in place. Fill every section with real content.
- If a section genuinely does not apply to this Task, write why it does not apply. Do not leave it blank and do not remove the heading.
- **Acceptance criteria are the heart of the Task.** They must be real, specific, and verifiable. "Works correctly" is not an acceptance criterion. "User can add a todo and see it persist after a page refresh" is. Every criterion should be something you can demonstrate or point to in the code after the fact.
- A Task without acceptance criteria cannot be started. See rule #5.

If you find yourself wanting to skip or shorten the template, that is a signal the Task is not well-scoped. Go back and clarify the scope with the user before creating it.

## Planning protocol (when new work is proposed)

When the user proposes a new feature, change, or initiative and no Task exists yet:

1. **Discuss first.** Do not create Tasks immediately. Talk through the work with the user:
   - What is the goal?
   - What are the parts / phases / components?
   - What are the dependencies between them?
   - What is out of scope?
2. **Propose a breakdown.** Once the shape is clear, propose a set of Tasks. For each proposed Task, show the user:
   - The summary (one line, action-oriented)
   - A brief description of intent
   - The acceptance criteria you would put on it
   - Any dependencies on other proposed Tasks
3. **Wait for explicit approval** before creating anything in Jira. "Looks good," "do it," "yes create them" — clear signals. Ambiguity means ask again.
4. **Create the Tasks only after approval.** Use the Task template, filled in completely. Every Task created this way must already have its acceptance criteria populated — not as a TODO, as real criteria.

## Working on an issue (the full loop)

When the user says "work on TA-X" (or equivalent):

### Step 1: Read the Task and verify it is workable

Before any code is touched:

- **Check that no other Task is already In Progress or In Review.** Use `searchJiraIssuesUsingJql` with a query like `status in ("In Progress", "In Review") AND assignee = currentUser()`. If any Task is returned, stop. Tell the user which Task is active and ask them to finish or explicitly park it before starting new work. Never run two Tasks at once.
- Call `getJiraIssue` for `TA-X`. Read the full description, acceptance criteria, and any comments.
- **Verify acceptance criteria exist and are workable.** The Task description must contain concrete, verifiable acceptance criteria. If they are missing, vague ("works correctly," "looks good"), or unverifiable, stop. Tell the user the Task is not workable and propose specific criteria for their approval. Do not invent criteria silently, and do not start work on a Task with inadequate criteria.
- If anything else is unclear, ask the user before proceeding. Do not guess.
- Verify the Task is in status **To Do**. If it is in Backlog, ask the user whether to promote it first. If it is already In Progress or further, stop and ask the user what happened — this usually means the one-at-a-time rule was violated somewhere.

### Step 2: Prepare the branch

- Ensure the local repo is on `main` and up to date (`git fetch`, `git pull`).
- Create a new branch named exactly `TA-X` (the issue key, nothing else).
- Verify the branch was created from main, not from another feature branch.

### Step 3: Transition to In Progress

- Add a comment to the issue using `addCommentToJiraIssue` before transitioning. The comment should state:
  - That work is starting
  - The branch name
  - A brief restatement of the acceptance criteria you are working toward
- Then call `transitionJiraIssue` to move the issue from **To Do** to **In Progress**.

### Step 4: Do the work

- Implement the change on the `TA-X` branch.
- Commit in logical chunks. Every commit message must start with the issue key: `TA-X: short description`.
- Run tests and linters before committing. If they fail, fix them before proceeding.
- Never switch to main. Never commit to main.
- If the work reveals that the issue scope is wrong or incomplete, stop and discuss with the user. Do not silently expand scope.

### Step 5: Verify acceptance criteria

Before submitting for review, go through the acceptance criteria in the issue description one by one. For each:
- Confirm it is met by the changes on the branch.
- If any criterion is not met, either implement it or stop and discuss with the user.

Do not move to review with unmet criteria.

### Step 6: Push, comment, transition, and open the PR

In this order:
1. Push the `TA-X` branch to the remote.
2. Add a comment to the Jira issue summarizing:
   - What was implemented
   - Which files changed (high level, not every file)
   - Which acceptance criteria are now met
   - Any deviations from the original plan and why
   - Any follow-ups that should be separate issues
3. Transition the issue from **In Progress** to **In Review**.
4. Open a pull request from `TA-X` to `main` with:
   - Title: `TA-X: <issue summary>`
   - Body: include a link to the Jira issue, a summary of changes, and a checklist mirroring the acceptance criteria

### Step 7: Stop

After the PR is open and the issue is In Review, **stop**. Do not:
- Start the next issue
- Offer to start the next issue
- Pick up related work "while you're at it"
- Merge the PR yourself

Report to the user: "TA-X is in review. PR: <link>. Waiting for your approval before picking up the next work."

Wait for the user to either approve, request changes, or tell you what to do next.

## Handling review feedback

If the user requests changes:

1. Add a comment to the issue noting that changes were requested and summarizing what.
2. Transition the issue from **In Review** back to **In Progress**.
3. Make the changes on the same `TA-X` branch.
4. Push new commits (do not force-push unless explicitly requested).
5. Add a comment summarizing what changed in response to the feedback.
6. Transition back to **In Review**.
7. Stop again.

## Handling blockers, scope changes, and mistakes

- **Blocker discovered mid-work:** add a comment explaining the blocker, and ask the user how to proceed. Options include keeping In Progress with a note, transitioning back to To Do, or creating a new Task for the blocker (which would then become the next active Task after the current one is parked).
- **Scope turns out to be wrong:** stop immediately. Do not silently extend or shrink the work. Comment on the Task, explain what changed, and ask the user whether to amend the current Task, split off a new Task, or abandon.
- **Missing acceptance criteria discovered mid-work:** if you realize a criterion is missing that you should have caught at Step 1, stop. Add a comment stating what was missed, propose the criterion to the user, and wait for approval before continuing.
- **You made a mistake in Jira (wrong transition, wrong comment):** do not try to hide it. Add a follow-up comment explaining the mistake and the correction. Leave the audit trail intact.

## What never happens under this skill

- Committing directly to main
- Creating a branch whose name is not exactly the Task key
- Transitioning a Task without a comment
- Closing a Task without a PR merged (the user merges, not Claude)
- **Starting work on a Task that lacks acceptance criteria**
- **Starting a second Task while another is In Progress or In Review**
- Creating Jira Tasks without user approval for the breakdown
- Removing or shortening the description template to save time
- Inventing acceptance criteria after the fact to match what was built

## Quick reference: the happy path

```
User: "work on TA-2"
  → searchJiraIssuesUsingJql: confirm nothing else is In Progress or In Review
  → getJiraIssue TA-2, verify status = To Do AND acceptance criteria are present and workable
  → git checkout main && git pull
  → git checkout -b TA-2
  → addCommentToJiraIssue TA-2 "Starting work on branch TA-2. Target AC: ..."
  → transitionJiraIssue TA-2 To Do → In Progress
  → implement, commit (commits prefixed with "TA-2:")
  → verify every acceptance criterion
  → git push -u origin TA-2
  → addCommentToJiraIssue TA-2 "Implemented X, Y, Z. AC met: ..."
  → transitionJiraIssue TA-2 In Progress → In Review
  → open PR from TA-2 to main
  → STOP. Report to user. Wait.
```
