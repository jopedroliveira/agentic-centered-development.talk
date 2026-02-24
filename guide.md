# Agentic Centered Development — Guia Completo

> Guia de referência para a talk e para aprendizagem pessoal.
> Cobre CLAUDE.md / AGENTS.md, Skills, Commands (Slash Commands), Subagents, Hooks, e Plugins.

---

## 1. O Conceito Central

**Agentic Centered Development** é a ideia de que, em vez de apenas pedires ao AI para gerar código, **estruturas o teu projeto para que o agente seja produtivo desde o primeiro momento** — tal como farias onboarding a um developer novo.

Os building blocks são:

| Building Block | O que faz | Quem invoca | Onde vive |
|---|---|---|---|
| **CLAUDE.md** | Contexto persistente do projeto | Automático (sempre carregado) | Raiz do repo, subdirs, `~/.claude/` |
| **Skills** | Expertise on-demand (carregado quando relevante) | O modelo decide sozinho | `.claude/skills/`, `~/.claude/skills/` |
| **Slash Commands** | Prompts reutilizáveis com trigger explícito | O utilizador (`/command`) | `.claude/commands/`, `~/.claude/commands/` |
| **Subagents** | Agentes especializados com contexto isolado | O modelo delega ou tu pedes | `.claude/agents/`, `~/.claude/agents/` |
| **Hooks** | Ações determinísticas (shell scripts) em lifecycle events | Automático em eventos | Settings JSON |
| **Plugins** | Bundle de skills + commands + agents + hooks | Instalação via marketplace | Git repos públicos |

A analogia chave: **CLAUDE.md é o onboarding doc, Skills são a documentação especializada, Commands são os scripts do Makefile, Subagents são os colegas especialistas, e Hooks são o CI/CD.**

---

## 2. CLAUDE.md (e AGENTS.md)

### O que é

Um ficheiro markdown que o Claude lê automaticamente no início de cada conversa. É o "README para agentes" — dá contexto que o agente não consegue inferir só do código.

### CLAUDE.md vs AGENTS.md

- **CLAUDE.md** — formato nativo do Claude Code (Anthropic)
- **AGENTS.md** — formato aberto, cross-tool (suportado por Codex, Cursor, Gemini CLI, Jules, etc.), mantido pela Agentic AI Foundation sob a Linux Foundation
- Na prática, o conteúdo é o mesmo. Podes ter ambos.

### Hierarquia (cascata)

```
~/.claude/CLAUDE.md          ← Global (preferências pessoais)
  └── /projeto/CLAUDE.md     ← Projeto (root do repo)
      └── /projeto/src/CLAUDE.md   ← Subdiretório (contexto local)
          └── /projeto/tests/CLAUDE.md  ← Outro subdir
```

O Claude carrega todos os que encontrar na hierarquia. O mais próximo do diretório de trabalho tem precedência.

### O que incluir (WHY → WHAT → HOW)

```markdown
# Home Control App

## Projeto
App React/Next.js para controlo de dispositivos Home Assistant.
Usa TypeScript strict, Tailwind CSS, e shadcn/ui.

## Comandos
- `npm run dev` — Dev server (port 3000)
- `npm run build` — Build de produção
- `npm run test` — Vitest
- `npm run lint` — ESLint + Prettier

## Arquitetura
- `/app` — Next.js App Router
- `/components/ui` — Componentes reutilizáveis (shadcn)
- `/components/devices` — Componentes por tipo de device
- `/lib/ha` — Client Home Assistant WebSocket API
- `/hooks` — Custom hooks (useDevice, useAutomation, etc.)

## Convenções
- Named exports, nunca default exports
- Um componente por ficheiro
- Hooks custom prefixados com `use`
- Device types em `/types/devices.ts`
- Novos devices: criar componente + hook + tipo

## Cuidado
- O WebSocket do HA pode desligar — sempre handle reconnection
- Nunca guardar tokens no client-side localStorage
- As entidades do HA usam `entity_id` no formato `domain.name`
```

### Best Practices

