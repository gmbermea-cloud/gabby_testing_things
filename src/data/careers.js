/**
 * careers.js — Ground Up data layer
 *
 * PLACEHOLDER: Replace with your full data set.
 *
 * ─── SWIPE CARDS (30 total) ──────────────────────────────────────────────────
 * Each card has a prompt the user reacts to.
 * Dimensions map to trait axes used for scoring.
 *
 * dimensions:
 *   - creative    : creative ↔ analytical
 *   - social      : people-focused ↔ independent
 *   - structure   : structured ↔ fluid
 *   - impact      : tangible output ↔ systemic change
 *   - risk        : risk-tolerant ↔ risk-averse
 *   - leadership  : leading others ↔ deep individual contribution
 *
 * Swipe weights:
 *   Approve (right) : +1.0 × dimension weight
 *   Revise  (up)    : +0.4 × dimension weight
 *   Reject  (left)  : -0.3 × dimension weight
 *
 * ─── TRADEOFF PAIRS (10 total) ───────────────────────────────────────────────
 * Forced-choice between two options. No neutral.
 * Each option adds weight to a dimension.
 *
 * ─── PERSONALITY TYPES ───────────────────────────────────────────────────────
 * Derived from the highest-scoring dimension cluster after scoring.
 *
 * ─── CAREER ENTRIES ──────────────────────────────────────────────────────────
 * Each career has dimension affinities used to compute match %.
 */

