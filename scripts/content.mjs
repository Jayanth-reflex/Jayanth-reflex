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
