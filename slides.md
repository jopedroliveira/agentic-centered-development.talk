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
Vamos falar sobre como parar de tratar agentes de AI como autocomplete glorificado e começar a tratá-los como membros da equipa.
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
Intro rápida. Fullstack web developer na subvisual, e uma das pessoas que organiza o meetup
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
Quem aqui já teve código gerado por AI que não seguia as convenções do projeto? O problema não é o modelo — é a falta de contexto.
-->

---

# The Core Idea

> Instead of just asking AI to generate code, you **structure your project so the agent is productive from the very first moment** — just like you'd onboard a new developer.

<br>

<div class="text-sm opacity-60">
  Examples use <strong class="text-[#F29EFE]">Claude Code</strong> — but the principles apply to <strong>Cursor</strong>, <strong>Windsurf</strong>, <strong>GitHub Copilot</strong>, and others.
</div>

<!--
Da mesma forma que preparas documentação e processos para um dev novo, fazes o mesmo para o agente.

Nesta talk vou usar o Claude Code como exemplo, mas os princípios são transferíveis. O Cursor tem .cursorrules e slash commands, o Windsurf tem .windsurfrules e workflows, o GitHub Copilot tem copilot-instructions.md e AGENTS.md, o Cline tem .clinerules. MCP é suportado por quase todos. A diferença é que o Claude Code formaliza todos estes conceitos — context files, skills, commands, subagents, hooks, plugins — como features de primeira classe.

A partir daqui vou usar como exemplo um projeto real: a minha app de Home Assistant. É uma app React/Next.js que controla dispositivos de casa — luzes, sensores, climatização. O objetivo era dar uma interface simples à família, sem precisarem de saber o que é o Home Assistant. Vamos ver como estruturei o projeto para que o Claude fosse produtivo desde o primeiro momento.
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
Cada building block tem um papel diferente. Vamos ver cada um em detalhe.
-->

---
layout: section
---

# CLAUDE.md

The Onboarding Doc

<!--
Vamos começar pelo mais importante: o CLAUDE.md. É o documento de onboarding do agente.
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
O AGENTS.md é mantido pela Agentic AI Foundation sob a Linux Foundation. Podes ter ambos no projeto.
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
O Claude carrega todos os que encontrar na hierarquia. Funciona em cascata — o mais próximo do diretório de trabalho tem precedência.
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
Isto é um exemplo real. Reparem na estrutura: WHY (o que é o projeto), WHAT (arquitetura), HOW (comandos e convenções). Continua no próximo slide.
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
A secção "Watch out" é muitas vezes a mais valiosa. É conhecimento tribal — coisas que o agente não consegue inferir só a olhar para o código.
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
O ponto 1 é crucial. Um CLAUDE.md de 500 linhas vai ser parcialmente ignorado. Menos é mais.
-->

---
layout: section
---

# Skills

On-Demand Expertise

<!--
Agora vamos falar de Skills — expertise modular on-demand.
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
É como o "I know Kung Fu" do Neo no Matrix — carrega conhecimento just-in-time. Só o que é preciso entra no context window.
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
Uma skill vive numa pasta com o SKILL.md obrigatório. Pode ter templates e scripts de suporte. O frontmatter define o nome e a descrição que o modelo vê no arranque.
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
Este é o conteúdo completo de um SKILL.md — passos claros e um exemplo concreto. O Claude segue isto quando carrega a skill.
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
Podes restringir ferramentas para skills read-only, ou desativar a invocação automática para que só funcione como slash command explícito.
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
Regra simples: se é sempre relevante, CLAUDE.md. Se é expertise para tarefas específicas, Skill.
-->

---
layout: section
---

# Slash Commands

The Shortcuts

<!--
Agora os Slash Commands — os atalhos que tu invocas explicitamente.
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
Desde a versão 1.0 do Claude Code, commands e skills foram merged. Ambos criam o mesmo slash command.
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
O $ARGUMENTS é substituído por tudo o que escreveres depois do comando. Neste caso, "thermostat" seria o tipo de device.
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
Os comandos com ! executam antes de enviar ao Claude. Ele só vê o output. Isto é fundamental porque significa que o contexto é sempre fresh — não é uma cópia estática que pode ficar desatualizada. Cada vez que invocas o /pr-summary, ele vai buscar o diff e os comentários naquele momento.