// ── Swipe Cards ──────────────────────────────────────────────────────────────
export const swipeCards = [
  {
    id: 'sc_01',
    prompt: 'I love building things I can see and touch.',
    subtext: 'Physical output energizes you.',
    emoji: '🔨',
    dimensions: { impact: 1, structure: 0.5 },
  },
  {
    id: 'sc_02',
    prompt: 'I get a rush from persuading someone to change their mind.',
    subtext: 'You thrive on influence and conviction.',
    emoji: '🎤',
    dimensions: { social: 1, leadership: 0.5 },
  },
  {
    id: 'sc_03',
    prompt: 'I prefer a clear plan over winging it.',
    subtext: 'Predictability feels like safety to you.',
    emoji: '📋',
    dimensions: { structure: 1 },
  },
  {
    id: 'sc_04',
    prompt: 'I find numbers and data genuinely interesting.',
    subtext: 'Patterns and logic draw you in.',
    emoji: '📊',
    dimensions: { creative: -1, structure: 0.5 },
  },
  {
    id: 'sc_05',
    prompt: 'I would rather mentor someone than be the top performer myself.',
    subtext: 'Your wins come through others.',
    emoji: '🤝',
    dimensions: { social: 0.8, leadership: 1 },
  },
  {
    id: 'sc_06',
    prompt: 'Starting something from zero is more exciting than improving something existing.',
    subtext: "You're drawn to blank canvases.",

    emoji: '🚀',
    dimensions: { creative: 1, risk: 1 },
  },
  {
    id: 'sc_07',
    prompt: 'I do my best thinking alone.',
    subtext: 'Solitude sharpens your focus.',
    emoji: '🧘',
    dimensions: { social: -0.8 },
  },
  {
    id: 'sc_08',
    prompt: 'I care deeply about the environment I work in.',
    subtext: 'Atmosphere matters as much as the work.',
    emoji: '🏢',
    dimensions: { structure: 0.6, risk: -0.4 },
  },
  {
    id: 'sc_09',
    prompt: 'I want my work to outlast me.',
    subtext: 'Legacy and long-term impact motivate you.',
    emoji: '🌍',
    dimensions: { impact: 1, leadership: 0.4 },
  },
  {
    id: 'sc_10',
    prompt: 'I enjoy the chaos of a fast-moving team.',
    subtext: 'Speed and ambiguity feel like fuel.',
    emoji: '⚡',
    dimensions: { risk: 1, structure: -0.8 },
  },
  {
    id: 'sc_11',
    prompt: 'Making art or creative work feels like breathing.',
    subtext: 'Expression is a core need.',
    emoji: '🎨',
    dimensions: { creative: 1 },
  },
  {
    id: 'sc_12',
    prompt: 'I like knowing exactly what success looks like before I start.',
    subtext: 'Clear goals anchor you.',
    emoji: '🎯',
    dimensions: { structure: 1, risk: -0.4 },
  },
  {
    id: 'sc_13',
    prompt: "I naturally step up when there\'s no leader in the room.",

    subtext: 'You fill vacuums of direction.',
    emoji: '👑',
    dimensions: { leadership: 1, social: 0.5 },
  },
  {
    id: 'sc_14',
    prompt: 'I find service work — helping people with immediate needs — deeply fulfilling.',
    subtext: "Direct impact on people's lives matters.",

    emoji: '🫶',
    dimensions: { social: 1, impact: 0.8 },
  },
  {
    id: 'sc_15',
    prompt: "I\'d rather be the expert in the room than the manager of the room.",

    subtext: 'Depth over authority.',
    emoji: '🔬',
    dimensions: { leadership: -0.8, creative: 0.3 },
  },
  {
    id: 'sc_16',
    prompt: 'Risk and uncertainty make me want to dig in, not back off.',
    subtext: 'Danger zones are interesting to you.',
    emoji: '🎲',
    dimensions: { risk: 1 },
  },
  {
    id: 'sc_17',
    prompt: 'I love systems — figuring out how all the pieces fit together.',
    subtext: 'Big-picture architecture excites you.',
    emoji: '⚙️',
    dimensions: { structure: 0.8, creative: 0.4 },
  },
  {
    id: 'sc_18',
    prompt: 'Seeing someone else grow because of me is one of the best feelings.',
    subtext: 'You find meaning in unlocking others.',
    emoji: '🌱',
    dimensions: { social: 0.8, leadership: 0.8 },
  },
  {
    id: 'sc_19',
    prompt: 'I prefer making decisions with data over gut instinct.',
    subtext: 'Evidence grounds you.',
    emoji: '🧪',
    dimensions: { creative: -0.5, structure: 0.8 },
  },
  {
    id: 'sc_20',
    prompt: "I often imagine new products, services, or ideas that don\'t exist yet.",

    subtext: 'You see gaps and possibilities everywhere.',
    emoji: '💡',
    dimensions: { creative: 1, risk: 0.4 },
  },
  {
    id: 'sc_21',
    prompt: 'Writing feels like a superpower to me.',
    subtext: 'Words are your primary tool.',
    emoji: '✍️',
    dimensions: { creative: 0.6, social: 0.3 },
  },
  {
    id: 'sc_22',
    prompt: 'I want a job that lets me set my own hours and location.',
    subtext: 'Autonomy over schedule is non-negotiable.',
    emoji: '🌐',
    dimensions: { structure: -0.8, risk: 0.5 },
  },
  {
    id: 'sc_23',
    prompt: 'Conflict, when handled well, actually improves outcomes.',
    subtext: 'You lean into hard conversations.',
    emoji: '🥊',
    dimensions: { leadership: 0.6, social: 0.4 },
  },
  {
    id: 'sc_24',
    prompt: 'I want my income to reflect exactly how hard and well I work.',
    subtext: 'Performance-linked reward motivates you.',
    emoji: '💰',
    dimensions: { risk: 0.7, leadership: 0.3 },
  },
  {
    id: 'sc_25',
    prompt: 'I prefer working on one big project at a time over juggling many.',
    subtext: 'Depth over breadth in how you operate.',
    emoji: '🏔️',
    dimensions: { structure: 0.4, creative: 0.3 },
  },
  {
    id: 'sc_26',
    prompt: "I feel most alive when I\'m in front of an audience.",

    subtext: 'Presence and performance energize you.',
    emoji: '🎭',
    dimensions: { social: 1, creative: 0.5 },
  },
  {
    id: 'sc_27',
    prompt: 'I want to work on something that changes policy or society at scale.',
    subtext: 'Systemic change is your ambition.',
    emoji: '⚖️',
    dimensions: { impact: 1, leadership: 0.6 },
  },
  {
    id: 'sc_28',
    prompt: 'I find deep satisfaction in mastering a craft over years.',
    subtext: 'Long-term skill-building drives you.',
    emoji: '🎻',
    dimensions: { structure: 0.5, creative: 0.6 },
  },
  {
    id: 'sc_29',
    prompt: 'I would take a pay cut to work on something I deeply believe in.',
    subtext: 'Mission over money.',
    emoji: '🕊️',
    dimensions: { impact: 1, risk: 0.4 },
  },
  {
    id: 'sc_30',
    prompt: "When things break down, I\'m the one who stays calm and figures it out.",

    subtext: 'Crisis activates you.',
    emoji: '🛟',
    dimensions: { leadership: 0.8, risk: 0.6 },
  },
]

