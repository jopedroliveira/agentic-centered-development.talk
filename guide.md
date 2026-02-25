# Agentic Centered Development — Complete Guide

> Reference guide for the talk and personal learning.
> Covers CLAUDE.md / AGENTS.md, Skills, Commands (Slash Commands), Subagents, Hooks, and Plugins.

---

## 1. The Core Concept

**Agentic Centered Development** is the idea that, instead of just asking AI to generate code, you **structure your project so the agent is productive from the very first moment** — just like you'd onboard a new developer.

The building blocks are:

| Building Block | What it does | Who invokes | Where it lives |
|---|---|---|---|
| **CLAUDE.md** | Persistent project context | Automatic (always loaded) | Repo root, subdirs, `~/.claude/` |
| **Skills** | On-demand expertise (loaded when relevant) | The model decides on its own | `.claude/skills/`, `~/.claude/skills/` |
| **Slash Commands** | Reusable prompts with explicit trigger | The user (`/command`) | `.claude/commands/`, `~/.claude/commands/` |
| **Subagents** | Specialized agents with isolated context | The model delegates or you ask | `.claude/agents/`, `~/.claude/agents/` |
| **Hooks** | Deterministic actions (shell scripts) on lifecycle events | Automatic on events | Settings JSON |
| **Plugins** | Bundle of skills + commands + agents + hooks | Installation via marketplace | Public git repos |
| **MCP** | External tools and data via Model Context Protocol | Configured (settings) | Settings JSON |

The key analogy: **CLAUDE.md is the onboarding doc, Skills are the specialized documentation, Commands are the npm scripts, Subagents are the specialist colleagues, Hooks are the CI/CD, Plugins are npm packages, and MCP are DevTools extensions.**

---

## 2. CLAUDE.md (and AGENTS.md)

### What is it

A markdown file that Claude reads automatically at the start of every conversation. It's the "README for agents" — it provides context that the agent can't infer from code alone.

### CLAUDE.md vs AGENTS.md

- **CLAUDE.md** — native format for Claude Code (Anthropic)
- **AGENTS.md** — open format, cross-tool (supported by Codex, Cursor, Gemini CLI, Jules, etc.), maintained by the Agentic AI Foundation under the Linux Foundation
- In practice, the content is the same. You can have both.

### Hierarchy (Cascade)

```
~/.claude/CLAUDE.md          ← Global (personal preferences)
  └── /project/CLAUDE.md     ← Project (repo root)
      └── /project/src/CLAUDE.md   ← Subdirectory (local context)
          └── /project/tests/CLAUDE.md  ← Another subdir
```

Claude loads all of them found in the hierarchy. The closest one to the working directory takes precedence.

### What to include (WHY → WHAT → HOW)

```markdown
# Home Control App

## Project
React/Next.js app for Home Assistant device control.
Uses TypeScript strict, Tailwind CSS, and shadcn/ui.

## Commands
- `npm run dev` — Dev server (port 3000)
- `npm run build` — Production build
- `npm run test` — Vitest
- `npm run lint` — ESLint + Prettier

## Architecture
- `/app` — Next.js App Router
- `/components/ui` — Reusable components (shadcn)
- `/components/devices` — Components by device type
- `/lib/ha` — Home Assistant WebSocket API client
- `/hooks` — Custom hooks (useDevice, useAutomation, etc.)

## Conventions
- Named exports, never default exports
- One component per file
- Custom hooks prefixed with `use`
- Device types in `/types/devices.ts`
- New devices: create component + hook + type

## Watch out
- HA WebSocket can disconnect — always handle reconnection
- Never store tokens in client-side localStorage
- HA entities use `entity_id` in the format `domain.name`
```

### Best Practices

1. **Less is more** — Models follow ~150-200 instructions. If everything is IMPORTANT, nothing is.
2. **Don't repeat what Claude already knows** — You don't need to explain how React works.
3. **Progressive disclosure** — Instead of putting everything in CLAUDE.md, say where to find info: "For API conventions, see `/docs/api-conventions.md`".
4. **Refactor regularly** — Remove instructions that Claude already follows naturally.
5. **It's not a linter** — For strict rules, use hooks or real linters.

---

## 3. Skills (Agent Skills)

### What are they

