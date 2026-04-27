import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import logo from '../assets/logo.png';

// UI text is centralized here so the whole app can switch between Tunisian Derja, English, and French.
const translations = {
  tn: {
    review: 'raja3 el code',
    paste: 'hot el code mteek hne',
    ready: 'wajeh bash nraja3ou el code',
    clear: 'na7i el review',
    project: 'ma3loumet el project',
    editor: 'code editor',
    aiReview: 'review mta3 el AI',
    loading: 'Codini tawa yraje3',
    codeCountSuffix: '7rouf',
    emptyTitle: 'el review mta3 el code bch yodhhor hne',
    emptyBody: 'hot el code mteek fou9 w a3mel raja3 el code bash tebda.',
    headerSubtitle: 'powered by Hugging Face',
    heroTitleTop: 'Codini',
    heroTitleBottom: 'review mta3 el code',
    heroDescription: 'hot el code fel editor w Codini bch y3tik review kamel.',
    feature1Title: 'nla9aw el ghaltat',
    feature1Description: 'nchoufou el mouchklet w el comportement el ghalet 9bal ma ykharjou.',
    feature2Title: 'nchoufou el security',
    feature2Description: 'nwarriw el patterns el 5aybin, el validation el na9sa, w el input el risk.',
    feature3Title: 'ta7sinat',
    feature3Description: 'na3tiw a9tira7at 3amliya باش el code ywalli أنظف w asra3 w a9ra.',
    projectModel: 'model mta3 AI',
    projectProvider: 'provider',
    projectBackend: 'backend',
    projectFrontend: 'frontend',
    sectionCorrectness: 'nla9aw el ghaltat',
    sectionSecurity: 'nchoufou el security',
    sectionPerformance: 'performance',
    sectionImprovements: 'ta7sinat',
    sectionSuggestedFix: 'el solution el m9tara7a',
    sectionSummary: 'kholasa',
    noDetails: 'ma famch tafasil 3la el jzou hedha.',
    languageLabel: 'UI language'
  },
  en: {
    review: 'Review Code',
    paste: 'Paste your code here',
    ready: 'Ready to review your code',
    clear: 'Clear Review',
    project: 'Project Info',
    editor: 'Code Editor',
    aiReview: 'AI Review',
    loading: 'Codini is reviewing',
    codeCountSuffix: 'characters',
    emptyTitle: 'Your AI review will appear here',
    emptyBody: 'Paste your code above and click Review Code to get started.',
    headerSubtitle: 'powered by Hugging Face',
    heroTitleTop: 'Codini',
    heroTitleBottom: 'review code',
    heroDescription: 'Paste code into the editor, send it to Codini, and get a structured review.',
    feature1Title: 'Find Bugs',
    feature1Description: 'Spot logic mistakes and broken behavior before they ship.',
    feature2Title: 'Security Check',
    feature2Description: 'Highlight unsafe patterns, validation gaps, and risky input handling.',
    feature3Title: 'Improvements',
    feature3Description: 'Get practical suggestions for cleaner, faster, and easier-to-read code.',
    projectModel: 'AI Model',
    projectProvider: 'Provider',
    projectBackend: 'Backend',
    projectFrontend: 'Frontend',
    sectionCorrectness: 'Bugs',
    sectionSecurity: 'Security',
    sectionPerformance: 'Performance',
    sectionImprovements: 'Improvements',
    sectionSuggestedFix: 'Suggested Fix',
    sectionSummary: 'Summary',
    noDetails: 'No details were provided for this section.',
    languageLabel: 'UI language'
  },
  fr: {
    review: 'Analyser le code',
    paste: 'Collez votre code ici',
    ready: 'Prêt à analyser votre code',
    clear: 'Effacer le résultat',
    project: 'Infos du projet',
    editor: 'Éditeur de code',
    aiReview: 'Analyse IA',
    loading: 'Codini analyse',
    codeCountSuffix: 'caractères',
    emptyTitle: 'Votre analyse IA apparaîtra ici',
    emptyBody: 'Collez votre code ci-dessus et cliquez sur Analyser le code pour commencer.',
    headerSubtitle: 'powered by Hugging Face',
    heroTitleTop: 'Codini',
    heroTitleBottom: 'analyse du code',
    heroDescription: 'Collez votre code dans l’éditeur, envoyez-le à Codini, puis obtenez une analyse structurée.',
    feature1Title: 'Trouver les bugs',
    feature1Description: 'Repérez les erreurs logiques et les comportements cassés avant la mise en production.',
    feature2Title: 'Contrôle sécurité',
    feature2Description: 'Mettez en avant les schémas dangereux, les validations manquantes et les entrées à risque.',
    feature3Title: 'Améliorations',
    feature3Description: 'Obtenez des suggestions concrètes pour un code plus propre, plus rapide et plus lisible.',
    projectModel: 'Modèle IA',
    projectProvider: 'Fournisseur',
    projectBackend: 'Backend',
    projectFrontend: 'Frontend',
    sectionCorrectness: 'Bugs',
    sectionSecurity: 'Sécurité',
    sectionPerformance: 'Performance',
    sectionImprovements: 'Améliorations',
    sectionSuggestedFix: 'Correctif suggéré',
    sectionSummary: 'Résumé',
    noDetails: 'Aucun détail pour cette section.',
    languageLabel: 'Langue UI'
  }
};