Outro detalhe importante: o ! corre na shell do utilizador, com as permissões e environment variables do utilizador. Ou seja, podes usar qualquer CLI que tenhas instalado — gh, jq, curl, docker, kubectl — para injetar contexto de qualquer fonte. Não estás limitado ao que o Claude consegue aceder diretamente.
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
Resumo: commands são para invocares, skills são para o modelo decidir. Commands aceitam argumentos, skills não.
-->

---
layout: section
---

# Subagents

The Team

<!--
Subagents — a equipa de especialistas que o agente principal pode delegar trabalho.
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
Quatro razões principais: preservar contexto, especialização, controlo de ferramentas, e otimização de custos. Podes usar Haiku para tarefas simples e poupar tokens.
-->

---

# Built-in Subagents

| Agent | What it does | Tools |
|---|---|---|
| **Explore** | Read-only codebase research and analysis | Read, Grep, Glob |
| **Plan** | Planning without modifying files | Read, Grep, Glob |
| **general-purpose** | Generic tasks | All |

<!--
O Claude Code já vem com estes subagents built-in. O Explore é read-only, o Plan só planeia, e o general-purpose tem acesso a tudo.
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
Aqui temos o frontmatter do subagent: nome, descrição, modelo (sonnet para poupar), ferramentas permitidas. Depois o system prompt com a expertise.
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
A secção de "Common pitfalls" é o que torna um subagent realmente útil vs. um modelo genérico.

Neste exemplo do Home Assistant:
- "Not handling HA unavailability" — o servidor HA pode ir abaixo ou reiniciar. Se o agente gerar código que assume que o WebSocket está sempre ligado, vais ter crashes silenciosos em produção. O subagent sabe que deve sempre gerar lógica de reconnection com backoff.
- "Missing unsubscribe on component unmount" — no React, se subscreveres a state updates do HA via WebSocket e não fizeres cleanup no useEffect return, tens memory leaks e state updates em componentes desmontados. O subagent sabe verificar isto automaticamente.
- "Assuming entity attributes exist" — cada integração do HA pode ter atributos diferentes. Uma lâmpada Hue tem color_temp, mas uma lâmpada genérica pode não ter. O subagent sabe que deve sempre usar optional chaining e verificar a existência dos atributos.

O ponto-chave: estes pitfalls são conhecimento tribal que vem da experiência com a tecnologia. Um modelo genérico não saberia disto. Ao codificá-los no subagent, estás a dar-lhe anos de experiência em segundos.

Isto aplica-se a qualquer domínio: Stripe (idempotency keys, webhook retries), AWS (IAM least privilege, eventual consistency), bases de dados (N+1 queries, missing indexes), etc.
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
Subagent: contexto isolado, trabalha independente, pode usar modelo diferente. Skill: partilha contexto, instruções injetadas na conversa. Usa subagent para tarefas longas, skill para expertise pontual.
-->

---
layout: section
---

# Hooks

The CI/CD

<!--
Hooks — o CI/CD do agente. Tudo o que vimos até agora (CLAUDE.md, skills, commands) são "soft" — o modelo pode decidir não seguir. Os hooks são "hard" — são shell scripts que correm automaticamente e podem bloquear ações. É a diferença entre dizer "por favor corre os testes" e ter um CI que falha o build se os testes não passarem.
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
Cinco eventos de lifecycle disponíveis.

Onde vivem os hooks? No settings.json — que pode ser global (~/.claude/settings.json, as tuas preferências pessoais) ou local ao projeto (.claude/settings.json, partilhado com a equipa via git). A diferença é importante: hooks globais aplicam-se a todos os teus projetos (ex: nunca fazer force push), hooks locais são específicos do projeto (ex: correr o linter deste repo). Ao contrário do CLAUDE.md que também tem esta hierarquia, aqui estamos a falar de regras hard-coded, não sugestões.