Skills are **modular on-demand expertise**. Unlike CLAUDE.md (which is always loaded), a Skill is only read when Claude decides it's relevant for the task. It's like Neo's "I know Kung Fu" in The Matrix — it loads knowledge just-in-time.

### How it works (Progressive Disclosure)

1. **Startup**: Claude reads only the `name` and `description` of all available skills (metadata in the system prompt)
2. **Match**: When you make a request, Claude evaluates if any skill is relevant based on the description
3. **Load**: If yes, reads the full `SKILL.md` into context
4. **Execute**: Uses the instructions to complete the task

This is efficient because **only what's needed enters the context window**.

### Structure of a Skill

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

### SKILL.md — Anatomy

```markdown
---
name: add-device
description: >
  Scaffold a new Home Assistant device component with its hook,
  type definition, and tests. Use when adding support for a new
  device type like lights, switches, sensors, or climate controls.
---

# Add New Device Support

## When to use
When you need to add support for a new Home Assistant device type
to the application.

## Steps

1. Create the type in `/types/devices.ts`:
   - Extend the `BaseDevice` interface
   - Include HA domain-specific attributes

2. Create the hook in `/hooks/`:
   - Naming: `use{DeviceType}.ts` (e.g.: `useLight.ts`)
   - Must use the base `useHAWebSocket`
   - Include specific actions (toggle, setBrightness, etc.)

3. Create the component in `/components/devices/`:
   - Naming: `{DeviceType}Card.tsx` (e.g.: `LightCard.tsx`)
   - Use shadcn/ui components
   - Responsive: mobile-first

4. Register in the device registry `/lib/ha/deviceRegistry.ts`

5. Add tests in `/tests/devices/`

## Example: Light Device

### Type (`/types/devices.ts`)
```typescript
export interface LightDevice extends BaseDevice {
  domain: 'light';
  brightness: number;      // 0-255
  color_temp?: number;
  rgb_color?: [number, number, number];
  is_on: boolean;
}
```

### Hook (`/hooks/useLight.ts`)
```typescript
export function useLight(entityId: string) {
  const { state, callService } = useHAEntity(entityId);

  return {
    ...state,
    toggle: () => callService('light', 'toggle', { entity_id: entityId }),
    setBrightness: (value: number) =>
      callService('light', 'turn_on', { entity_id: entityId, brightness: value }),
  };
}
```
```

### Skill types by location

| Location | Scope | Shareable |
|---|---|---|
| `~/.claude/skills/` | Personal (all projects) | No |
| `.claude/skills/` | Project (via git) | Yes, with the team |
| Plugin marketplace | Community | Yes, publicly |

### Advanced frontmatter

```yaml
---
name: safe-analyzer
description: Analyze code without making changes
allowed-tools: Read, Grep, Glob    # Restricts available tools
---
```

```yaml
---
name: deploy-check
description: Pre-deployment validation
disable-model-invocation: true     # Only invocable via /deploy-check
---
```

### Skill vs CLAUDE.md — When to use which?

| Situation | Use |
|---|---|
| Context that is ALWAYS relevant | CLAUDE.md |
| Expertise for specific tasks | Skill |
| Info that takes up too much context space | Skill |
| Reusable workflows with templates | Skill |
| Build/test/lint commands | CLAUDE.md |

---

## 4. Slash Commands

### What are they

Reusable prompts that you invoke explicitly with `/name`. They're shortcuts for workflows you do frequently.

> **Note**: Since Claude Code 1.0, commands and skills have been "merged". A file at `.claude/commands/review.md` and one at `.claude/skills/review/SKILL.md` both create `/review`. Existing commands continue to work.

### Structure

```
.claude/commands/
  ├── add-device.md
  ├── review.md
  └── deploy-check.md
```

### Example: `/add-device`

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

### Example: `/review`

```markdown
Review the current changes for code quality.

1. Run `git diff --staged` to see changes
2. Check for:
   - TypeScript type safety (no `any`)
   - Missing error handling
   - Home Assistant entity_id validation
   - WebSocket reconnection handling
   - Proper cleanup in useEffect hooks
3. Suggest improvements
4. Rate severity: 🔴 must fix, 🟡 should fix, 🟢 nice to have
```

### Dynamic Context with `!command`

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

The `!` commands execute BEFORE sending to Claude. Claude only sees the result.