const features = [
  // These cards explain the three main promises of the app shown in the left panel.
  { titleKey: 'feature1Title', descriptionKey: 'feature1Description', tone: 'from-cyan-400/25 to-sky-500/25', icon: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M9 10a3 3 0 0 1 6 0v3.5a3 3 0 1 1-6 0V10Z" />
      <path d="M8 8 6.5 6.5M16 8l1.5-1.5M12 4V2M4 13h2M18 13h2M7 18l-1.5 1.5M17 18l1.5 1.5" />
    </svg>
  ) },
  { titleKey: 'feature2Title', descriptionKey: 'feature2Description', tone: 'from-emerald-400/25 to-cyan-500/25', icon: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 3 4 6v6c0 5 3.2 8.8 8 11 4.8-2.2 8-6 8-11V6l-8-3Z" />
      <path d="M12 9v4" />
      <path d="M12 16h.01" />
    </svg>
  ) },
  { titleKey: 'feature3Title', descriptionKey: 'feature3Description', tone: 'from-violet-400/25 to-fuchsia-500/25', icon: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 3v18" />
      <path d="M5 10l7-7 7 7" />
    </svg>
  ) }
];

const languageOptions = ['JavaScript', 'Python', 'HTML/CSS', 'Java', 'C++'];

const sectionDefinitions = [
  // These headings help the app recognize the structure returned by the AI.
  { title: 'Correctness', aliases: ['Correctness', 'Bugs', 'Bug', 'Review of Code'] },
  { title: 'Security', aliases: ['Security'] },
  { title: 'Performance', aliases: ['Performance'] },
  { title: 'Maintainability', aliases: ['Maintainability', 'Improvements'] },
  { title: 'Concrete Fixes', aliases: ['Concrete Fixes', 'Suggested Fix', 'Suggested Fixes'] },
  { title: 'Summary', aliases: ['Summary'] }
];

