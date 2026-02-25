---
theme: default
title: Stop Vibe Coding — A Guide to Agentic Centered Development
info: |
  ## Stop Vibe Coding
  A Guide to Agentic Centered Development
drawings:
  persist: false
transition: slide-left
mdc: true
colorSchema: dark
highlighter: shiki
---

# Stop Vibe Coding

A Guide to Agentic Centered Development

<div class="abs-br m-6 flex items-center gap-3">
  <span class="text-sm opacity-50">J. Pedro Oliveira</span>
  <span class="opacity-30">|</span>
  <img src="/assets/subvisual-white.svg" class="h-5 opacity-50" alt="Subvisual" />
</div>

<div class="abs-bl m-6">
  <span class="inline-block px-3 py-1 text-xs font-mono rounded-full border border-[#F9FF47]/25 text-[#F9FF47]/70 bg-[#F9FF47]/5">
    Coimbra.js 2026
  </span>
</div>

<!--
Let's talk about how to stop treating AI agents as glorified autocomplete and start treating them as team members.
-->

---
transition: fade-out
---

# About me

**J. Pedro Oliveira**

<div class="flex gap-3 mt-2 mb-4">
  <a href="https://github.com/jopedroliveira" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border border-[#A3A9FF]/20 text-[#A3A9FF]/70 bg-[#A3A9FF]/5 !no-underline !border-b-[border-[#A3A9FF]/20]"><carbon-logo-github class="text-sm" /> jopedroliveira</a>
  <a href="https://jpoliveira.pt" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border border-[#A3A9FF]/20 text-[#A3A9FF]/70 bg-[#A3A9FF]/5 !no-underline !border-b-[border-[#A3A9FF]/20]"><carbon-globe class="text-sm" /> jpoliveira.pt</a>
</div>

Fullstack Web Developer @ **Subvisual**

Co-organizer of **Coimbra.js**

<br>

- Currently gravitating between **Elixir** and **JavaScript** (more Elixir than JS, honestly)
- Father of twins
- Biomedical Engineering background — yes, not everyone studied CS

<!--
Quick intro. Fullstack web developer at Subvisual, and one of the people who organizes the meetup.
-->

---

# The Problem

<v-clicks>

- "I generated code with AI and it came out **inconsistent**"
- The agent **doesn't know** your conventions
- **Repeating context** every session
- Without structure, the agent is a junior with no onboarding

</v-clicks>

<!--
Who here has had AI-generated code that didn't follow the project's conventions? The problem isn't the model — it's the lack of context.
-->

---

# The Core Idea

> Instead of just asking AI to generate code, you **structure your project so the agent is productive from the very first moment** — just like you'd onboard a new developer.

<br>

<div class="text-sm opacity-60">
  Examples use <strong class="text-[#F29EFE]">Claude Code</strong> — but the principles apply to <strong>Cursor</strong>, <strong>Windsurf</strong>, <strong>GitHub Copilot</strong>, and others.
</div>

<!--
Just like you prepare documentation and processes for a new developer, you do the same for the agent.

In this talk I'll use Claude Code as an example, but the principles are transferable. Cursor has .cursorrules and slash commands, Windsurf has .windsurfrules and workflows, GitHub Copilot has copilot-instructions.md and AGENTS.md, Cline has .clinerules. MCP is supported by almost all of them. The difference is that Claude Code formalizes all these concepts — context files, skills, commands, subagents, hooks, plugins — as first-class features.

From here on I'll use a real project as an example: my Home Assistant app. It's a React/Next.js app that controls home devices — lights, sensors, climate. The goal was to give a simple interface to the family, without needing to know what Home Assistant is. Let's see how I structured the project so that Claude was productive from the very first moment.
-->

---
layout: two-cols-header
---

# The Building Blocks

::left::

| Building Block | Analogy |
|---|---|
| **CLAUDE.md** | Onboarding doc |
| **Skills** | Specialized documentation |
| **Commands** | npm scripts |
| **Subagents** | Specialist colleagues |
| **Hooks** | CI/CD |
| **Plugins** | npm packages |
| **MCP** | DevTools extensions |

::right::

```
Who invokes it?
─────────────────────────
CLAUDE.md   → Automatic (always)
Skills      → The model decides
Commands    → You (/command)
Subagents   → The model delegates
Hooks       → Automatic (events)
Plugins     → Manual installation
MCP         → Configured (settings)
```

<!--
Each building block has a different role. Let's look at each one in detail.
-->

---
layout: section
---

# CLAUDE.md

The Onboarding Doc

<!--
Let's start with the most important one: CLAUDE.md. It's the agent's onboarding document.
-->

---

# CLAUDE.md — What is it

A markdown file that Claude reads **automatically** at the start of every conversation.

It's the **"README for agents"** — it provides context that the agent can't infer from code alone.

<br>

### CLAUDE.md vs AGENTS.md

- **CLAUDE.md** — native format for Claude Code (Anthropic)
- **AGENTS.md** — open format, cross-tool (Codex, Cursor, Gemini CLI, Jules...)
- In practice, the content is the same

<!--
AGENTS.md is maintained by the Agentic AI Foundation under the Linux Foundation. You can have both in the project.
-->

---

# Hierarchy (Cascade)

Claude loads **all** of them found in the hierarchy. The closest one to the working directory takes precedence.

```
~/.claude/CLAUDE.md              ← Global (personal preferences)
  └── /project/CLAUDE.md         ← Project (repo root)
      └── /project/src/CLAUDE.md      ← Subdirectory
          └── /project/tests/CLAUDE.md    ← Another subdir
```

<!--
Claude loads all of them found in the hierarchy. It works as a cascade — the closest one to the working directory takes precedence.
-->

---

# What to Include — WHY → WHAT → HOW

```markdown
# Home Control App

## Project
React/Next.js app for Home Assistant devices.
Uses TypeScript strict, Tailwind CSS, shadcn/ui.

## Commands
- `npm run dev` — Dev server (port 3000)
- `npm run test` — Vitest

## Architecture
- `/app` — App Router · `/components/ui` — shadcn
- `/lib/ha` — HA WebSocket API client

## Conventions
- Named exports, never default exports
```

<!--
This is a real example. Notice the structure: WHY (what the project is), WHAT (architecture), HOW (commands and conventions). Continues on the next slide.
-->

---

# What to Include (cont.)

The remaining sections of a good CLAUDE.md:

```markdown
## Conventions
- One component per file
- Device types in `/types/devices.ts`

## Watch out
- HA WebSocket can disconnect — always handle reconnection
- Never store tokens in client-side localStorage
```

<div class="mt-2 p-3 bg-yellow-500/10 rounded text-sm">

**Key insight**: The "Watch out" section is often the most valuable — it captures **tribal knowledge** that the agent can't infer from code alone.

</div>

<!--
The "Watch out" section is often the most valuable. It's tribal knowledge — things the agent can't infer just by looking at the code.
-->

---

# CLAUDE.md — Best Practices

<v-clicks>

1. **Less is more** — Models follow ~150-200 instructions. If everything is IMPORTANT, nothing is.

2. **Don't repeat what Claude already knows** — You don't need to explain how React works.

3. **Progressive disclosure** — Instead of putting everything in CLAUDE.md, say where to find info:
   *"For API conventions, see `/docs/api-conventions.md`"*

4. **Refactor regularly** — Remove instructions that Claude already follows naturally.

5. **It's not a linter** — For strict rules, use hooks or real linters.

</v-clicks>

<!--
Point 1 is crucial. A 500-line CLAUDE.md will be partially ignored. Less is more.
-->

---
layout: section
---

# Skills

On-Demand Expertise

<!--
Now let's talk about Skills — modular on-demand expertise.
-->

---

# Skills — What are they

Skills are **modular on-demand expertise**. Unlike CLAUDE.md (which is always loaded), a Skill is only read when Claude decides it's relevant.

<br>

### How it works (Progressive Disclosure)

<v-clicks>

1. **Startup** — Claude reads only the `name` and `description` of all skills (metadata)
2. **Match** — When you make a request, it evaluates if any skill is relevant
3. **Load** — If yes, reads the full `SKILL.md` into context
4. **Execute** — Uses the instructions to complete the task

</v-clicks>

<div v-click class="mt-4 p-3 bg-blue-500/10 rounded">
Only what's needed enters the context window.
</div>

<!--
It's like Neo's "I know Kung Fu" in The Matrix — it loads knowledge just-in-time. Only what's needed enters the context window.
-->

---

# Structure of a Skill

```
.claude/skills/
  └── add-device/
      ├── SKILL.md           ← Required (instructions + metadata)
      ├── templates/
      │   ├── DeviceComponent.tsx.template
      │   └── useDevice.ts.template
      └── scripts/
          └── scaffold.sh
```

### SKILL.md — Frontmatter

```yaml
---
name: add-device
description: >
  Scaffold a new Home Assistant device component with its hook,
  type definition, and tests. Use when adding support for a new
  device type like lights, switches, sensors, or climate controls.
---
```

<!--
A skill lives in a folder with the required SKILL.md. It can have supporting templates and scripts. The frontmatter defines the name and description that the model sees at startup.
-->

---

# SKILL.md — Content

```
# Add New Device Support

## Steps
1. Create the type in /types/devices.ts
   - Extend the BaseDevice interface
2. Create the hook in /hooks/use{DeviceType}.ts
   - Must use the base useHAWebSocket
3. Create the component in /components/devices/{DeviceType}Card.tsx
   - Use shadcn/ui components
4. Register in the device registry
5. Add tests in /tests/devices/

## Example: Light Device

  export interface LightDevice extends BaseDevice {
    domain: 'light';
    brightness: number; is_on: boolean;
  }
```

<!--
This is the full content of a SKILL.md — clear steps and a concrete example. Claude follows this when it loads the skill.
-->

---

# Advanced Frontmatter

### Restrict tools

```yaml
---
name: safe-analyzer
description: Analyze code without making changes
allowed-tools: Read, Grep, Glob
---
```

### Disable automatic invocation

```yaml
---
name: deploy-check
description: Pre-deployment validation
disable-model-invocation: true   # Only invocable via /deploy-check
---
```

<!--
You can restrict tools for read-only skills, or disable automatic invocation so it only works as an explicit slash command.
-->

---

# Skill vs CLAUDE.md

| Situation | Use |
|---|---|
| Context that is **ALWAYS** relevant | CLAUDE.md |
| Expertise for **specific tasks** | Skill |
| Info that takes up too much context space | Skill |
| Reusable workflows with templates | Skill |
| Build/test/lint commands | CLAUDE.md |

<!--
Simple rule: if it's always relevant, CLAUDE.md. If it's expertise for specific tasks, Skill.
-->

---
layout: section
---

# Slash Commands

The Shortcuts

<!--
Now Slash Commands — the shortcuts you invoke explicitly.
-->

---

# Slash Commands — What are they

Reusable prompts that you invoke with **`/name`**. They're shortcuts for frequent workflows.

```
.claude/commands/
  ├── add-device.md
  ├── review.md
  └── deploy-check.md
```

<br>

> Since Claude Code 1.0, commands and skills have been "merged". A file at `.claude/commands/review.md` and one at `.claude/skills/review/SKILL.md` both create `/review`.

<!--
Since Claude Code version 1.0, commands and skills have been merged. Both create the same slash command.
-->

---

# Example: `/add-device`

```markdown
Scaffold a new Home Assistant device component.

Device type: $ARGUMENTS

Follow these steps:
1. Create the TypeScript type extending BaseDevice in /types/devices.ts
2. Create a custom hook in /hooks/use{DeviceType}.ts
3. Create the card component in /components/devices/{DeviceType}Card.tsx
4. Register in /lib/ha/deviceRegistry.ts
5. Add basic tests in /tests/devices/
6. Run `npm run lint` and `npm run test` to verify

Use the existing LightCard.tsx and useLight.ts as reference implementations.
```

**Usage**: `/add-device thermostat`

`$ARGUMENTS` is replaced by everything you type after the command.

<!--
$ARGUMENTS is replaced by everything you type after the command. In this case, "thermostat" would be the device type.
-->

---

# Dynamic Context with `!command`

Commands can execute shell commands and inject the output:

```markdown
---
name: pr-summary
description: Summarize the current PR
allowed-tools: Bash(gh *)
---

## Context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Task
Summarize this PR focusing on:
1. What changed and why
2. Risk areas
3. Testing recommendations
```

The `!` commands execute **BEFORE** sending to Claude. Claude only sees the result.

<!--
The ! commands execute before sending to Claude. He only sees the output. This is fundamental because it means the context is always fresh — it's not a static copy that can become outdated. Every time you invoke /pr-summary, it fetches the diff and comments at that moment.

Another important detail: the ! runs in the user's shell, with the user's permissions and environment variables. This means you can use any CLI you have installed — gh, jq, curl, docker, kubectl — to inject context from any source. You're not limited to what Claude can access directly.
-->

---

# Commands vs Skills

| | Commands (Slash) | Skills |
|---|---|---|
| **Who invokes** | You (`/command`) | The model (automatic) |
| **When** | Explicitly | When the model deems it relevant |
| **Purpose** | Repetitive workflows | Specialized expertise |
| **Arguments** | Yes (`$ARGUMENTS`) | No |

<!--
Summary: commands are for you to invoke, skills are for the model to decide. Commands accept arguments, skills don't.
-->

---
layout: section
---

# Subagents

The Team

<!--
Subagents — the team of specialists that the main agent can delegate work to.
-->

---

# Subagents — What are they

Specialized agents with their **own context window**, system prompt, and tools.

<br>

### Why use them

<v-clicks>

1. **Preserve context** — The subagent's exploration doesn't pollute your main conversation
2. **Specialization** — Focused system prompts yield better results
3. **Control** — Limit the tools each agent has access to
4. **Cost** — Route to cheaper models (Haiku) for simple tasks

</v-clicks>

<!--
Four main reasons: preserve context, specialization, tool control, and cost optimization. You can use Haiku for simple tasks and save tokens.
-->

---

# Built-in Subagents

| Agent | What it does | Tools |
|---|---|---|
| **Explore** | Read-only codebase research and analysis | Read, Grep, Glob |
| **Plan** | Planning without modifying files | Read, Grep, Glob |
| **general-purpose** | Generic tasks | All |

<!--
Claude Code already comes with these built-in subagents. Explore is read-only, Plan only plans, and general-purpose has access to everything.
-->

---

# Custom Subagent

File: `.claude/agents/ha-expert.md`

```markdown
---
name: ha-expert
description: >
  Home Assistant integration expert. Use when working
  with HA WebSocket API, entity management, or device state.
model: sonnet
tools: Read, Grep, Glob, Bash(npm *)
---

You are a Home Assistant integration specialist
working within a React/Next.js application.

## Your expertise
- Home Assistant WebSocket API
- Entity state management and subscriptions
```

<!--
Here we have the subagent frontmatter: name, description, model (sonnet to save costs), allowed tools. Then the system prompt with the expertise.
-->

---

# Custom Subagent (cont.)

The rest of the agent definition — the most valuable part:

```markdown
## Your expertise (continued)
- Service calls and their parameters
- Device domains (light, switch, sensor, climate, etc.)

## Common pitfalls to watch for
- Not handling HA unavailability gracefully
- Missing unsubscribe on component unmount
- Assuming entity attributes exist (they vary by integration)
```

<div class="mt-2 p-3 bg-blue-500/10 rounded text-sm">

Subagent system prompts shine when they encode **domain-specific pitfalls** — things a generic model wouldn't know to check.

</div>

<!--
The "Common pitfalls" section is what makes a subagent truly useful vs. a generic model.

In this Home Assistant example:
- "Not handling HA unavailability" — the HA server can go down or restart. If the agent generates code that assumes the WebSocket is always connected, you'll get silent crashes in production. The subagent knows it should always generate reconnection logic with backoff.
- "Missing unsubscribe on component unmount" — in React, if you subscribe to HA state updates via WebSocket and don't clean up in the useEffect return, you get memory leaks and state updates on unmounted components. The subagent knows to check this automatically.
- "Assuming entity attributes exist" — each HA integration can have different attributes. A Hue bulb has color_temp, but a generic bulb might not. The subagent knows it should always use optional chaining and check for attribute existence.

The key point: these pitfalls are tribal knowledge that comes from experience with the technology. A generic model wouldn't know this. By encoding them in the subagent, you're giving it years of experience in seconds.

This applies to any domain: Stripe (idempotency keys, webhook retries), AWS (IAM least privilege, eventual consistency), databases (N+1 queries, missing indexes), etc.
-->

---

# Subagent vs Skill

| | Subagent | Skill |
|---|---|---|
| **Context** | Isolated (own context window) | Shared (same context) |
| **Execution** | Works independently | Instructions injected into conversation |
| **Model** | Can use a different model | Uses the conversation's model |
| **Ideal for** | Long, exploratory tasks | Punctual expertise, templates |

<!--
Subagent: isolated context, works independently, can use a different model. Skill: shares context, instructions injected into conversation. Use subagent for long tasks, skill for punctual expertise.
-->

---
layout: section
---

# Hooks

The CI/CD

<!--
Hooks — the agent's CI/CD. Everything we've seen so far (CLAUDE.md, skills, commands) is "soft" — the model can decide not to follow. Hooks are "hard" — they're shell scripts that run automatically and can block actions. It's the difference between saying "please run the tests" and having a CI that fails the build if tests don't pass.
-->

---

# Hooks — What are they

Shell scripts that run automatically on **lifecycle events**. They are **deterministic** — unlike CLAUDE.md which are suggestions, hooks are rules that are always enforced.

<br>

### Available events

| Event | When |
|---|---|
| `PreToolUse` | Before any tool runs |
| `PostToolUse` | After a tool executes |
| `Stop` | When the main agent finishes |
| `SubagentStop` | When a subagent finishes |
| `Notification` | When a notification is sent |

<!--
Five lifecycle events available.

Where do hooks live? In settings.json — which can be global (~/.claude/settings.json, your personal preferences) or local to the project (.claude/settings.json, shared with the team via git). The distinction matters: global hooks apply to all your projects (e.g., never force push), local hooks are project-specific (e.g., run this repo's linter). Unlike CLAUDE.md which also has this hierarchy, here we're talking about hard-coded rules, not suggestions.

- PreToolUse is the most powerful: runs BEFORE any tool. If the script prints something with "BLOCK:", the action is cancelled. You can use it to prevent commits without tests, block writes to protected files, or validate that the linter passed.
- PostToolUse runs after — useful for logging, notifications (e.g., Slack when the agent deploys), or running auto-formatting after the agent writes code.
- Stop and SubagentStop run at the end — good for cleanup, session reports, or ensuring no temporary files were left behind.
- Notification — when the agent sends a notification to the user (e.g., task finished), you can trigger external actions.

The matcher accepts glob patterns: "Bash(git commit*)" catches any git commit, "Write(*.env)" catches writes to .env files. You can have multiple hooks per event.

Important: hooks are deterministic — no AI involved. They're pure shell scripts. This gives you guarantees that CLAUDE.md cannot provide.
-->

---

# Example: Block commits without tests

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit*)",
        "command": "test -f /tmp/tests-passed || echo 'BLOCK: Run tests first'"
      }
    ]
  }
}
```

### Hooks vs CLAUDE.md

| | CLAUDE.md | Hook |
|---|---|---|
| **Nature** | Suggestion (can be ignored) | Deterministic (blocks) |
| **Example** | "Run tests before committing" | Blocks the commit if tests failed |

<!--
In this example: the matcher "Bash(git commit*)" intercepts any commit attempt. The command checks if the file /tmp/tests-passed exists — if not, it prints "BLOCK:" and the commit is cancelled.

In practice, you'd have another PostToolUse hook that creates that file when tests pass. This ensures the flow: tests first, commit after.

Other useful hook examples:
- Block writes to .env or credential files: matcher "Write(*.env)", command that prints BLOCK
- Auto-format code after writing: PostToolUse with matcher "Write(*.ts)", command "npx prettier --write $FILE"
- Notify Slack when a task finishes: Stop hook that curls a webhook
- Prevent force push: PreToolUse with matcher "Bash(git push --force*)"

The table summarizes the fundamental difference: CLAUDE.md is a suggestion ("please run the tests"), the hook is a rule that's always enforced. Use CLAUDE.md for guidelines, hooks for invariants that should never be violated.
-->

---

# More Hook Examples

```json
// Block writing to sensitive files
{ "matcher": "Write(*.env)", "command": "echo 'BLOCK: Cannot modify .env'" }

