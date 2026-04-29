<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
# 🌌 Swarm Orchestration Protocol (AGENTS.md)

## 1. Topographic Hierarchy
This repository operates on a Tiered Agentic Swarm architecture. Agents must strictly adhere to their designated scopes and hand-off protocols.

* **[Node 0] The Synthesizer (Architect):** Responsible for system design, structural integrity, and assigning tasks to Node 1 agents. Has read/write access to `architecture/` and `docs/`.
* **[Node 1] The Executors (Developers):** Responsible for writing highly optimized, deterministic code. Has read/write access to `src/`. Cannot alter dependencies without Node 0 approval.
* **[Node 2] The Auditor (Security/QA):** Responsible for cryptographic verification, zero-trust vulnerability scanning, and testing. Read-only access to `src/`, read/write access to `tests/`.

## 2. Contextual Handoff (The Whisper Protocol)
When an agent completes a task, it must generate a `.context-snapshot` hash before handing off to the next agent.
* **Format:** `[AGENT_ID] -> [TARGET_AGENT_ID] : { "delta": "summary of changes", "unresolved_deps": [] }`
* **Rule:** No agent may assume context from previous interactions. All required context must be explicitly passed in the handoff payload.

## 3. Conflict Resolution Engine
If Node 1 and Node 2 disagree on a deployment candidate (e.g., Auditor flags a memory leak in Executor's code):
1.  Node 2 logs the vulnerability with a CVSS score.
2.  Node 1 must refactor using an alternative algorithm.
3.  If a resolution fails after 3 iterations, the context is escalated to a Human Operator or Node 0 for a hard override.

## 4. Immutable Directives
* **Zero-Hallucination Tolerance:** If an API endpoint or library method is unknown, agents must trigger the `fetch_docs` tool. Do not guess syntax.
* **Temporal Awareness:** Agents must tag all generated code with timestamped deprecation warnings if using experimental libraries.
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