// ── Tradeoff Pairs ────────────────────────────────────────────────────────────
export const tradeoffPairs = [
  {
    id: 'tp_01',
    question: 'Which sounds more like you?',
    optionA: { label: 'Build the product', emoji: '🔧', dimensions: { impact: 1, creative: 0.5 } },
    optionB: { label: 'Build the team', emoji: '👥', dimensions: { leadership: 1, social: 0.5 } },
  },
  {
    id: 'tp_02',
    question: "You'd rather be known for…",

    optionA: { label: 'Creative breakthroughs', emoji: '💥', dimensions: { creative: 1, risk: 0.5 } },
    optionB: { label: 'Reliable execution', emoji: '✅', dimensions: { structure: 1, risk: -0.5 } },
  },
  {
    id: 'tp_03',
    question: 'Your ideal Monday looks like…',
    optionA: { label: 'Back-to-back people time', emoji: '💬', dimensions: { social: 1 } },
    optionB: { label: 'Long uninterrupted deep work', emoji: '🎧', dimensions: { social: -1 } },
  },
  {
    id: 'tp_04',
    question: 'Big win for you is…',
    optionA: { label: 'Changing how people think', emoji: '🧠', dimensions: { impact: 0.8, creative: 0.5 } },
    optionB: { label: 'Hitting a concrete milestone', emoji: '🏁', dimensions: { structure: 1, impact: 0.4 } },
  },
  {
    id: 'tp_05',
    question: "You'd rather bet on…",

    optionA: { label: 'A risky idea with huge upside', emoji: '🎰', dimensions: { risk: 1, creative: 0.4 } },
    optionB: { label: 'A proven path with steady growth', emoji: '📈', dimensions: { risk: -1, structure: 0.6 } },
  },
  {
    id: 'tp_06',
    question: 'You find more meaning in…',
    optionA: { label: 'One-on-one human connection', emoji: '🫂', dimensions: { social: 1 } },
    optionB: { label: 'Solving a hard abstract problem', emoji: '🧩', dimensions: { creative: 0.8, social: -0.3 } },
  },
  {
    id: 'tp_07',
    question: 'Your dream title is closer to…',
    optionA: { label: 'Founder / Director / CEO', emoji: '🏛️', dimensions: { leadership: 1, risk: 0.5 } },
    optionB: { label: 'Principal / Fellow / Lead Specialist', emoji: '🔭', dimensions: { leadership: -0.5, creative: 0.8 } },
  },
  {
    id: 'tp_08',
    question: "You'd rather spend a year…",

    optionA: { label: 'In the field, hands on', emoji: '⛏️', dimensions: { impact: 1, structure: -0.3 } },
    optionB: { label: 'Designing the strategy from above', emoji: '🗺️', dimensions: { leadership: 0.8, structure: 0.5 } },
  },
  {
    id: 'tp_09',
    question: 'Feedback from others feels…',
    optionA: { label: 'Energizing — I crave it', emoji: '🔋', dimensions: { social: 0.8, leadership: 0.3 } },
    optionB: { label: 'Fine, but I trust my own judgment', emoji: '🧭', dimensions: { social: -0.5, creative: 0.6 } },
  },
  {
    id: 'tp_10',
    question: 'Your work should primarily…',
    optionA: { label: 'Directly help individuals', emoji: '🫶', dimensions: { social: 1, impact: 0.8 } },
    optionB: { label: 'Shift systems and structures', emoji: '🌐', dimensions: { impact: 1, leadership: 0.5 } },
  },
]