### Commands vs Skills — Key difference

| | Commands (Slash) | Skills |
|---|---|---|
| **Who invokes** | You (`/command`) | The model (automatic) |
| **When** | Explicitly | When the model deems it relevant |
| **Purpose** | Repetitive workflows, shortcuts | Specialized expertise |
| **Arguments** | Yes (`$ARGUMENTS`) | No |

---

## 5. Subagents

### What are they

Specialized agents with their **own context window**, system prompt, and tools. When Claude encounters a task that matches a subagent's description, it delegates the work.

### Why use them

1. **Preserve context** — The subagent's exploration and output don't pollute your main conversation
2. **Specialization** — Focused system prompts yield better results
3. **Control** — You can limit the tools each agent has access to
4. **Cost** — You can route to cheaper models (Haiku) for simple tasks

### Built-in subagents

| Agent | What it does | Tools |
|---|---|---|
| **Explore** | Read-only codebase research and analysis | Read, Grep, Glob |
| **Plan** | Planning without modifying files | Read, Grep, Glob |
| **general-purpose** | Generic tasks | All |

### Creating a custom subagent

File: `.claude/agents/ha-expert.md`

```markdown
---
name: ha-expert
description: >
  Home Assistant integration expert. Use when working with HA
  WebSocket API, entity management, automations, or device
  state handling. Knows HA conventions and common pitfalls.
model: sonnet
tools: Read, Grep, Glob, Bash(npm *)
---

You are a Home Assistant integration specialist working within
a React/Next.js application.

## Your expertise
- Home Assistant WebSocket API
- Entity state management and subscriptions
- Service calls and their parameters
- Device domains (light, switch, sensor, climate, etc.)
- Authentication flows (long-lived tokens, OAuth)

## When analyzing code
1. Check WebSocket connection handling (reconnection, heartbeat)
2. Verify entity_id format validation
3. Look for proper state subscription cleanup
4. Ensure service calls have correct domain/service format

## Common pitfalls to watch for
- Not handling HA unavailability gracefully
- Missing unsubscribe on component unmount
- Assuming entity attributes exist (they vary by integration)
- Not throttling rapid state updates from HA
```

### Managing subagents

```bash
/agents           # View all subagents, create new ones
/agents create    # Interactive wizard
```

### Subagent vs Skill

| | Subagent | Skill |
|---|---|---|
| **Context** | Isolated (own context window) | Shared (same context) |
| **Execution** | Works independently, returns result | Instructions injected into conversation |
| **Model** | Can use a different model | Uses the conversation's model |
| **Ideal for** | Long, exploratory tasks | Punctual expertise, templates |

---

## 6. Hooks

### What are they

Shell scripts that run automatically on Claude Code lifecycle events. They are **deterministic** — unlike CLAUDE.md which are suggestions, hooks are rules that are always enforced.

### Available events

| Event | When |
|---|---|
| `PreToolUse` | Before any tool runs (Read, Write, Bash, etc.) |
| `PostToolUse` | After a tool executes |
| `Stop` | When the main agent finishes |
| `SubagentStop` | When a subagent finishes |
| `Notification` | When a notification is sent |

### Practical example: Block commits without tests

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

- **CLAUDE.md**: "Run tests before committing" (suggestion — can be ignored)
- **Hook**: Literally blocks the commit if tests haven't passed (deterministic)

---

## 7. Plugins

### What are they

Bundles of skills + commands + agents + hooks in a shareable git repository. They're like npm packages but for agents.

### Structure

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

### Marketplaces

Public git repositories that list plugins. Anthropic has an official marketplace, and you can create your own.

```bash
/plugins install <url>    # Install a plugin
/plugins                  # Manage installed plugins
```

---

## 8. MCP (Model Context Protocol)

### What is it

MCP servers extend the agent with **external tools and data sources**. Think of MCP as **DevTools extensions for the agent** — just like you install React DevTools in the browser, you install MCP servers to give the agent superpowers.

### MCP server examples

| Server | What it does |
|---|---|
| **Playwright** | Browse, test and screenshot web pages |
| **Figma** | Read designs, tokens and components |
| **GitHub** | Manage repos, PRs, issues |
| **Postgres / Supabase** | Query and design database schemas |

There's an official registry at [modelcontextprotocol.io](https://modelcontextprotocol.io) with hundreds of available servers.