// Auto-format after writing TypeScript
{ "matcher": "Write(*.ts)", "command": "npx prettier --write $FILE" }

// Prevent force push
{ "matcher": "Bash(git push --force*)",
  "command": "echo 'BLOCK: No force push allowed'" }
```

<br>

```json
// Notify Slack when agent finishes (Stop event)
{ "command": "curl -X POST $SLACK_WEBHOOK -d '{\"text\": \"Agent done\"}'" }
```

<!--
Four practical examples beyond commit blocking:
- Protect sensitive files like .env from being modified by the agent.
- Auto-format code with Prettier whenever the agent writes a TypeScript file — so you don't need to ask the agent to format.
- Prevent force push — a security rule you always want to enforce.
- The last one is a Stop hook (no matcher) — runs whenever the agent finishes. In this case it notifies Slack. Useful when you've launched a long task and want to be notified.
-->

---
layout: section
---

# Plugins

Sharing

<!--
Plugins — the way to share everything we've seen so far in a reusable package.
-->

---

# Plugins — What are they

Bundles of skills + commands + agents + hooks in a shareable git repository.

```
my-plugin/
├── plugin.json          # Metadata
├── skills/
│   └── add-device/
│       └── SKILL.md
├── commands/
│   └── review.md
├── agents/
│   └── ha-expert.md
└── hooks/
    └── pre-commit.sh
