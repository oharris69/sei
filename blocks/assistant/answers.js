/*
 * What the SEI Assistant knows: canned answers matched by keyword, and the quick replies it
 * suggests for each persona and page. Demo content — no model or service behind it.
 * An answer is { text, links?: [[label, href]], book?: true }.
 */

const TOPICS = [
  {
    id: 'prepare',
    match: /prepar|bring|ready for (the|my) call|agenda/i,
    answer: () => ({
      text: 'For your consultation, have these to hand: recent financial statements and cash-flow reports, any valuation or appraisal, your org chart and key contracts, and a note of debts or major obligations. We’ll cover your goals, timeline and the partner fit.',
      links: [['See the full checklist', '/partner-match']],
    }),
  },
  {
    id: 'breakaway',
    match: /break ?away|independen|leav(e|ing)|transition|broker|\bbd\b|go(ing)? ria/i,
    answer: () => ({
      text: 'Most advisors who break away with SEI work through four steps: plan the transition, choose custody and technology, move client assets, then run the new firm. Summit Wealth moved $2.1 billion onto the SEI Wealth Platform this way.',
      links: [['Summit Wealth’s breakaway story', '/bd-breakaway'], ['SEI Pathfinder Program', '/pathfinder']],
    }),
  },
  {
    id: 'cost',
    match: /cost|fee|pric|econom|afford|payout|break-?even/i,
    answer: () => ({
      text: 'It depends on the size of your book and the services you take on. Your specialist can walk you through payout, overhead and break-even for a practice like yours.',
      book: true,
    }),
  },
  {
    id: 'custody',
    match: /custod|platform|tech|stack|operations|back.?office/i,
    answer: () => ({
      text: 'SEI brings custody, the SEI Wealth Platform and back-office operations together, so a new firm runs on one stack from day one.',
      links: [['How Summit Wealth made the move', '/bd-breakaway']],
    }),
  },
  {
    id: 'pathfinder',
    match: /pathfinder|merg|acqui|succession|sell|buyer|partner/i,
    answer: () => ({
      text: 'SEI Pathfinder matches you with an established RIA — Stratos, Beacon Pointe, Diversified, Summit or Merit — and supports you from preparing for the deal through to closing.',
      links: [['SEI Pathfinder Program', '/pathfinder'], ['See your partner match', '/partner-match']],
    }),
  },
  {
    id: 'administration',
    match: /admin|asset manager|outsourc|fund services|middle office/i,
    answer: () => ({
      text: 'For asset managers, SEI runs fund administration, middle-office and investor services on one platform, so your team can focus on investing.',
      links: [['SEI for asset managers', '/asset-managers']],
    }),
  },
  {
    id: 'etf',
    match: /etf|fund|portfolio|model|evaluat|invest|strateg/i,
    answer: () => ({
      text: 'SEI’s ETFs span enhanced factor, select and alternative strategies. The Portfolio Evaluator compares a client portfolio with SEI strategies in a few minutes.',
      links: [['Explore SEI ETFs', '/etfs'], ['Try the Portfolio Evaluator', '/portfolio-evaluator']],
    }),
  },
  {
    id: 'data',
    match: /\bdata\b|\bai\b|artificial|analytics/i,
    answer: () => ({
      text: 'SEI Data Cloud brings your firm’s data together so it is ready for analytics and AI. A specialist can show you how it would work with your data.',
      book: true,
    }),
  },
  {
    id: 'specialist',
    match: /who.*(specialist|advisor|contact)|my specialist|eric|clayton/i,
    answer: ({ specialist }) => ({
      text: `Your SEI specialist is ${specialist.name}. I can book a 30-minute call with them right here.`,
      book: true,
    }),
  },
  {
    id: 'book',
    match: /book|schedul|resched|call|meet|talk|speak|human|person|contact|appointment|demo/i,
    answer: () => ({ book: true }),
  },
  {
    id: 'hello',
    match: /^\s*(hi|hello|hey|good (morning|afternoon|evening))\b/i,
    answer: () => ({ text: 'Hello! Ask me about breaking away, costs, custody, SEI Pathfinder or SEI ETFs — or I can book a call with a specialist.' }),
  },
];

/** Persona mentioned in a message ("I'm an RIA"), if any. */
export function personaIn(message) {
  if (!/\b(i'?m|i am|we are|we're)\b/i.test(message)) return null;
  if (/asset manager/i.test(message)) return 'asset-manager';
  if (/\bria\b/i.test(message)) return 'ria';
  if (/advisor|adviser|broker/i.test(message)) return 'advisor';
  return null;
}

/**
 * Answers a message.
 * @param {string} message What the visitor typed
 * @param {object} context { specialist }
 * @returns {object} The answer
 */
export function answer(message, context) {
  const topic = TOPICS.find((t) => t.match.test(message));
  if (topic) return { id: topic.id, ...topic.answer(context) };
  return {
    id: 'fallback',
    text: `I don’t have a good answer for that yet. ${context.specialist.name} can take it — want me to book a call?`,
    book: true,
  };
}

const SUGGESTIONS = {
  advisor: ['How does a breakaway work?', 'What will it cost me?', 'Who is my specialist?'],
  ria: ['Which ETFs fit my clients?', 'How does the Portfolio Evaluator work?', 'Who is my specialist?'],
  'asset-manager': ['What does fund administration cover?', 'How does SEI handle data and AI?'],
};

const PAGE_SUGGESTIONS = {
  '/pathfinder': 'What is SEI Pathfinder?',
  '/pathfinder-specialist': 'Who is my specialist?',
  '/partner-match': 'How do I prepare for the call?',
};

/**
 * Quick replies for the visitor, most relevant first.
 * @param {object} profile The visitor profile
 * @param {string} path The current page path
 * @returns {string[]} Suggested questions
 */
export function suggestions(profile, path) {
  const list = [...(SUGGESTIONS[profile.persona] || [])];
  const page = PAGE_SUGGESTIONS[path];
  if (page && !list.includes(page)) list.unshift(page);
  if (profile.booking && !list.includes('How do I prepare for the call?')) list.unshift('How do I prepare for the call?');
  list.push(profile.booking ? 'Reschedule my call' : 'Book a call');
  return list.slice(0, 4);
}