1. **Menos é mais** — Modelos atendem ~150-200 instruções. Se tudo é IMPORTANT, nada é.
2. **Não repitas o que o Claude já sabe** — Não precisas explicar como funciona React.
3. **Progressive disclosure** — Em vez de meter tudo no CLAUDE.md, diz-lhe onde encontrar info: "Para convenções de API, ver `/docs/api-conventions.md`".
4. **Refactora regularmente** — Remove instruções que o Claude já segue naturalmente.
5. **Não é um linter** — Para regras rígidas, usa hooks ou linters reais.

---

## 3. Skills (Agent Skills)

### O que são

Skills são **expertise modular on-demand**. Ao contrário do CLAUDE.md (que é sempre carregado), uma Skill só é lida quando o Claude decide que é relevante para a tarefa. É como o "I know Kung Fu" do Neo no Matrix — carrega o conhecimento just-in-time.

### Como funciona (Progressive Disclosure)

1. **Arranque**: O Claude lê apenas o `name` e `description` de todas as skills disponíveis (metadata no system prompt)
2. **Match**: Quando recebes um pedido, o Claude avalia se alguma skill é relevante baseado na descrição
3. **Load**: Se sim, lê o `SKILL.md` completo para o contexto
4. **Execute**: Usa as instruções para completar a tarefa

Isto é eficiente porque **só o que é preciso entra no context window**.

### Estrutura de uma Skill

```
.claude/skills/
  └── add-device/
      ├── SKILL.md           ← Obrigatório (instruções + metadata)
      ├── templates/
      │   ├── DeviceComponent.tsx.template
      │   └── useDevice.ts.template
      └── scripts/
          └── scaffold.sh
```

### SKILL.md — Anatomia

```markdown
---
name: add-device
description: >
  Scaffold a new Home Assistant device component with its hook,
  type definition, and tests. Use when adding support for a new
  device type like lights, switches, sensors, or climate controls.
---

# Add New Device Support

## Quando usar
Quando precisas de adicionar suporte para um novo tipo de device
do Home Assistant à aplicação.

## Passos

1. Criar o tipo em `/types/devices.ts`:
   - Extender a interface `BaseDevice`
   - Incluir os atributos específicos do domínio HA

2. Criar o hook em `/hooks/`:
   - Naming: `use{DeviceType}.ts` (ex: `useLight.ts`)
   - Deve usar o `useHAWebSocket` base
   - Incluir actions específicas (toggle, setBrightness, etc.)

3. Criar o componente em `/components/devices/`:
   - Naming: `{DeviceType}Card.tsx` (ex: `LightCard.tsx`)
   - Usar shadcn/ui components
   - Responsive: mobile-first

4. Registar no device registry `/lib/ha/deviceRegistry.ts`

5. Adicionar testes em `/tests/devices/`

## Exemplo: Light Device

### Tipo (`/types/devices.ts`)
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

### Tipos de Skills por localização

| Localização | Scope | Partilhável |
|---|---|---|
| `~/.claude/skills/` | Pessoal (todos os projetos) | Não |
| `.claude/skills/` | Projeto (via git) | Sim, com a equipa |
| Plugin marketplace | Comunidade | Sim, publicamente |

### Frontmatter avançado

```yaml
---
name: safe-analyzer
description: Analyze code without making changes
allowed-tools: Read, Grep, Glob    # Restringe as ferramentas disponíveis
---
```

```yaml
---
name: deploy-check
description: Pre-deployment validation
disable-model-invocation: true     # Só invocável via /deploy-check
---
```

### Skill vs CLAUDE.md — Quando usar qual?

| Situação | Usar |
|---|---|
| Contexto que é SEMPRE relevante | CLAUDE.md |
| Expertise para tarefas específicas | Skill |
| Info que ocupa muito espaço no context | Skill |
| Workflows reutilizáveis com templates | Skill |
| Comandos de build/test/lint | CLAUDE.md |

---

## 4. Slash Commands

### O que são

Prompts reutilizáveis que tu invocas explicitamente com `/nome`. São atalhos para workflows que fazes frequentemente.

> **Nota**: Desde Claude Code 1.0, commands e skills foram "merged". Um ficheiro em `.claude/commands/review.md` e um em `.claude/skills/review/SKILL.md` criam ambos o `/review`. Commands existentes continuam a funcionar.

### Estrutura

```
.claude/commands/
  ├── add-device.md
  ├── review.md
  └── deploy-check.md
