import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const features = [
  {
    title: 'Find Bugs',
    description: 'Spot logic mistakes and broken behavior before they ship.',
    tone: 'from-cyan-400/25 to-sky-500/25',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M9 10a3 3 0 0 1 6 0v3.5a3 3 0 1 1-6 0V10Z" />
        <path d="M8 8 6.5 6.5M16 8l1.5-1.5M12 4V2M4 13h2M18 13h2M7 18l-1.5 1.5M17 18l1.5 1.5" />
      </svg>
    )
  },
  {
    title: 'Security Check',
    description: 'Highlight unsafe patterns, validation gaps, and risky input handling.',
    tone: 'from-emerald-400/25 to-cyan-500/25',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3 4 6v6c0 5 3.2 8.8 8 11 4.8-2.2 8-6 8-11V6l-8-3Z" />
        <path d="M12 9v4" />
        <path d="M12 16h.01" />
      </svg>
    )
  },
  {
    title: 'Improvements',
    description: 'Get practical suggestions for cleaner, faster, and easier-to-read code.',
    tone: 'from-violet-400/25 to-fuchsia-500/25',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3v18" />
        <path d="M5 10l7-7 7 7" />
      </svg>
    )
  }
];

const languageOptions = ['JavaScript', 'Python', 'HTML/CSS', 'Java', 'C++'];

const sectionDefinitions = [
  { title: 'Correctness', aliases: ['Correctness', 'Bugs', 'Bug', 'Review of Code'] },
  { title: 'Security', aliases: ['Security'] },
  { title: 'Performance', aliases: ['Performance'] },
  { title: 'Maintainability', aliases: ['Maintainability', 'Improvements'] },
  { title: 'Concrete Fixes', aliases: ['Concrete Fixes', 'Suggested Fix', 'Suggested Fixes'] },
  { title: 'Summary', aliases: ['Summary'] }
];