```

```bash
/plugins install <url>    # Install a plugin
/plugins                  # Manage installed plugins
```

<!--
A plugin is a bundle of skills, commands, agents and hooks in a git repo. Install with a command and it's ready to use. Anthropic has an official marketplace.
-->

---

# MCP — External Superpowers

MCP (Model Context Protocol) servers extend the agent with **external tools and data sources**.

<br>

<v-clicks>

| Server | What it does |
|---|---|
| **Playwright** | Browse, test & screenshot web pages |
| **Figma** | Read designs, tokens & components |
| **GitHub** | Manage repos, PRs, issues |
| **Postgres / Supabase** | Query & design database schemas |

</v-clicks>

<br>

> Think of MCP as **DevTools extensions for your agent** — install once, always available.

<!--
MCP is the protocol that lets the agent connect to external tools.
Playwright lets you browse and test web pages — we used this to build this presentation.
The Figma MCP is official and gives the agent design context directly from Figma files.
The GitHub MCP lets you manage repos, PRs and issues. And there are servers for databases like Postgres and Supabase.

Think of MCP as DevTools extensions for the agent — just like you install React DevTools or Redux DevTools in the browser for debugging superpowers, you install MCP servers to give the agent superpowers. There's an official registry at modelcontextprotocol.io with hundreds of servers.
-->

---
layout: section
---

# Putting It All Together

<!--
Now let's put it all together and see what a complete project would look like.
-->

---

# Complete Project

```
home-control-app/
├── CLAUDE.md                        ← Global context
├── .claude/
│   ├── skills/
│   │   ├── add-device/SKILL.md      ← How to add a new device
│   │   ├── ha-websocket/SKILL.md    ← HA WebSocket expertise
│   │   └── component-patterns/SKILL.md
│   ├── commands/
│   │   ├── add-device.md            ← /add-device <type>
│   │   ├── review.md               ← /review
│   │   └── deploy-check.md         ← /deploy-check
│   └── agents/
│       ├── ha-expert.md             ← HA specialist
│       └── accessibility-reviewer.md
├── app/ · components/ · hooks/ · lib/ · types/ · tests/
```

<!--
Here's the complete structure. CLAUDE.md at the root, skills with templates, commands for shortcuts, and specialized agents. Everything versioned in git with the team.
-->

---

# Real Workflow

```
You: /add-device climate
```

<v-clicks>

1. Claude reads the **command** `add-device.md`
2. Detects that the **skill** "add-device" is relevant → loads `SKILL.md`
3. Follows the steps, uses **templates**
4. Delegates HA validation to the **subagent** `ha-expert`
5. Creates files, runs lint and tests
6. **Hook** blocks commit if tests fail

</v-clicks>

<div v-click class="mt-4 p-3 bg-green-500/10 rounded">
<strong>Result:</strong> ClimateCard.tsx, useClimate.ts, types, tests — all consistent.
</div>

<!--
This is the real flow. A single command triggers the command, which activates the skill, which uses templates, delegates to the subagent, and the hook ensures quality. All automatic and consistent.
-->

---

# Mental Map

```
Agentic Centered Development
│
├── CLAUDE.md — The Onboarding
│   └── WHY → WHAT → HOW · Less is more
├── Skills — On-Demand Expertise
│   └── Model-invoked · Progressive disclosure
├── Commands — The Shortcuts
│   └── User-invoked (/command) · $ARGUMENTS
├── Subagents — The Team
│   └── Isolated context · Different model per cost
├── Hooks — The CI/CD
│   └── Deterministic (not a suggestion)
├── Plugins — Sharing
│   └── Bundle everything in a git repo
└── MCP — External Superpowers
    └── DevTools extensions for the agent