- PreToolUse é o mais poderoso: corre ANTES de qualquer ferramenta. Se o script imprimir algo com "BLOCK:", a ação é cancelada. Podes usá-lo para impedir commits sem testes, bloquear escrita em ficheiros protegidos, ou validar que o linter passou.
- PostToolUse corre depois — útil para logging, notificações (ex: Slack quando o agente faz deploy), ou para correr formatação automática depois de o agente escrever código.
- Stop e SubagentStop correm no final — bons para cleanup, relatórios de sessão, ou garantir que não ficaram ficheiros temporários.
- Notification — quando o agente envia uma notificação ao utilizador (ex: tarefa terminada), podes trigger ações externas.

O matcher aceita glob patterns: "Bash(git commit*)" apanha qualquer git commit, "Write(*.env)" apanha escrita em ficheiros .env. Podes ter vários hooks por evento.

Importante: hooks são determinísticos — não há AI envolvida. São shell scripts puros. Isto dá-te garantias que o CLAUDE.md não pode dar.
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
Neste exemplo: o matcher "Bash(git commit*)" intercepta qualquer tentativa de commit. O command verifica se existe o ficheiro /tmp/tests-passed — se não existir, imprime "BLOCK:" e o commit é cancelado.

Na prática, terias outro hook PostToolUse que cria esse ficheiro quando os testes passam. Assim garantes o fluxo: testes primeiro, commit depois.

Outros exemplos úteis de hooks:
- Bloquear escrita em .env ou ficheiros de credenciais: matcher "Write(*.env)", command que imprime BLOCK
- Auto-formatar código depois de escrito: PostToolUse com matcher "Write(*.ts)", command "npx prettier --write $FILE"
- Notificar no Slack quando uma tarefa termina: Stop hook que faz curl para um webhook
- Impedir force push: PreToolUse com matcher "Bash(git push --force*)"

A tabela resume a diferença fundamental: CLAUDE.md é uma sugestão ("por favor corre os testes"), o hook é uma regra que se cumpre sempre. Usa CLAUDE.md para guidelines, hooks para invariantes que nunca devem ser violados.
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
Quatro exemplos práticos para além do commit blocking:
- Proteger ficheiros sensíveis como .env de serem modificados pelo agente.
- Auto-formatar código com Prettier sempre que o agente escreve um ficheiro TypeScript — assim não precisas de pedir ao agente para formatar.
- Impedir force push — uma regra de segurança que queres garantir sempre.
- O último é um hook Stop (sem matcher) — corre sempre que o agente termina. Neste caso notifica o Slack. Útil para quando lançaste uma tarefa longa e queres ser avisado.
-->

---
layout: section
---

# Plugins

Sharing

<!--
Plugins — a forma de partilhar tudo o que vimos até agora num pacote reutilizável.
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
Um plugin é um bundle de skills, commands, agents e hooks num repo git. Instala-se com um comando e está pronto a usar. A Anthropic tem um marketplace oficial.
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
MCP é o protocolo que permite ao agente ligar-se a ferramentas externas. 
O Playwright permite navegar e testar páginas web — usámos isto para construir esta apresentação. 
O Figma MCP é oficial e dá ao agente contexto de design direto dos ficheiros Figma. 
O GitHub MCP permite gerir repos, PRs e issues. E há servidores para bases de dados como Postgres e Supabase.

Pensem no MCP como extensões de DevTools para o agente — da mesma forma que instalas o React DevTools ou o Redux DevTools no browser para ter superpoderes de debugging, instalas MCP servers para dar superpoderes ao agente. Há um registry oficial em modelcontextprotocol.io com centenas de servidores.
-->

---
layout: section
---

# Putting It All Together

<!--
Agora vamos juntar tudo e ver como ficaria um projeto completo.
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
Aqui está a estrutura completa. CLAUDE.md na raiz, skills com templates, commands para atalhos, e agents especializados. Tudo versionado no git com a equipa.
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
Este é o flow real. Um único comando dispara o command, que ativa a skill, que usa templates, delega ao subagent, e o hook garante qualidade. Tudo automático e consistente.
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
Mapa mental de resumo. Cada building block tem o seu papel. A ideia central é: estrutura o teu projeto para que o agente seja produtivo desde o primeiro momento.
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
Obrigado! Perguntas?
-->