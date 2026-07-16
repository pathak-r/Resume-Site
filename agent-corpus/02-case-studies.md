# Project case studies

One section per site card. Same skeleton each time. First person, rough is fine.
The agent will use these for deep-dives and will deep-link to the matching card.

---

## Enterprise AI Copilot System AND AI Agents & Natural Language Querying (combined answer)

- Problem & context (who hurt, how badly, why now):

so gen ai was the in thing at the time and we knew that we want to leverage this before our competition does because if they do that would be a serious advantage to whoever does. so the aim was to not get left behind and this left behind could be serious. so i brainstormed and did research, customer interviews etc to figure out what is the most useful and impactful thing that we could build by integrating gen ai into the product. in a way that confirmed my hunch. it was basically natural language based data retrieval, object retrieval etc. its because the smart 3d database is very complex. it has in excess of 5000 tables and 10000 views and data is really intricate. users would spend a lot of time writing detailed sql queries to get specific data that they wanted. for example if a user wants pipe runs that of a given spec, a given pressure rating, temp rating , connected to X objects and carrying x fluid and connected to supports that meet a , b and c criteria and at a distance y from steel beams that are of a given cross section. this is an example of a simple level request. and on top of that , Instead of a single database, a typical Smart 3D environment is split across five distinct schemas/databases: Site, Site Schema, Catalog, Catalog Schema, and Project (Model). if this could be done by simply asking the simple in natural language it would literally change the game. and it was possible because of LLMs. there are models that are excellent at generating sql queries. the other thing we wanted to build was natural language driven 3d workflows. so instead of using the mouse to build the model you could talk to the model and it would build it for you. so you could say route a pipe spec 1c0031 from nozzle N1 to point P2 while taking a path that avoids cylinder N1 and it would do it. 

- My actual role (pitched it? built the prototype? led how many people?):

i decided what to build as described in the answer above, i pitched it to exec management, secured sponsorship, laid out the kind of questions customers would ask and the kind of queries customers would run. i also laid out the 3d modeling workflows that customers would typically run. basically outlined how the natural language agent would be used so we build it correctly. this was a side project where in addition to my two teams of 10 people each i was working with another third team of 4 people.  when it eventually became a product , part of the smart 3d platform the resources were merged into my teams to continue working on it.

- Key decisions & trade-offs (model choice, agent architecture, build-vs-buy, scope cuts):

the first pass was to include only piping 3d modeling workflows.  natural language queries to be limited in scope too. the natural language first pass was limited to filtering objects. for exaample give me piping gate valves that meet criteria x,y and z. not full fledged reporting like generate a material take off report or anything like that. the second pass was able to generate slightly more detailed outputs by including multi entity and relationships. 

- Outcome & evidence — where does "hundreds of hours monthly" come from? Be ready to
  defend the number:

i would actually say dozens of hours with the potential to save hundreds when the full fledged is built. reporting teams spend hours and sometimes days crafting SQL queries and complex reports to get data. this can now be done in a matter of minutes at most. 

- What went wrong / what I'd redo:

we spent some time looking and trying out stuff with models like defog where natural language is converted to sql. but since running raw sql on models is a no go beyond just read only queries it was clear that this was not a road to go down and we eventually used the platform api with the semantic kernel orchestrator. the api has role based access, permisssions etc built in that is basically guardrails. for the 3d modeling workflows we carefully selected api calls (plugins) that would prevent anything untoward. 

---

---

## Volve Field RAG Explorer (personal, live demo)

- Why I built it (what I wanted to learn/prove):

as a pm i worked with microsoft semantic kernel and was unable to get as hands on as i wanted to. also wanted to work with langchain and langraph myself . this was also an adjacent domain (upstream vs midstream) so i thought of exploring how can i put my skills to build something meaningful. a natural language agent that queries sub surface data was a meaningful challenge to accomplish.

- What I personally built vs. leaned on (be honest — used AI tools? which parts were hard?):

i personally built the whole thing using AI assisted coding (cursor). the hardest part was the data chunking. information in there wouldnt show up in the queries because it did not get chunked correctly. a table in a pdf that did not make it or an image that did not make it in right and so on. i iterated and worked with it quite a bit and it can still use improvement. cant say its perfect.

- Technical decisions worth discussing (chunking, FAISS, agent loop, eval):

used FAISS vs chroma db because it scales better so i am set if i want to scale it big. the model used was GPT 4o. GPT-4o is a strong all-rounder for tool-calling / agentic RAG — reliable structured tool use, solid reasoning over production + PDF context, and it fits the existing OpenAI stack (same vendor as embeddings).

- What it taught me that I use at work:

data structure and setting up data for a rag agent. how to do it well , how crucial it is. also helped me with model eval understanding.

---

## PropScan (personal, TestFlight)

- Why this problem:

its a real issue. people look at houses / apartments and there is no good way to report and log issues before signing papers. professional snagging is fine but there needs to be something the average person can use and get nearly 60-70% of the way there.

- Status & trajectory (commercial ambitions? users? or deliberate learning project?):

its currently in early testing where it can generate snagging reports of apartments , townhouses , villas etc. it needs to be tested thoroughly. 

- Hardest technical problem (vision-LLM accuracy? structured output? localization?):

definitely Vision-LLM accuracy . This product lives or dies on whether Gemini can tell a real handover defect from shadows, glare, texture, and normal new-build finish in phone photos. The ~300-line prompt in api/prompt.js is basically a false-positive doctrine (“miss one minor issue rather than report five fakes”), which is the signature of a trust-critical accuracy problem, not a plumbing one. 

Ive tried to solve it largely and squeezed most of the juice via prompt engineering. but it needs a labeled eval set from real UAE handover photos and by Gating input quality before the model runs. Reject/retake blurry, dark, or poorly framed shots. these two are big things that are yet to be done. 

- What went wrong / current limitations:

the current limitation is that the vision LLM output depends on the prompt engineering that i have done. it needs a labeled eval set from real UAE handover photos and by Gating input quality before the model runs. Reject/retake blurry, dark, or poorly framed shots. these two are big things that are yet to be done. 

---

## Cross-cutting

- "How hands-on are you technically?" — the honest calibrated answer (what you code,
  what you don't, how you use AI tools):

i have done application development in the past so yes i understand software architecture. so even though i use AI to build and write code , i understand and know what i am doing to quite a large extent. i use cursor as my main tool (IDE) in which i choose the model depending on what i want to do. 
