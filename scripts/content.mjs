// Hand-written copy for the cards. Numbers come from the resume; keep them in sync with it.

export const header = {
  prompt: 'Who is Jayanth?',
  // How a BPE tokenizer might split the name, with the probability the model gave each piece.
  tokens: [
    { text: 'Jay', p: 0.71 },
    { text: 'anth', p: 0.98 },
    { text: ' Red', p: 0.64 },
    { text: 'dy', p: 0.99 },
  ],
  lead: 'Generative AI engineer',
  tagline: 'who ships LLM systems to production: retrieval, fine-tuning, evals, guardrails, and the services around them.',
  facts: ['4 years in production', 'Hyderabad, India'],
  status: 'open to senior / staff roles',
};

export const impact = [
  { label: 'Hallucinations in agent workflows', context: 'LangGraph · prompt templates · systematic evals', delta: 0.6 },
  { label: 'Third-party model spend', context: 'fine-tuned and deployed a domain small language model', delta: 0.8 },
  { label: 'Time to complete an application', context: 'RAG platform on AWS Bedrock serving millions of users', delta: 0.6 },
  { label: 'Manual candidate screening', context: 'hackathon-winning hiring agent over 1M+ records', delta: 0.9 },
  { label: 'API security incidents', context: 'Azure API Management with OAuth2 and JWT', delta: 0.6 },
  { label: 'Database response time', context: 'MySQL schema tuning with JPA and Hibernate', delta: 0.35 },
];

export const impactFootnote = ['50,000+ concurrent users', 'dashboards over 25+ APIs', '90%+ test coverage', '35+ engineers trained'];

// Ordered the way a request travels: from the interface down to the platform it runs on.
export const stack = [
  { label: 'interface', items: ['React', 'Next.js', 'TypeScript', 'dashboards', 'data viz'], core: ['React', 'Next.js'] },
  { label: 'agents', items: ['LangGraph', 'tool calling', 'MCP', 'human-in-the-loop', 'LLM-as-judge'], core: ['LangGraph', 'LLM-as-judge'] },
  { label: 'retrieval', items: ['RAG', 'embeddings', 'vector search', 'semantic search', 'prompt engineering'], core: ['RAG', 'vector search'] },
  { label: 'models', items: ['PyTorch', 'Transformers', 'PEFT / LoRA', 'quantization', 'vLLM', 'Weights & Biases'], core: ['PyTorch', 'PEFT / LoRA', 'vLLM'] },
  { label: 'safety', items: ['guardrails', 'Llama Guard', 'Responsible AI', 'RBAC', 'OAuth2 / JWT', 'CSP · HSTS'], core: ['guardrails', 'Llama Guard'] },
  { label: 'services', items: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'Kafka', 'REST · SOAP', 'microservices'], core: ['Python', 'FastAPI', 'Java', 'Spring Boot'] },
  { label: 'data', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'Redis', 'ETL pipelines'], core: ['PostgreSQL', 'MongoDB'] },
  { label: 'platform', items: ['AWS Bedrock', 'Azure', 'Docker', 'Kubernetes', 'GitHub Actions', 'Jenkins', 'Splunk', 'New Relic'], core: ['AWS Bedrock', 'Kubernetes', 'Docker'] },
];

// Project cards: what kind of work it is, the one number that sells it, and a three-line hook.
export const projects = [
  {
    repo: 'amd-hackathon-2026',
    kind: 'LLM fine-tune',
    stat: { value: '48h', label: 'solo, one MI300X' },
    hook: 'Fine-tuned Qwen3.6-35B-A3B end to end on one AMD GPU: LoRA, merge and abliteration, shipped as a 9-quant GGUF ladder on Hugging Face. Safety runs at the app layer with Llama Guard 3.',
    chips: ['PyTorch', 'LoRA', 'ROCm', 'vLLM', 'W&B'],
  },
  {
    repo: 'lastbite-swiggy-mcp',
    kind: 'Agent · MCP',
    stat: { value: '3', label: 'confirmation gates' },
    hook: 'Order food from Swiggy in plain English. The agent builds the cart over Swiggy\'s MCP server, then three confirmation gates and a 30-second grace timer stand between it and your order.',
    chips: ['TypeScript', 'Next.js', 'LangGraph', 'MCP', 'Redis'],
  },
  {
    repo: 'domain-flipper-agent',
    kind: 'Multi-agent',
    stat: { value: '1:1', label: 'MCP server per service' },
    hook: 'LangGraph agents read trends from the open web, generate and value domain names, check trademarks and availability, then stop and wait for a human to approve before acting.',
    chips: ['Python', 'LangGraph', 'Claude API', 'FastMCP', 'Postgres'],
  },
  {
    repo: 'file-password-remover',
    kind: 'Local-first tool',
    stat: { value: '0', label: 'bytes uploaded' },
    hook: 'Strips passwords from PDF, Office, ZIP and 7-Zip files you own, entirely offline, and re-opens every output to verify it before writing. Building it surfaced the py7zr hang I fixed upstream.',
    chips: ['Python', 'pikepdf', 'msoffcrypto', 'py7zr'],
  },
  {
    repo: 'global-health-radar',
    kind: 'Microservices',
    stat: { value: '$0', label: 'hosting bill' },
    hook: 'A worldwide disease tracker: Spring Boot services behind a JWT gateway, with a transactional outbox, PostGIS and two levels of caching, all running on free hosting.',
    chips: ['Java 25', 'Spring Boot 4', 'Next.js 16', 'PostGIS', 'Redis'],
  },
  {
    repo: 'reflex-whoop',
    kind: 'iOS',
    stat: { value: 'BLE', label: 'live heart rate' },
    hook: 'Keeps WHOOP data on your phone: syncs the WHOOP API and reads live heart rate straight from the band over read-only Bluetooth, into an archive that outlives the subscription.',
    chips: ['Swift', 'SwiftUI', 'Core Bluetooth', 'GRDB'],
  },
];