```

### Exemplo: `/add-device`

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

**Uso**: `/add-device thermostat`

O `$ARGUMENTS` é substituído por tudo o que escreveres depois do comando.

### Exemplo: `/review`

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

### Dynamic Context com `!command`

Commands podem executar shell commands e injetar o output:

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

Os comandos `!` executam ANTES de enviar ao Claude. O Claude só vê o resultado.

### Commands vs Skills — Diferença-chave

| | Commands (Slash) | Skills |
|---|---|---|
| **Quem invoca** | Tu (`/command`) | O modelo (automático) |
| **Quando** | Explicitamente | Quando o modelo acha relevante |
| **Para quê** | Workflows repetitivos, atalhos | Expertise especializada |
| **Argumentos** | Sim (`$ARGUMENTS`) | Não |

---

## 5. Subagents

### O que são

Agentes especializados com o seu **próprio context window**, system prompt, e ferramentas. Quando o Claude encontra uma tarefa que match a descrição de um subagent, delega-lhe o trabalho.

### Porquê usar

1. **Preservar contexto** — A exploração e output do subagent não poluem a tua conversa principal
2. **Especialização** — System prompts focados dão melhores resultados
3. **Controlo** — Podes limitar as ferramentas que cada agente tem
4. **Custo** — Podes rotear para modelos mais baratos (Haiku) para tarefas simples

### Built-in subagents

| Agente | O que faz | Ferramentas |
|---|---|---|
| **Explore** | Pesquisa e análise read-only do codebase | Read, Grep, Glob |
| **Plan** | Planeamento sem alterar ficheiros | Read, Grep, Glob |
| **general-purpose** | Tarefas genéricas | Todas |

### Criar um subagent custom

Ficheiro: `.claude/agents/ha-expert.md`

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

### Gestão de subagents

```bash
/agents           # Ver todos os subagents, criar novos
/agents create    # Wizard interativo
```

### Subagent vs Skill

| | Subagent | Skill |
|---|---|---|
| **Context** | Isolado (próprio context window) | Partilhado (mesmo context) |
| **Execução** | Trabalha independentemente, retorna resultado | Instruções injetadas na conversa |
| **Modelo** | Pode usar modelo diferente | Usa o modelo da conversa |
| **Ideal para** | Tarefas longas, exploratórias | Expertise pontual, templates |

---

## 6. Hooks

### O que são

Shell scripts que executam automaticamente em eventos do lifecycle do Claude Code. São **determinísticos** — ao contrário do CLAUDE.md que são sugestões, hooks são regras que se cumprem sempre.

### Eventos disponíveis

| Evento | Quando |
|---|---|
| `PreToolUse` | Antes de qualquer ferramenta (Read, Write, Bash, etc.) |
| `PostToolUse` | Depois de uma ferramenta executar |
| `Stop` | Quando o agente principal termina |
| `SubagentStop` | Quando um subagente termina |
| `Notification` | Quando uma notificação é enviada |

### Exemplo prático: Bloquear commits sem testes

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

- **CLAUDE.md**: "Corre os testes antes de fazer commit" (sugestão — pode ser ignorada)
- **Hook**: Bloqueia literalmente o commit se os testes não passaram (determinístico)

---

## 7. Plugins

### O que são

Bundles de skills + commands + agents + hooks num repositório git partilhável. São como packages npm mas para agentes.

### Estrutura

```
meu-plugin/
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

Repositórios git públicos que listam plugins. A Anthropic tem um marketplace oficial, e tu podes criar o teu.

```bash
/plugins install <url>    # Instalar um plugin
/plugins                  # Gerir plugins instalados
```

---

## 8. Juntando Tudo — Exemplo: Home Control App