export default function App() {
  // Local state keeps the editor content, selected languages, and the current AI review.
  const [code, setCode] = useState('function add(a, b) {\n  return a + b;\n}');
  const [language, setLanguage] = useState('JavaScript');
  const [uiLang, setUiLang] = useState('tn');
  const [review, setReview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const parsedSections = parseSections(review);
  const t = translations[uiLang] || translations.en;

  // When the user clicks the button, the app sends the code and both language choices to the backend.
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
        body: JSON.stringify({ code, language, uiLang })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'ma njaamch nraja3ou el code tawa.');
      }

      setReview(data.review);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020617] px-4 py-6 text-slate-100 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-7xl">
        <section className="w-full min-w-0 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
          <div className="rounded-2xl border border-violet-500/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_26%)] p-4 sm:p-5 lg:p-6">
            {/* Header: brand, logo, model badge, and UI language selector. */}
            <header className="mb-4 flex flex-col gap-4 border-b border-white/8 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-sky-400/35 bg-sky-400/15 shadow-[0_0_32px_rgba(59,130,246,0.22)] sm:h-18 sm:w-18">
                  <img src={logo} alt="Codini logo" className="h-12 w-12 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">Codini</h1>
                    <span className="hidden h-1 w-1 rounded-full bg-slate-500 sm:inline-block" />
                    <p className="text-xs font-medium text-slate-400 sm:text-sm">{t.headerSubtitle}</p>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-fit sm:flex-row sm:items-center">
                <div className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-100 shadow-sm shadow-emerald-950/25 sm:w-fit">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.9)]" />
                  Qwen2.5-Coder-7B-Instruct
                </div>

                <select
                  value={uiLang}
                  onChange={(event) => setUiLang(event.target.value)}
                  aria-label={t.languageLabel}
                  className="w-full rounded-full border border-white/10 bg-slate-950/55 px-3 py-2 text-xs font-medium text-slate-200 outline-none transition duration-200 hover:border-white/20 focus:border-sky-400/50 sm:w-auto"
                >
                  <option value="tn">TN</option>
                  <option value="en">EN</option>
                  <option value="fr">FR</option>
                </select>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Left column: project story, app features, and project metadata. */}
              <aside className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-3xl font-semibold leading-[0.95] tracking-tight text-white sm:text-4xl lg:text-6xl">
                      <span>{t.heroTitleTop}</span>
                      <span className="block bg-gradient-to-r from-sky-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">{t.heroTitleBottom}</span>
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
                      {t.heroDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {features.map((feature) => (
                      <div key={feature.titleKey} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-slate-950/35 p-3 transition duration-200 hover:-translate-y-0.5 hover:border-white/12 hover:bg-white/6 hover:shadow-lg hover:shadow-black/20">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br ${feature.tone} text-white shadow-lg shadow-black/10`}>
                          {feature.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{t[feature.titleKey]}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-400">{t[feature.descriptionKey]}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* This small box tells the user what stack and model the app uses. */}
                  <div className="mt-1 rounded-2xl border border-sky-400/15 bg-slate-950/45 p-4 shadow-inner shadow-black/20 transition duration-200 hover:border-sky-400/25 hover:bg-slate-950/55 hover:shadow-lg hover:shadow-sky-950/20 lg:mt-auto">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{t.project}</h3>
                      <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.85)]" />
                    </div>

                    <div className="space-y-3">
                      {[
                        [t.projectModel, 'Qwen2.5-Coder-7B-Instruct'],
                        [t.projectProvider, 'Hugging Face'],
                        [t.projectBackend, 'Node.js + Express'],
                        [t.projectFrontend, 'React + Vite']
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

              {/* Right column: editor, submit button, and the rendered AI review. */}
              <div className="min-w-0 space-y-4">
                <section className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/6 hover:shadow-2xl hover:shadow-black/30">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{t.editor}</p>
                    </div>
                    <select
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      className="w-full rounded-full border border-white/10 bg-slate-950/55 px-3 py-2 text-xs font-medium text-slate-200 outline-none transition duration-200 hover:border-white/20 focus:border-sky-400/50 sm:w-auto sm:py-1"
                    >
                      {/* The code language helps the model understand syntax and context better. */}
                      {languageOptions.map((option) => (
                        <option key={option} value={option} className="bg-slate-950 text-slate-100">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="sr-only" htmlFor="code-input">{t.editor}</label>
                  <textarea
                    id="code-input"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder={t.paste}
                    spellCheck="false"
                    className="min-h-[18rem] w-full resize-none rounded-2xl border border-slate-700/70 bg-[#0a1020] p-4 font-mono text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500 transition duration-200 focus:border-sky-400/50 focus:ring-4 focus:ring-sky-500/10 sm:min-h-[22rem] lg:min-h-[26rem]"
                  />

                  {/* Small helper line showing the current state of the review request. */}
                  <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                      <span>{loading ? t.loading : t.ready}</span>
                    </div>
                    <span>{code.length} {t.codeCountSuffix}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleReview}
                    disabled={loading || !code.trim()}
                    className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(79,70,229,0.28)] transition duration-200 hover:scale-[1.01] hover:brightness-110 hover:shadow-[0_18px_44px_rgba(79,70,229,0.35)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? <Spinner /> : null}
                    {loading ? t.loading : t.review}
                  </button>
                </section>

                <section className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/6 hover:shadow-2xl hover:shadow-black/30">
                  {/* The output panel shows the AI review in a clean, scrollable card. */}
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-violet-200">
                        <SparkleIcon />
                      </span>
                      <h3 className="text-base font-semibold text-white">{t.aiReview}</h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setReview('');
                        setError('');
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10"
                    >
                        {t.clear}
                    </button>
                  </div>

                  <div className="max-h-[24rem] overflow-y-auto rounded-2xl border border-white/10 bg-[#080d1a] p-4 sm:max-h-[26rem]">
                    {error ? <p className="text-sm font-medium text-rose-300">{error}</p> : null}

                    {!error && !review ? (
                      <div className="flex min-h-[15rem] flex-col items-center justify-center text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-200 shadow-[0_0_30px_rgba(168,85,247,0.18)]">
                          <SparkleIcon className="h-7 w-7" />
                        </div>
                        <h4 className="mt-4 text-base font-semibold text-white">{t.emptyTitle}</h4>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{t.emptyBody}</p>
                      </div>
                    ) : null}

                    {!error && review ? (
                      <div className="space-y-3">
                        {parsedSections.map((section) => (
                          <ReviewSectionCard key={section.title} title={section.title} body={section.body} t={t} />
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

function SparkleIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
      <path d="M19 14l.9 2.4L22 17.3l-2.1.9L19 20.6l-.9-2.4-2.1-.9 2.1-.9L19 14Z" />
    </svg>
  );
}

// Each review section is rendered as its own card so the AI output stays easy to scan.
function ReviewSectionCard({ title, body, t }) {
  const sectionTitles = {
    Correctness: t.sectionCorrectness,
    Security: t.sectionSecurity,
    Performance: t.sectionPerformance,
    Maintainability: t.sectionImprovements,
    'Concrete Fixes': t.sectionSuggestedFix,
    Summary: t.sectionSummary
  };

  const displayTitle = sectionTitles[title] || title;

  return (
    <section className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/6 hover:shadow-[0_16px_36px_rgba(0,0,0,0.24)] animate-[fadeIn_240ms_ease-out]">
      <h3 className="text-base font-semibold tracking-tight text-white sm:text-lg">{displayTitle}</h3>

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
        <p className="mt-3 text-sm leading-7 text-slate-400">{t.noDetails}</p>
      )}
    </section>
  );
}
function parseSections(text) {
  const source = text.trim();

  if (!source) {
    return [];
  }

  // Split the markdown response into named sections based on headings.
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
    .filter((section) => section && section.body.trim())
    .map((section) => ({
      title: section.title,
      displayTitle: section.title,
      body: section.body
    }));

  if (ordered.length) {
    return ordered;
  }

  return [{ title: 'Summary', displayTitle: 'Summary', body: source }];
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
  // This keeps code blocks separate from normal text so Markdown renders cleanly.
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
  // A quick heuristic is enough to detect code-like paragraphs inside the AI response.
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

const editorPlaceholder = 'hot el code mteek hne';