```

<!--
Summary mental map. Each building block has its role. The core idea: structure your project so that the agent is productive from the very first moment.
-->

---
layout: center
class: text-center
---

# Thank You!

<div class="mt-4 mb-6 text-lg opacity-50 font-light tracking-wide">
Questions?
</div>

<div class="flex gap-4 justify-center flex-wrap">
  <a href="https://agents.md/" target="_blank" class="inline-block px-4 py-2 text-sm font-mono rounded-lg border border-[#045CFC]/25 text-[#A3A9FF]/90 bg-[#045CFC]/5 hover:bg-[#045CFC]/10 transition-colors !no-underline !border-b-0">AGENTS.md</a>
  <a href="https://code.claude.com/docs/en/best-practices" target="_blank" class="inline-block px-4 py-2 text-sm font-mono rounded-lg border border-[#F29EFE]/20 text-[#F29EFE]/80 bg-[#F29EFE]/5 hover:bg-[#F29EFE]/10 transition-colors !no-underline !border-b-0">Best Practices</a>
  <a href="https://github.com/VoltAgent/awesome-agent-skills" target="_blank" class="inline-block px-4 py-2 text-sm font-mono rounded-lg border border-[#F9FF47]/15 text-[#F9FF47]/70 bg-[#F9FF47]/5 hover:bg-[#F9FF47]/10 transition-colors !no-underline !border-b-0">Awesome Skills</a>
</div>

<div class="mt-6 flex items-center justify-center gap-4 text-sm opacity-60">
  <span>J. Pedro Oliveira</span>
  <a href="https://github.com/jopedroliveira" target="_blank" class="inline-flex items-center gap-1.5 !no-underline !border-b-0 opacity-80 hover:opacity-100"><carbon-logo-github class="text-base" /> jopedroliveira</a>
  <a href="https://jpoliveira.pt" target="_blank" class="inline-flex items-center gap-1.5 !no-underline !border-b-0 opacity-80 hover:opacity-100"><carbon-globe class="text-base" /> jpoliveira.pt</a>
</div>

<div class="mt-4 flex items-center justify-center gap-10">
  <img src="/assets/subvisual-white.svg" class="h-5 opacity-40" alt="Subvisual" />
  <img src="/assets/coimbrajs.svg" class="h-7 opacity-40" alt="Coimbra.js" />
</div>

<!--
Thank you! Questions?
-->