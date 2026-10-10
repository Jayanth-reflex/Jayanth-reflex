<a href="https://jayanth-sde.vercel.app"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/header-dark.svg"><img alt="Jayanth Reddy. Generative AI engineer who ships LLM systems to production: retrieval, fine-tuning, evals, guardrails, and the services around them. 4 years in production, based in Hyderabad, open to senior and staff roles." src="assets/header-light.svg" width="100%"></picture></a>

<p align="center">
  <a href="https://jayanth-sde.vercel.app"><b>Portfolio</b></a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://linkedin.com/in/jayanth-sde"><b>LinkedIn</b></a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://huggingface.co/Reflex-jr"><b>Hugging Face</b></a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="mailto:jayanth.sde.fsd@gmail.com"><b>jayanth.sde.fsd@gmail.com</b></a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://github.com/sponsors/Jayanth-reflex"><b>Sponsor ♥</b></a>
</p>

### About me

I'm a senior software engineer with four years of building generative AI systems and the backend services underneath them. I've shipped a retrieval-augmented generation (RAG) platform on AWS Bedrock that serves millions of users, fine-tuned a domain model that cut third-party model spend by 80%, and built Java microservices for 50,000+ concurrent users.

**Right now** I'm designing governance workflows that observe and evaluate AI agents at scale, including an LLM-as-judge proof of concept that evaluates 10+ agentic workflows.