export default function App() {
  const [code, setCode] = useState('function add(a, b) {\n  return a + b;\n}');
  const [language, setLanguage] = useState('JavaScript');
  const [review, setReview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const parsedSections = parseSections(review);

  async function handleReview() {
    setLoading(true);
    setError('');
    setReview('');

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, language })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to review code.');
      }

      setReview(data.review);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-4 text-slate-100 sm:px-6 lg:px-8 lg:py-5">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1400px] items-start lg:items-center">
        <section className="w-full rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
          <div className="rounded-2xl border border-violet-500/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_26%)] p-4 sm:p-5 lg:p-6">
            <header className="mb-4 flex flex-col gap-4 border-b border-white/8 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/25 bg-sky-400/10 text-sky-200 shadow-[0_0_28px_rgba(59,130,246,0.18)]">
                  <CodeIcon />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">AI Code Reviewer</h1>
                    <span className="hidden h-1 w-1 rounded-full bg-slate-500 sm:inline-block" />
                    <p className="text-xs font-medium text-slate-400 sm:text-sm">Powered by Hugging Face</p>
                  </div>
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-100 shadow-sm shadow-emerald-950/25">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.9)]" />
                Qwen2.5-Coder-7B-Instruct
              </div>
            </header>

            <div className="grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
              <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
                <div className="flex h-full flex-col gap-4">
                  <div>
                    <h2 className="text-4xl font-semibold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
                      AI Code
                      <span className="block bg-gradient-to-r from-sky-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                        Reviewer
                      </span>
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
                      Paste code into the editor, send it to Hugging Face, and get a structured review with bugs, security notes, and improvement ideas.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {features.map((feature) => (
                      <div key={feature.title} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-slate-950/35 p-3 transition duration-200 hover:-translate-y-0.5 hover:border-white/12 hover:bg-white/6 hover:shadow-lg hover:shadow-black/20">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br ${feature.tone} text-white shadow-lg shadow-black/10`}>
                          {feature.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{feature.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-400">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto rounded-2xl border border-sky-400/15 bg-slate-950/45 p-4 shadow-inner shadow-black/20 transition duration-200 hover:border-sky-400/25 hover:bg-slate-950/55 hover:shadow-lg hover:shadow-sky-950/20">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Project Info</h3>
                      <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.85)]" />
                    </div>

                    <div className="space-y-3">
                      {[
                        ['AI Model', 'Qwen2.5-Coder-7B-Instruct'],
                        ['Provider', 'Hugging Face'],
                        ['Backend', 'Node.js + Express'],
                        ['Frontend', 'React + Vite']
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/5 px-3 py-2.5">
                          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{label}</span>
                          <span className="text-sm font-semibold text-slate-100">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="space-y-4">
                <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/6 hover:shadow-2xl hover:shadow-black/30">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Code Editor</p>
                    </div>
                    <select
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-xs font-medium text-slate-200 outline-none transition duration-200 hover:border-white/20 focus:border-sky-400/50"
                    >
                      {languageOptions.map((option) => (
                        <option key={option} value={option} className="bg-slate-950 text-slate-100">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="sr-only" htmlFor="code-input">Code to review</label>
                  <textarea
                    id="code-input"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder={editorPlaceholder}
                    spellCheck="false"
                    className="min-h-[26rem] w-full resize-none rounded-2xl border border-slate-700/70 bg-[#0a1020] p-4 font-mono text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500 transition duration-200 focus:border-sky-400/50 focus:ring-4 focus:ring-sky-500/10"
                  />

                  <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                      <span>{loading ? 'Review in progress...' : 'Ready to review your code'}</span>
                    </div>
                    <span>{code.length} characters</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleReview}
                    disabled={loading || !code.trim()}
                    className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(79,70,229,0.28)] transition duration-200 hover:scale-[1.01] hover:brightness-110 hover:shadow-[0_18px_44px_rgba(79,70,229,0.35)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? <Spinner /> : null}
                    {loading ? 'Reviewing...' : 'Review Code'}
                  </button>
                </section>

                <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/6 hover:shadow-2xl hover:shadow-black/30">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-violet-200">
                        <SparkleIcon />
                      </span>
                      <h3 className="text-base font-semibold text-white">AI Review</h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setReview('');
                        setError('');
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10"
                    >
                      Clear Review
                    </button>
                  </div>

                  <div className="max-h-[24rem] overflow-y-auto rounded-2xl border border-white/10 bg-[#080d1a] p-4">
                    {error ? <p className="text-sm font-medium text-rose-300">{error}</p> : null}

                    {!error && !review ? (
                      <div className="flex min-h-[15rem] flex-col items-center justify-center text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-200 shadow-[0_0_30px_rgba(168,85,247,0.18)]">
                          <SparkleIcon className="h-7 w-7" />
                        </div>
                        <h4 className="mt-4 text-base font-semibold text-white">Your AI review will appear here</h4>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                          Paste your code above and click Review Code to get started.
                        </p>
                      </div>
                    ) : null}

                    {!error && review ? (
                      <div className="space-y-3">
                        {parsedSections.map((section) => (
                          <ReviewSectionCard key={section.title} title={section.title} body={section.body} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />;
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="m8 9-3 3 3 3" />
      <path d="m16 9 3 3-3 3" />
      <path d="m14 7-4 10" />
    </svg>
  );
}

function SparkleIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
      <path d="M19 14l.9 2.4L22 17.3l-2.1.9L19 20.6l-.9-2.4-2.1-.9 2.1-.9L19 14Z" />
    </svg>
  );
}

function ReviewSectionCard({ title, body }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/6 hover:shadow-[0_16px_36px_rgba(0,0,0,0.24)] animate-[fadeIn_240ms_ease-out]">
      <h3 className="text-base font-semibold tracking-tight text-white sm:text-lg">{title}</h3>

      {body.trim() ? (
        <div className="mt-3 space-y-3 text-sm leading-7 text-slate-300">
          {renderSectionContent(body).map((block, index) =>
            block.type === 'code' ? (
              <pre
                key={`${title}-code-${index}`}
                className="overflow-x-auto rounded-2xl border border-slate-700/70 bg-[#050816] p-4 font-mono text-xs leading-6 text-slate-200 shadow-inner shadow-black/30"
              >
                <code>{block.content}</code>
              </pre>
            ) : (
              <ReactMarkdown
                key={`${title}-text-${index}`}
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="text-slate-300">{children}</p>,
                  ul: ({ children }) => <ul className="space-y-2 pl-0 text-slate-300">{children}</ul>,
                  ol: ({ children }) => <ol className="space-y-2 pl-5 text-slate-300">{children}</ol>,
                  li: ({ children }) => (
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
                      <span>{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                  code: ({ children }) => (
                    <code className="rounded-lg border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[0.85em] text-sky-200">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-violet-400/50 pl-4 text-slate-300">{children}</blockquote>
                  )
                }}
              >
                {block.content}
              </ReactMarkdown>
            )
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-7 text-slate-400">No details were provided for this section.</p>
      )}
    </section>
  );
}


function parseSections(text) {
  const source = text.trim();

  if (!source) {
    return [];
  }

  const rawSections = [];
  let current = null;

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    const matchedTitle = matchSectionTitle(trimmed);

    if (matchedTitle) {
      if (current) {
        rawSections.push(current);
      }

      current = { title: matchedTitle, lines: [] };
      continue;
    }

    if (!current) {
      current = { title: 'Summary', lines: [] };
    }

    current.lines.push(line);
  }

  if (current) {
    rawSections.push(current);
  }

  const sectionsByTitle = new Map(sectionDefinitions.map((section) => [section.title, { title: section.title, body: '' }]));

  for (const section of rawSections) {
    const existing = sectionsByTitle.get(section.title);
    if (existing) {
      existing.body = [existing.body, section.lines.join('\n').trim()].filter(Boolean).join('\n\n').trim();
    }
  }

  const ordered = sectionDefinitions
    .map((section) => sectionsByTitle.get(section.title))
    .filter((section) => section && section.body.trim());

  if (ordered.length) {
    return ordered;
  }

  return [{ title: 'Summary', body: source }];
}

function matchSectionTitle(line) {
  const normalized = line.replace(/^#{1,6}\s*/, '').replace(/[:\-]\s*$/, '').trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  for (const section of sectionDefinitions) {
    if (section.aliases.some((alias) => alias.toLowerCase() === normalized)) {
      return section.title;
    }
  }

  return null;
}

function renderSectionContent(body) {
  const blocks = [];
  const lines = body.split(/\r?\n/);
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const fenceLines = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        fenceLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      blocks.push({ type: 'code', content: fenceLines.join('\n').trim() });
      continue;
    }

    const paragraphLines = [line];
    index += 1;

    while (index < lines.length) {
      const nextLine = lines[index];
      const nextTrimmed = nextLine.trim();

      if (!nextTrimmed) {
        break;
      }

      if (nextTrimmed.startsWith('```')) {
        break;
      }

      paragraphLines.push(nextLine);
      index += 1;
    }

    const paragraph = paragraphLines.join('\n').trim();

    if (looksLikeCode(paragraph)) {
      blocks.push({ type: 'code', content: paragraph });
    } else {
      blocks.push({ type: 'text', content: paragraph });
    }
  }

  return blocks;
}

function looksLikeCode(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  if (!lines.length) {
    return false;
  }

  const codeLikePatterns = [
    /^function\b/,
    /^class\b/,
    /^(const|let|var)\b/,
    /^export\b/,
    /^import\b/,
    /^async\s+function\b/,
    /=>/,
    /\breturn\b/,
    /\b(if|for|while|switch|try|catch)\b/,
    /[{}();]$/,
    /=\s*[^=]/
  ];

  const score = lines.reduce((count, line) => count + Number(codeLikePatterns.some((pattern) => pattern.test(line))), 0);

  return score >= Math.max(1, Math.ceil(lines.length / 2));
}

const editorPlaceholder = `function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}`;