// ── Personality Types ─────────────────────────────────────────────────────────
// Assigned based on the top two dimension scores after all scoring is complete.
export const personalityTypes = [
  {
    id: 'architect',
    label: 'The Architect',
    description: "You see the whole system before anyone else does. Structure and creativity aren\'t opposites to you — they\'re the same thing. You design solutions that actually scale.",

    primaryDimensions: ['structure', 'creative'],
  },
  {
    id: 'catalyst',
    label: 'The Catalyst',
    description: 'You ignite things. People, projects, movements — you show up and the energy shifts. Your superpower is making others believe something is possible.',
    primaryDimensions: ['social', 'leadership'],
  },
  {
    id: 'pioneer',
    label: 'The Pioneer',
    description: "You go first. Blank slates don\'t scare you — they call to you. You\'re built for founding, launching, and venturing into what hasn\'t been tried.",

    primaryDimensions: ['risk', 'creative'],
  },
  {
    id: 'builder',
    label: 'The Builder',
    description: "You make things real. Where others see ideas, you see the gap between idea and execution — and you close it. You\'re the reason things actually ship.",

    primaryDimensions: ['impact', 'structure'],
  },
  {
    id: 'navigator',
    label: 'The Navigator',
    description: "You chart the course. When the situation is complex and the stakes are high, you\'re the one who reads the landscape and sets direction others trust.",

    primaryDimensions: ['leadership', 'impact'],
  },
  {
    id: 'connector',
    label: 'The Connector',
    description: "You\'re the human infrastructure. You know how to read people, build trust, and weave networks that last. Your work happens between the lines.",

    primaryDimensions: ['social', 'impact'],
  },
  {
    id: 'craftsperson',
    label: 'The Craftsperson',
    description: "You go deep, not wide. Mastery is your currency. You spend years getting something exactly right — and the result is work that outlasts everyone else\'s.",

    primaryDimensions: ['creative', 'structure'],
  },
  {
    id: 'disruptor',
    label: 'The Disruptor',
    description: "You can\'t leave well enough alone — because you see how much better things could be. You challenge assumptions, break patterns, and make things uncomfortable in the best way.",

    primaryDimensions: ['risk', 'impact'],
  },
]