Aqui está como ficaria o projeto completo com todos os building blocks:

```
home-control-app/
├── CLAUDE.md                           ← Contexto global do projeto
├── .claude/
│   ├── skills/
│   │   ├── add-device/
│   │   │   ├── SKILL.md                ← Como adicionar novo device
│   │   │   └── templates/
│   │   │       ├── DeviceCard.tsx.tmpl
│   │   │       └── useDevice.ts.tmpl
│   │   ├── ha-websocket/
│   │   │   └── SKILL.md                ← Expertise WebSocket HA
│   │   └── component-patterns/
│   │       └── SKILL.md                ← Padrões de componentes React
│   ├── commands/
│   │   ├── add-device.md               ← /add-device <tipo>
│   │   ├── review.md                   ← /review
│   │   └── deploy-check.md            ← /deploy-check
│   └── agents/
│       ├── ha-expert.md                ← Especialista Home Assistant
│       └── accessibility-reviewer.md   ← Review de a11y
├── app/
├── components/
├── hooks/
├── lib/
├── types/
└── tests/
```

### Flow de trabalho real

```
Tu: /add-device climate

Claude: [Lê o command add-device.md]
        [Deteta que a skill "add-device" é relevante → carrega SKILL.md]
        [Segue os passos, usa templates]
        [Delega validação HA ao subagent ha-expert]
        [Cria ficheiros, corre lint e testes]
        [Hook bloqueia commit se testes falharem]

Resultado: ClimateCard.tsx, useClimate.ts, tipos, testes — tudo consistente
```

---

## 9. Mapa Mental para a Talk

```
Agentic Centered Development
│
├── 🧠 O Problema
│   ├── "Gerei código com AI e saiu inconsistente"
│   ├── O agente não conhece as tuas convenções
│   └── Repetir contexto em cada sessão
│
├── 📋 CLAUDE.md — O Onboarding
│   ├── WHY: O que é o projeto
│   ├── WHAT: Arquitetura e estrutura
│   ├── HOW: Comandos, convenções, gotchas
│   └── Less is more + progressive disclosure
│
├── 🎯 Skills — Expertise On-Demand
│   ├── Model-invoked (automático)
│   ├── Progressive disclosure (só carrega quando precisa)
│   ├── Templates + scripts de suporte
│   └── Demo: skill "add-device" com templates
│
├── ⚡ Commands — Os Atalhos
│   ├── User-invoked (/command)
│   ├── $ARGUMENTS para parametrização
│   ├── !`shell` para contexto dinâmico
│   └── Demo: /add-device thermostat
│
├── 🤖 Subagents — A Equipa
│   ├── Context window isolado
│   ├── Especialização (HA expert, a11y reviewer)
│   ├── Modelo diferente por custo
│   └── Demo: delegação automática ao ha-expert
│
├── 🔒 Hooks — O CI/CD
│   ├── Determinístico (não é sugestão)
│   ├── Block commits, validate, notify
│   └── Complemento ao CLAUDE.md
│
└── 📦 Plugins — Partilha
    ├── Bundle tudo num repo git
    ├── Marketplace para a comunidade
    └── Ex: "home-assistant-react-toolkit"
```

---

## 10. Recursos e Referências

- **Docs oficiais Skills**: https://code.claude.com/docs/en/skills
- **Docs oficiais Subagents**: https://code.claude.com/docs/en/sub-agents
- **Blog Anthropic — Agent Skills**: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- **AGENTS.md (formato aberto)**: https://agents.md/
- **Awesome Agent Skills**: https://github.com/VoltAgent/awesome-agent-skills
- **Awesome Subagents**: https://github.com/VoltAgent/awesome-claude-code-subagents
- **Best Practices Claude Code**: https://code.claude.com/docs/en/best-practices
- **Deep dive Skills architecture**: https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/
- **CLAUDE.md guide (Builder.io)**: https://www.builder.io/blog/claude-md-guide
- **Writing good CLAUDE.md (HumanLayer)**: https://www.humanlayer.dev/blog/writing-a-good-claude-md