**Outside work** I fine-tune open models, most recently a Qwen3.6-35B-A3B fine-tune on a single AMD MI300X that is [published on Hugging Face](https://huggingface.co/Reflex-jr), and I send fixes upstream to the open source tools I use.

### Impact

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/impact-dark.svg">
  <img alt="Measured impact from past roles. Hallucinations in agent workflows down 60%. Third-party model spend down 80%. Time to complete an application down 60%. Manual candidate screening down 90%. API security incidents down 60%. Database response time down 35%. At scale: 50,000+ concurrent users, dashboards over 25+ APIs, 90%+ test coverage, 35+ engineers trained." src="assets/impact-light.svg" width="100%">
</picture>

### Top 4 open source contributions

My four best recent fixes sent upstream, most of them found while building my own projects.

<!-- oss:start -->
<p>
<a href="https://github.com/deepset-ai/haystack/pull/12988"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/oss/deepset-ai-haystack-12988-dark.svg"><img alt="Merged: fix: keep hyperlink addresses in DOCXToDocument table cells (deepset-ai/haystack, 26.7k stars)" src="assets/oss/deepset-ai-haystack-12988-light.svg" width="400"></picture></a>
<a href="https://github.com/NandhaKishorM/laya/pull/624"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/oss/nandhakishorm-laya-624-dark.svg"><img alt="Merged: fix(serve): set TCP_NODELAY on every accepted connection (NandhaKishorM/laya, 32k stars)" src="assets/oss/nandhakishorm-laya-624-light.svg" width="400"></picture></a>
<a href="https://github.com/anomalyco/opencode/pull/54139"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/oss/anomalyco-opencode-54139-dark.svg"><img alt="In review: fix(core): skip tool-less models in default model fallback (anomalyco/opencode, 212.4k stars)" src="assets/oss/anomalyco-opencode-54139-light.svg" width="400"></picture></a>
<a href="https://github.com/BerriAI/litellm/pull/45581"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/oss/berriai-litellm-45581-dark.svg"><img alt="In review: fix(alerting): send one budget alert when concurrent checks hit the same budget event (BerriAI/litellm, 60.8k stars)" src="assets/oss/berriai-litellm-45581-light.svg" width="400"></picture></a>
</p>
<sub>Top 4 of my most recent upstream pull requests · 2 merged, 2 in review · cards refresh daily from the GitHub API</sub>
<!-- oss:end -->

### Experience

**Senior Software Engineer** · AI governance and agent evaluation · <sub>Jul 2026 – present</sub>
- Designing governance workflows for the observability and evaluation of AI agents at scale
- Built an LLM-as-judge proof of concept that evaluates 10+ agentic workflows
- Trained 20+ developers on AWS and Azure AI services

**Senior Developer** · production generative AI platform · <sub>Sep 2025 – Jun 2026</sub>
- Built a RAG platform on AWS Bedrock with semantic and vector search and Responsible AI guardrails, serving millions of users and cutting application completion time by 60%
- Cut hallucinations by 60% across LangGraph agent workflows through prompt templates and systematic prompt and model evaluation
- Fine-tuned, evaluated and deployed a domain small language model with PyTorch, Hugging Face Transformers and Weights & Biases on Docker and Kubernetes, cutting third-party model costs by 80%
- Unified modern identity management and legacy JWT users under one role-based access model, enforced CSP and HSTS, and moved hardcoded secrets into AWS Systems Manager
- Mentored 3 developers and trained 15+ engineers on RAG and agentic workflows

**Software Engineer** · enterprise backend and integrations · <sub>Feb 2022 – Mar 2025, including a trainee period</sub>
- Built a RAG chatbot that grounds answers in enterprise content, and an integration layer across 10+ systems using REST, SOAP and Apache Kafka pipelines
- Designed 4 Spring Boot microservices serving 50,000+ concurrent users on Docker and Kubernetes
- Secured APIs with Azure API Management, OAuth2 and JWT, cutting security incidents by 60%; built React and TypeScript dashboards over 25+ APIs
- Tuned MySQL schemas with JPA and Hibernate for 35% faster responses, with JUnit5 suites at 90%+ coverage

**Recognition** · Won a Vista-backed hackathon with an agentic hiring system that shortlists, interviews and recommends candidates across 1M+ applicant records, cutting manual screening by 90% · Rising Star award for AI integration delivery · Google Generative AI, AWS and Microsoft Azure certified · B.Tech, JNTUH (MRCET), 2022

### Projects

Things I built end to end. Each card links to its repo; [lastbite has a live demo](https://swiggy-mcp.vercel.app).

<!-- projects:start -->
<p>
<a href="https://github.com/Jayanth-reflex/amd-hackathon-2026"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/projects/amd-hackathon-2026-dark.svg"><img alt="amd-hackathon-2026: LLM fine-tune. Fine-tuned Qwen3.6-35B-A3B end to end on one AMD GPU: LoRA, merge and abliteration, shipped as a 9-quant GGUF ladder on Hugging Face. Safety runs at the app layer with Llama Guard 3." src="assets/projects/amd-hackathon-2026-light.svg" width="400"></picture></a>
<a href="https://github.com/Jayanth-reflex/lastbite-swiggy-mcp"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/projects/lastbite-swiggy-mcp-dark.svg"><img alt="lastbite-swiggy-mcp: Agent · MCP. Order food from Swiggy in plain English. The agent builds the cart over Swiggy's MCP server, then three confirmation gates and a 30-second grace timer stand between it and your order." src="assets/projects/lastbite-swiggy-mcp-light.svg" width="400"></picture></a>
<a href="https://github.com/Jayanth-reflex/domain-flipper-agent"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/projects/domain-flipper-agent-dark.svg"><img alt="domain-flipper-agent: Multi-agent. LangGraph agents read trends from the open web, generate and value domain names, check trademarks and availability, then stop and wait for a human to approve before acting." src="assets/projects/domain-flipper-agent-light.svg" width="400"></picture></a>
<a href="https://github.com/Jayanth-reflex/file-password-remover"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/projects/file-password-remover-dark.svg"><img alt="file-password-remover: Local-first tool. Strips passwords from PDF, Office, ZIP and 7-Zip files you own, entirely offline, and re-opens every output to verify it before writing. Building it surfaced the py7zr hang I fixed upstream." src="assets/projects/file-password-remover-light.svg" width="400"></picture></a>
<a href="https://github.com/Jayanth-reflex/global-health-radar"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/projects/global-health-radar-dark.svg"><img alt="global-health-radar: Microservices. A worldwide disease tracker: Spring Boot services behind a JWT gateway, with a transactional outbox, PostGIS and two levels of caching, all running on free hosting." src="assets/projects/global-health-radar-light.svg" width="400"></picture></a>
<a href="https://github.com/Jayanth-reflex/reflex-whoop"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/projects/reflex-whoop-dark.svg"><img alt="reflex-whoop: iOS. Keeps WHOOP data on your phone: syncs the WHOOP API and reads live heart rate straight from the band over read-only Bluetooth, into an archive that outlives the subscription." src="assets/projects/reflex-whoop-light.svg" width="400"></picture></a>
</p>
<!-- projects:end -->

### Tech stack

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/stack-dark.svg">
  <img alt="Tech stack, ordered by where a request goes. Interface: React, Next.js, TypeScript. Agents: LangGraph, tool calling, MCP, human-in-the-loop, LLM-as-judge. Retrieval: RAG, embeddings, vector and semantic search, prompt engineering. Models: PyTorch, Transformers, PEFT and LoRA, quantization, vLLM, Weights and Biases. Safety: guardrails, Llama Guard, Responsible AI, RBAC, OAuth2 and JWT, CSP and HSTS. Services: Python, FastAPI, Java, Spring Boot, Kafka, REST and SOAP, microservices. Data: PostgreSQL, MySQL, MongoDB, Supabase, Redis, ETL pipelines. Platform: AWS Bedrock, Azure, Docker, Kubernetes, GitHub Actions, Jenkins, Splunk, New Relic." src="assets/stack-light.svg" width="100%">
</picture>

### GitHub activity

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/activity-dark.svg">
  <img alt="GitHub contributions over the last 12 months, excluding automated commits, with commit, pull request, issue and upstream repository totals and a language breakdown." src="assets/activity-light.svg" width="100%">
</picture>

### Let's talk

I'm open to senior and staff individual-contributor roles in LLM engineering, AI platforms and backend infrastructure. I'm based in Hyderabad and open to remote work or relocation, and I reply to every message within 24 hours.

**[jayanth.sde.fsd@gmail.com](mailto:jayanth.sde.fsd@gmail.com)** · **[LinkedIn](https://linkedin.com/in/jayanth-sde)** · **[Portfolio](https://jayanth-sde.vercel.app)**