// ── Career Entries ─────────────────────────────────────────────────────────────
// PLACEHOLDER: Replace with your full 50+ career dataset.
// Each career needs dimension affinities (0–1 scale per dimension).
// Match % = cosine similarity between user score vector and career affinity vector.
export const careers = [
  {
    id: 'product_manager',
    title: 'Product Manager',
    description: 'You sit at the crossroads of user needs, business goals, and technical reality. Your job is to figure out what to build — and make sure it actually gets built.',
    skills: ['Strategic thinking', 'Stakeholder communication', 'Prioritization', 'Data analysis'],
    personalNote: 'If you love being in the middle of everything without doing any one thing, this is the role.',
    affinities: { creative: 0.6, social: 0.7, structure: 0.7, impact: 0.8, risk: 0.5, leadership: 0.7 },
  },
  {
    id: 'ux_designer',
    title: 'UX Designer',
    description: 'You translate human needs into experiences that feel inevitable. The best UX design is invisible — people just feel understood.',
    skills: ['Empathy mapping', 'Prototyping', 'User research', 'Visual communication'],
    personalNote: "You\'re probably already redesigning every app you use in your head.",

    affinities: { creative: 0.9, social: 0.6, structure: 0.5, impact: 0.6, risk: 0.4, leadership: 0.3 },
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur / Founder',
    description: "You build from nothing. You wear all the hats, absorb all the risk, and get to define exactly what you\'re building and why.",

    skills: ['Vision setting', 'Fundraising', 'Team building', 'Resilience'],
    personalNote: 'The chaos is the point. If that sentence excites you, keep reading.',
    affinities: { creative: 0.8, social: 0.6, structure: 0.3, impact: 0.9, risk: 1.0, leadership: 0.9 },
  },
  {
    id: 'data_scientist',
    title: 'Data Scientist',
    description: 'You find signal in noise. You turn raw data into insights that change decisions — quietly, powerfully, and often invisibly.',
    skills: ['Statistical modeling', 'Python/R', 'Machine learning', 'Data storytelling'],
    personalNote: 'You probably see patterns in things other people call chaos.',
    affinities: { creative: 0.5, social: 0.3, structure: 0.9, impact: 0.7, risk: 0.4, leadership: 0.2 },
  },
  {
    id: 'therapist',
    title: 'Therapist / Counselor',
    description: "You hold space for people\'s hardest moments. Your work is slow, deep, and profoundly human — and it changes lives one conversation at a time.",

    skills: ['Active listening', 'Emotional regulation', 'Clinical assessment', 'Therapeutic modalities'],
    personalNote: "You\'re already the person people call when things fall apart.",

    affinities: { creative: 0.3, social: 1.0, structure: 0.5, impact: 0.8, risk: 0.2, leadership: 0.3 },
  },
  {
    id: 'teacher',
    title: 'Teacher / Educator',
    description: "You multiply yourself by investing in others\' growth. Every student you reach is a ripple that goes further than you\'ll ever see.",

    skills: ['Curriculum design', 'Communication', 'Patience', 'Differentiated instruction'],
    personalNote: 'Your greatest work will be done by someone else, years from now.',
    affinities: { creative: 0.5, social: 0.9, structure: 0.7, impact: 0.9, risk: 0.2, leadership: 0.6 },
  },
  {
    id: 'software_engineer',
    title: 'Software Engineer',
    description: "You build the infrastructure of the modern world. Code is your medium, and the systems you create touch millions of people you\'ll never meet.",

    skills: ['Programming languages', 'System design', 'Debugging', 'Collaboration'],
    personalNote: 'You probably find bugs in things before they become problems.',
    affinities: { creative: 0.6, social: 0.3, structure: 0.8, impact: 0.7, risk: 0.4, leadership: 0.3 },
  },
  {
    id: 'policy_analyst',
    title: 'Policy Analyst',
    description: "You shape the rules that shape everything else. The changes you make on paper ripple through real people\'s lives — for decades.",

    skills: ['Research', 'Writing', 'Systems thinking', 'Political acumen'],
    personalNote: "You\'re drawn to fixing the game, not just playing it.",

    affinities: { creative: 0.4, social: 0.5, structure: 0.8, impact: 1.0, risk: 0.3, leadership: 0.5 },
  },
  {
    id: 'journalist',
    title: 'Journalist / Investigative Reporter',
    description: "You find the stories that need to be told and make sure they\'re heard. Accountability, truth, and public impact are your north stars.",

    skills: ['Investigative research', 'Storytelling', 'Source building', 'Writing under pressure'],
    personalNote: "You\'ve probably been told you ask too many questions. Good.",

    affinities: { creative: 0.7, social: 0.7, structure: 0.4, impact: 0.9, risk: 0.6, leadership: 0.3 },
  },
  {
    id: 'venture_capitalist',
    title: 'Venture Capitalist',
    description: "You bet on the future. Your job is to find the builders before anyone else does — and help them build something that didn\'t exist before.",

    skills: ['Pattern recognition', 'Founder assessment', 'Market analysis', 'Portfolio management'],
    personalNote: "You love the idea of ideas — and you\'ve got opinions about which ones will work.",

    affinities: { creative: 0.6, social: 0.7, structure: 0.4, impact: 0.8, risk: 0.9, leadership: 0.7 },
  },
]

// ── Scoring Algorithm Weights ─────────────────────────────────────────────────
// The relative importance of each dimension in the final match calculation.
// Adjust these to tune how strongly each axis drives career matching.
export const dimensionWeights = {
  creative:   1.0,
  social:     1.0,
  structure:  0.8,
  impact:     1.0,
  risk:       0.9,
  leadership: 0.9,
}
