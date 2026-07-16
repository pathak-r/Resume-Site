# Agent corpus — source documents for rohit.agent

This folder holds the knowledge base the site chatbot answers from. Nothing here is code;
these are content documents that get ingested (chunked + embedded) when we build the RAG
pipeline.

## How to work through this

1. Start with `00-interview-questions.md` — read it once, top to bottom. It's the master
   list of what recruiters and hiring managers will actually ask the agent.
2. Answer questions inside the five numbered docs (01–05). Each doc contains its own
   subset of the questions as prompts, with space for answers. **Answer rough** — bullet
   points, half-sentences, voice-memo-transcript quality is fine. Claude will structure
   and polish everything afterward.
3. Don't repeat the resume. The resume is ingested separately; these docs exist for the
   things the resume can't say — context, stories, numbers, opinions, logistics.
4. `05-boundaries-policy.md` is the exception: it's instructions TO the agent, not
   content about you. Fill it carefully — it defines what the agent refuses or deflects.

## The five docs

| Doc | What it feeds |
|---|---|
| 01-career-narrative.md | "Walk me through your background", role-by-role depth |
| 02-case-studies.md | Project deep-dives for all four site cards |
| 03-faq-logistics.md | Notice period, comp, location, visa, availability |
| 04-philosophy-working-style.md | Behavioral questions, leadership style, self-assessment |
| 05-boundaries-policy.md | What the agent won't answer, and what it says instead |

## Voice reminder

The agent speaks in **first person** ("my notice period is..."). Write your answers in
first person too — it keeps the source material and the agent's voice aligned.