### Configuration

MCP servers are configured in `settings.json` (global or local to the project). Once configured, they're always available to the agent.

---

## 9. Putting It All Together — Example: Home Control App

Here's what the complete project would look like with all building blocks:

```
home-control-app/
├── CLAUDE.md                           ← Global project context
├── .claude/
│   ├── skills/
│   │   ├── add-device/
│   │   │   ├── SKILL.md                ← How to add a new device
│   │   │   └── templates/
│   │   │       ├── DeviceCard.tsx.tmpl
│   │   │       └── useDevice.ts.tmpl
│   │   ├── ha-websocket/
│   │   │   └── SKILL.md                ← HA WebSocket expertise
│   │   └── component-patterns/
│   │       └── SKILL.md                ← React component patterns
│   ├── commands/
│   │   ├── add-device.md               ← /add-device <type>
│   │   ├── review.md                   ← /review
│   │   └── deploy-check.md            ← /deploy-check
│   └── agents/
│       ├── ha-expert.md                ← Home Assistant specialist
│       └── accessibility-reviewer.md   ← a11y review
├── app/
├── components/
├── hooks/
├── lib/
├── types/
└── tests/
```

### Real workflow

```
You: /add-device climate

Claude: [Reads the command add-device.md]
        [Detects that the "add-device" skill is relevant → loads SKILL.md]
        [Follows the steps, uses templates]
        [Delegates HA validation to the subagent ha-expert]
        [Creates files, runs lint and tests]
        [Hook blocks commit if tests fail]

Result: ClimateCard.tsx, useClimate.ts, types, tests — all consistent
```

---

## 10. Mental Map for the Talk

```
Agentic Centered Development
│
├── 🧠 The Problem
│   ├── "I generated code with AI and it came out inconsistent"
│   ├── The agent doesn't know your conventions
│   └── Repeating context every session
│
├── 📋 CLAUDE.md — The Onboarding
│   ├── WHY: What the project is
│   ├── WHAT: Architecture and structure
│   ├── HOW: Commands, conventions, gotchas
│   └── Less is more + progressive disclosure
│
├── 🎯 Skills — On-Demand Expertise
│   ├── Model-invoked (automatic)
│   ├── Progressive disclosure (only loads when needed)
│   ├── Templates + supporting scripts
│   └── Demo: "add-device" skill with templates
│
├── ⚡ Commands — The Shortcuts
│   ├── User-invoked (/command)
│   ├── $ARGUMENTS for parameterization
│   ├── !`shell` for dynamic context
│   └── Demo: /add-device thermostat
│
├── 🤖 Subagents — The Team
│   ├── Isolated context window
│   ├── Specialization (HA expert, a11y reviewer)
│   ├── Different model per cost
│   └── Demo: automatic delegation to ha-expert
│
├── 🔒 Hooks — The CI/CD
│   ├── Deterministic (not a suggestion)
│   ├── Block commits, validate, notify
│   └── Complement to CLAUDE.md
│
├── 📦 Plugins — Sharing
│   ├── Bundle everything in a git repo
│   ├── Marketplace for the community
│   └── E.g.: "home-assistant-react-toolkit"
│
└── 🔌 MCP — External Superpowers
    ├── DevTools extensions for the agent
    ├── Playwright, Figma, GitHub, Postgres
    └── Official registry at modelcontextprotocol.io
```

---

## 11. Resources and References

- **Official Skills Docs**: https://code.claude.com/docs/en/skills
- **Official Subagents Docs**: https://code.claude.com/docs/en/sub-agents
- **Anthropic Blog — Agent Skills**: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- **AGENTS.md (open format)**: https://agents.md/
- **Awesome Agent Skills**: https://github.com/VoltAgent/awesome-agent-skills
- **Awesome Subagents**: https://github.com/VoltAgent/awesome-claude-code-subagents
- **Best Practices Claude Code**: https://code.claude.com/docs/en/best-practices
- **Deep dive Skills architecture**: https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/
- **MCP Registry**: https://modelcontextprotocol.io
- **CLAUDE.md guide (Builder.io)**: https://www.builder.io/blog/claude-md-guide
- **Writing good CLAUDE.md (HumanLayer)**: https://www.humanlayer.dev/blog/writing-a-good-claude-md
