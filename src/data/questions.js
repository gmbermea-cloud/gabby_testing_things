/**
 * questions.js — ArchPath question bank
 *
 * 30 questions total:
 *   15 multiple_choice — 3 points to selected track
 *   8  slider          — 3 points split by position (0-100)
 *   7  ranking         — 4/3/2/1 points by rank order
 *
 * Tracks: Design | Technical | Management | Business
 */

export const TRACKS = {
  DESIGN:     'Design',
  TECHNICAL:  'Technical',
  MANAGEMENT: 'Management',
  BUSINESS:   'Business',
}

export const TRACK_META = {
  Design: {
    color: '#C85A3F',
    bg: '#FDF1EE',
    label: 'Design',
    tagline: 'You lead with vision.',
    description:
      'You thrive on creative problem-solving and visual thinking. You see architecture as a medium for making ideas tangible—and you\'re energized by the moments when concept becomes reality. Whether you\'re developing the initial vision, crafting the perfect rendering, or defending design intent in the field, you lead with aesthetic judgment and spatial innovation.',
    skills: [
      'Concept development',
      'Visual composition & 3D visualization',
      'Design thinking',
      'Spatial planning',
      'Rendering & presentation graphics',
      'Aesthetic judgment',
      'Design intent documentation',
    ],
    roles: ['Design Architect', 'Visualization Specialist', 'Design Director', 'Concept Designer'],
  },
  Technical: {
    color: '#5B8FA3',
    bg: '#EEF4F7',
    label: 'Technical',
    tagline: 'You make buildings stand up.',
    description:
      'You\'re the architect who makes buildings stand up. You get satisfaction from precision, from solving the hard problems buried in the details. Your strength is in translating vision into buildable reality—whether you\'re writing watertight specs, responding to RFIs, coordinating submittals, or solving problems on site during CA.',
    skills: [
      'Technical documentation & detailing',
      'Specification writing (CSI format)',
      'Code compliance & building science',
      'Construction administration (CA)',
      'Shop drawing & submittal review',
      'Consultant coordination',
      'Constructability & problem-solving',
      'RFI management',
    ],
    roles: ['Project Architect', 'Technical Director', 'Specifications Writer', 'CA Lead', 'Building Envelope Specialist'],
  },
  Management: {
    color: '#7A9B76',
    bg: '#F0F5EF',
    label: 'Management',
    tagline: 'You keep it all moving.',
    description:
      'You\'re a natural orchestrator. You see the project as a system of people, deadlines, and deliverables—and you know how to keep it all moving. You\'re energized by leading teams, coaching junior staff, triaging problems, and creating the conditions for great work to happen. You\'re the one people come to when they\'re stuck.',
    skills: [
      'Team leadership & coordination',
      'Project scheduling & resource allocation',
      'Mentorship & staff development',
      'Process management & workflow',
      'Deadline management & triage',
      'Cross-functional communication',
      'Conflict resolution',
    ],
    roles: ['Project Manager', 'Studio Director', 'Associate (Management track)', 'Operations Director'],
  },
  Business: {
    color: '#D4A574',
    bg: '#FBF5EE',
    label: 'Business',
    tagline: 'You know how to win work.',
    description:
      'You understand that architecture is a relationship business. You\'re drawn to the strategic side—client development, firm positioning, contract negotiation, fee management. You see projects through the lens of financial sustainability and you\'re comfortable in the room where deals get made. You know how to win work and keep clients coming back.',
    skills: [
      'Client relationship building',
      'Business development & pursuits',
      'Strategic thinking & positioning',
      'Contract negotiation & scope management',
      'Proposal writing & presentations',
      'Market research & trend analysis',
      'Fee structuring & profitability',
    ],
    roles: ['Principal (BD-focused)', 'Director of Business Development', 'Client Relations Manager', 'Firm Principal/Partner'],
  },
}

// 30 questions in mixed order for a natural flow
export const questions = [
  // ── Q1 ──────────────────────────────────────────────────────────────────────
  {
    id: 'Q1',
    type: 'multiple_choice',
    label: 'The Chaotic Meeting',
    text: 'You walk into a project meeting mid-crisis. The client is upset, the contractor is pointing at the drawings, and your PM looks overwhelmed. What\'s your first instinct?',
    options: [
      { letter: 'A', text: 'Start sketching on the whiteboard to visualize what everyone\'s describing', track: 'Design' },
      { letter: 'B', text: 'Ask to see the specific detail in the construction documents—where\'s the disconnect?', track: 'Technical' },
      { letter: 'C', text: 'Pull up the project schedule and figure out who needs what by when', track: 'Management' },
      { letter: 'D', text: 'Step back and assess whether this affects the budget or client relationship first', track: 'Business' },
    ],
  },

  // ── S1 ──────────────────────────────────────────────────────────────────────
  {
    id: 'S1',
    type: 'slider',
    text: 'When reviewing a set of drawings, I focus more on...',
    leftLabel: 'Visual impact, composition, and design intent',
    leftTrack: 'Design',
    rightLabel: 'Technical accuracy, coordination, and buildability',
    rightTrack: 'Technical',
  },

  // ── Q2 ──────────────────────────────────────────────────────────────────────
  {
    id: 'Q2',
    type: 'multiple_choice',
    label: 'The Client Pivot',
    text: 'Three weeks before CDs are due, your client sees a competitor\'s project and wants to completely rethink the facade. You have budget and schedule, but barely. You:',
    options: [
      { letter: 'A', text: 'Get excited—this constraint might actually push the design somewhere better', track: 'Design' },
      { letter: 'B', text: 'Immediately calculate what this does to structural loads, envelope performance, and specs', track: 'Technical' },
      { letter: 'C', text: 'Call a team huddle to reorganize who\'s doing what and reset expectations', track: 'Management' },
      { letter: 'D', text: 'Draft a change order proposal and have a conversation about scope, fee, and schedule impacts', track: 'Business' },
    ],
  },

  // ── R1 ──────────────────────────────────────────────────────────────────────
  {
    id: 'R1',
    type: 'ranking',
    text: 'Rank these project moments by what energizes you most (drag to reorder):',
    items: [
      { text: 'Presenting a bold concept to a skeptical client and winning them over', track: 'Design' },
      { text: 'Solving a complex technical problem that everyone said was impossible', track: 'Technical' },
      { text: 'Leading your team through a tight deadline and delivering together', track: 'Management' },
      { text: 'Negotiating a challenging contract or fee increase', track: 'Business' },
    ],
  },

  // ── Q3 ──────────────────────────────────────────────────────────────────────
  {
    id: 'Q3',
    type: 'multiple_choice',
    label: 'The RFI Storm',
    text: 'You\'re in CA and wake up to 15 new RFIs from the contractor. Most are interpretations of your details, a few are conflicts you missed. The client wants a response by EOD. You:',
    options: [
      { letter: 'A', text: 'Sketch clarifications for the design-intent questions—show them what you meant', track: 'Design' },
      { letter: 'B', text: 'Go through each RFI systematically, reference the specs, and provide written responses with marked-up details', track: 'Technical' },
      { letter: 'C', text: 'Triage with the team: who handles what, delegate the simple ones, escalate the conflicts', track: 'Management' },
      { letter: 'D', text: 'Flag the ones that might trigger change orders and loop in the client before responding', track: 'Business' },
    ],
  },

  // ── S2 ──────────────────────────────────────────────────────────────────────
  {
    id: 'S2',
    type: 'slider',
    text: 'During construction administration site visits, I\'m more focused on...',
    leftLabel: 'Whether it looks right and matches the design vision',
    leftTrack: 'Design',
    rightLabel: 'Whether it\'s built correctly per the specs and details',
    rightTrack: 'Technical',
  },

  // ── Q4 ──────────────────────────────────────────────────────────────────────
  {
    id: 'Q4',
    type: 'multiple_choice',
    label: 'The Spec Section Crisis',
    text: 'You\'re writing specs for a high-performance envelope. The manufacturer\'s data conflicts with the consultant\'s requirements, and the client wants "best in class" but doesn\'t understand the cost difference. You:',
    options: [
      { letter: 'A', text: 'Specify performance criteria and let the design intent drive the selection', track: 'Design' },
      { letter: 'B', text: 'Build a comparison matrix of products, test data, and compliance requirements—find what actually works', track: 'Technical' },
      { letter: 'C', text: 'Set up a coordination meeting with the envelope consultant and manufacturer to align everyone', track: 'Management' },
      { letter: 'D', text: 'Prepare options at different price points and help the client make an informed decision', track: 'Business' },
    ],
  },

  // ── R2 ──────────────────────────────────────────────────────────────────────
  {
    id: 'R2',
    type: 'ranking',
    text: 'Order these skills by what comes most naturally to you (drag to reorder):',
    items: [
      { text: 'Spatial thinking and visual composition', track: 'Design' },
      { text: 'Technical documentation and code compliance', track: 'Technical' },
      { text: 'Team coordination and mentorship', track: 'Management' },
      { text: 'Client communication and strategic thinking', track: 'Business' },
    ],
  },

  // ── S3 ──────────────────────────────────────────────────────────────────────
  {
    id: 'S3',
    type: 'slider',
    text: 'In team settings, I\'m more likely to...',
    leftLabel: 'Lead the conversation and make decisions',
    leftTrack: 'Management',
    rightLabel: 'Support others and facilitate collaboration',
    rightTrack: 'Technical',
  },

  // ── Q5 ──────────────────────────────────────────────────────────────────────
  {
    id: 'Q5',
    type: 'multiple_choice',
    label: 'The Rendering Deadline',
    text: 'Marketing needs final renderings for a major proposal due Monday. It\'s Friday afternoon. The design is 90% there but the lighting and materials aren\'t quite right. You:',
    options: [
      { letter: 'A', text: 'Spend the weekend perfecting it—this is our one shot to make an impression', track: 'Design' },
      { letter: 'B', text: 'Lock the model, set up realistic lighting and materials efficiently, and deliver something accurate', track: 'Technical' },
      { letter: 'C', text: 'Assess who\'s available, divide the work, and make sure we hit the deadline without burning anyone out', track: 'Management' },
      { letter: 'D', text: 'Deliver what we have by Monday, note it\'s a draft, and offer final renderings as an add service if we win', track: 'Business' },
    ],
  },

  // ── S4 ──────────────────────────────────────────────────────────────────────
  {
    id: 'S4',
    type: 'slider',
    text: 'Success for me looks more like...',
    leftLabel: 'Award-winning, published work that pushes the discipline forward',
    leftTrack: 'Design',
    rightLabel: 'Profitable projects with repeat clients and referrals',
    rightTrack: 'Business',
  },

  // ── Q6 ──────────────────────────────────────────────────────────────────────
  {
    id: 'Q6',
    type: 'multiple_choice',
    label: 'The Contractor Challenge',
    text: 'During CA, the contractor says your detail "can\'t be built as drawn" and proposes a cheaper alternative that compromises the design intent. The client is CC\'d. You:',
    options: [
      { letter: 'A', text: 'Defend the design—explain why this detail matters and offer to explore alternatives that preserve intent', track: 'Design' },
      { letter: 'B', text: 'Ask for their RFI in writing, review the shop drawings, and determine if their concern is valid or cost-cutting', track: 'Technical' },
      { letter: 'C', text: 'Set up a call with all parties to work through this collaboratively and find middle ground', track: 'Management' },
      { letter: 'D', text: 'Evaluate the relationship risk—is this the hill to die on, or should we preserve goodwill for future projects?', track: 'Business' },
    ],
  },

  // ── R3 ──────────────────────────────────────────────────────────────────────
  {
    id: 'R3',
    type: 'ranking',
    text: 'If you could design your ideal work week, rank how you\'d spend your time (drag to reorder):',
    items: [
      { text: 'Designing: concept development, sketching, design reviews, creating renderings', track: 'Design' },
      { text: 'Technical work: detailing, specifications, CA coordination, RFI responses', track: 'Technical' },
      { text: 'People management: 1-on-1s, team meetings, mentoring, problem-solving', track: 'Management' },
      { text: 'Business development: client meetings, proposals, networking, pursuits', track: 'Business' },
    ],
  },

  // ── Q7 ──────────────────────────────────────────────────────────────────────
  {
    id: 'Q7',
    type: 'multiple_choice',
    label: 'The Visualization Request',
    text: 'A potential client asks for a "quick rendering" to help them visualize the concept before signing. It\'s not in your proposal scope yet. You:',
    options: [
      { letter: 'A', text: 'Do it anyway—a strong image could win the project and it\'s an opportunity to explore the design', track: 'Design' },
      { letter: 'B', text: 'Provide a simple massing study with accurate context—set expectations about what\'s "quick" vs. final', track: 'Technical' },
      { letter: 'C', text: 'Check with your team on capacity and timeline before committing to anything', track: 'Management' },
      { letter: 'D', text: 'Position it as a paid feasibility study—show value and establish the fee relationship early', track: 'Business' },
    ],
  },

  // ── S5 ──────────────────────────────────────────────────────────────────────
  {
    id: 'S5',
    type: 'slider',
    text: 'I get more satisfaction from...',
    leftLabel: 'Perfecting the details until they\'re exactly right',
    leftTrack: 'Technical',
    rightLabel: 'Shipping the project and moving to the next challenge',
    rightTrack: 'Management',
  },

  // ── Q8 ──────────────────────────────────────────────────────────────────────
  {
    id: 'Q8',
    type: 'multiple_choice',
    label: 'The All-Nighter Question',
    text: 'It\'s 9 PM. The deadline is tomorrow. Your junior designer is still in the office and you know they\'re stuck on something. You:',
    options: [
      { letter: 'A', text: 'Sit down and sketch through the design problem with them until it clicks', track: 'Design' },
      { letter: 'B', text: 'Walk through the technical requirements step-by-step so they can solve it themselves', track: 'Technical' },
      { letter: 'C', text: 'Ask what\'s blocking them, help remove the obstacle, then send them home—you\'ll cover the rest', track: 'Management' },
      { letter: 'D', text: 'Assess if this deliverable is actually critical or if we can negotiate a 24-hour extension with the client', track: 'Business' },
    ],
  },

  // ── R4 ──────────────────────────────────────────────────────────────────────
  {
    id: 'R4',
    type: 'ranking',
    text: 'When facing a difficult project challenge, rank your instinctive approach (drag to reorder):',
    items: [
      { text: 'Redesign: What if we fundamentally rethought this?', track: 'Design' },
      { text: 'Research: What do the codes, precedents, and consultants say?', track: 'Technical' },
      { text: 'Collaborate: Let\'s get the team together and work through it', track: 'Management' },
      { text: 'Escalate: Let\'s bring this to leadership or the client for strategic direction', track: 'Business' },
    ],
  },

  // ── S6 ──────────────────────────────────────────────────────────────────────
  {
    id: 'S6',
    type: 'slider',
    text: 'When making decisions, I rely more on...',
    leftLabel: 'Intuition, instinct, and design judgment',
    leftTrack: 'Design',
    rightLabel: 'Data, precedent, and technical analysis',
    rightTrack: 'Technical',
  },

  // ── Q9 ──────────────────────────────────────────────────────────────────────
  {
    id: 'Q9',
    type: 'multiple_choice',
    label: 'The Specification Conflict',
    text: 'Your spec calls for a specific product, but three contractors have said it\'s not available in the region. They\'re asking for substitutions in the middle of CA. You:',
    options: [
      { letter: 'A', text: 'Review the substitutions for design compatibility—does it achieve the same aesthetic and performance?', track: 'Design' },
      { letter: 'B', text: 'Compare technical data sheets and test reports—are these actually equivalent products?', track: 'Technical' },
      { letter: 'C', text: 'Coordinate a decision with the design team and client quickly so we don\'t delay construction', track: 'Management' },
      { letter: 'D', text: 'Evaluate if this is a contractor cost-cutting move or a legitimate regional supply issue', track: 'Business' },
    ],
  },

  // ── Q10 ─────────────────────────────────────────────────────────────────────
  {
    id: 'Q10',
    type: 'multiple_choice',
    label: 'The Underbid Dilemma',
    text: 'You\'re pricing a new project. Your gut says it needs 20% more than the client wants to spend. Your firm really wants this project. The principal asks your opinion. You say:',
    options: [
      { letter: 'A', text: '"We should propose what it actually takes to do this right and sell them on the value"', track: 'Design' },
      { letter: 'B', text: '"Here\'s where we can cut scope without compromising safety or code compliance"', track: 'Technical' },
      { letter: 'C', text: '"We can do it if we staff lean and I manage the schedule tightly—but no contingency"', track: 'Management' },
      { letter: 'D', text: '"Let\'s be strategic—underbid to win, then manage scope carefully and recover on the next phase"', track: 'Business' },
    ],
  },

  // ── R5 ──────────────────────────────────────────────────────────────────────
  {
    id: 'R5',
    type: 'ranking',
    text: 'Rank these project phases by where you add the most value (drag to reorder):',
    items: [
      { text: 'Schematic Design: big ideas, concept development, visualization', track: 'Design' },
      { text: 'Construction Documents: detailing, specifications, technical coordination', track: 'Technical' },
      { text: 'Construction Administration: site visits, RFIs, problem-solving in the field', track: 'Technical' },
      { text: 'Business Development: proposals, client pitches, contract negotiation', track: 'Business' },
    ],
  },

  // ── S7 ──────────────────────────────────────────────────────────────────────
  {
    id: 'S7',
    type: 'slider',
    text: 'I feel most ownership over...',
    leftLabel: 'The design vision and how it\'s communicated (renderings, presentations)',
    leftTrack: 'Design',
    rightLabel: 'The business performance and client satisfaction',
    rightTrack: 'Business',
  },

  // ── Q11 ─────────────────────────────────────────────────────────────────────
  {
    id: 'Q11',
    type: 'multiple_choice',
    label: 'The Site Observation',
    text: 'You\'re on site for a CA observation and notice the contractor is installing something that technically meets the spec but looks wrong. It\'s not a code or safety issue. You:',
    options: [
      { letter: 'A', text: 'Stop them—this isn\'t what we designed and it\'ll look bad in photos', track: 'Design' },
      { letter: 'B', text: 'Check the shop drawings and submittals—did we approve this already?', track: 'Technical' },
      { letter: 'C', text: 'Talk to the super before escalating—maybe there\'s context you\'re missing', track: 'Management' },
      { letter: 'D', text: 'Calculate the cost to fix it vs. the relationship cost of stopping work', track: 'Business' },
    ],
  },

  // ── Q12 ─────────────────────────────────────────────────────────────────────
  {
    id: 'Q12',
    type: 'multiple_choice',
    label: 'The Intern\'s Question',
    text: 'A smart intern asks why a particular design decision was made. Honestly, you\'re not sure—it was decided before you joined the project. You:',
    options: [
      { letter: 'A', text: 'Walk them through what you think the design intent is and why it makes sense spatially', track: 'Design' },
      { letter: 'B', text: 'Pull up the specs and code references to show the technical requirements that drove it', track: 'Technical' },
      { letter: 'C', text: 'Admit you don\'t know, then model how to find the answer—let\'s figure it out together', track: 'Management' },
      { letter: 'D', text: 'Connect them with the original project designer, and use it as a relationship-building moment', track: 'Business' },
    ],
  },

  // ── R6 ──────────────────────────────────────────────────────────────────────
  {
    id: 'R6',
    type: 'ranking',
    text: 'Rank these career goals by importance to you five years from now (drag to reorder):',
    items: [
      { text: 'Being known for creating beautiful, meaningful work', track: 'Design' },
      { text: 'Being the go-to technical expert in your specialty', track: 'Technical' },
      { text: 'Leading and developing high-performing teams', track: 'Management' },
      { text: 'Growing a practice or bringing in significant new business', track: 'Business' },
    ],
  },

  // ── Q13 ─────────────────────────────────────────────────────────────────────
  {
    id: 'Q13',
    type: 'multiple_choice',
    label: 'The Post-Occupancy Request',
    text: 'A client calls six months after move-in. They love the building but want documentation—as-builts, O&M manuals, and renderings for marketing. Half of this wasn\'t in the original scope. You:',
    options: [
      { letter: 'A', text: 'Deliver the renderings as a goodwill gesture—they\'re a great portfolio piece anyway', track: 'Design' },
      { letter: 'B', text: 'Provide what was contractually required, clearly document what\'s additional scope', track: 'Technical' },
      { letter: 'C', text: 'Have a conversation about what they need and find a reasonable middle ground', track: 'Management' },
      { letter: 'D', text: 'See this as a relationship investment—if we help now, they\'ll call us for the next project', track: 'Business' },
    ],
  },

  // ── S8 ──────────────────────────────────────────────────────────────────────
  {
    id: 'S8',
    type: 'slider',
    text: 'When creating project documentation, I prioritize...',
    leftLabel: 'Clear visual communication and compelling presentation',
    leftTrack: 'Design',
    rightLabel: 'Thorough technical specification and buildable details',
    rightTrack: 'Technical',
  },

  // ── Q14 ─────────────────────────────────────────────────────────────────────
  {
    id: 'Q14',
    type: 'multiple_choice',
    label: 'The Friday Afternoon Fire',
    text: 'At 4:45 PM on Friday, you discover a major coordination issue between structural and MEP that will delay the permit set. No one else has noticed. You:',
    options: [
      { letter: 'A', text: 'Start sketching solutions—maybe there\'s a design move that resolves the conflict', track: 'Design' },
      { letter: 'B', text: 'Mark up the drawings with the clashes and create a list of questions for Monday\'s coordination call', track: 'Technical' },
      { letter: 'C', text: 'Send a clear, calm email to the team outlining the issue and proposed next steps for Monday', track: 'Management' },
      { letter: 'D', text: 'Call the client to give them a heads-up before they hear it from the permitting office', track: 'Business' },
    ],
  },

  // ── R7 ──────────────────────────────────────────────────────────────────────
  {
    id: 'R7',
    type: 'ranking',
    text: 'Rank these deliverables by which you\'d most want to own end-to-end (drag to reorder):',
    items: [
      { text: 'Final presentation renderings for a major client pitch', track: 'Design' },
      { text: 'Complete specification package for a complex building system', track: 'Technical' },
      { text: 'Coordinated team schedule through a difficult project phase', track: 'Management' },
      { text: 'Winning proposal and contract negotiation for a dream project', track: 'Business' },
    ],
  },

  // ── Q15 ─────────────────────────────────────────────────────────────────────
  {
    id: 'Q15',
    type: 'multiple_choice',
    label: 'The Permit Rejection',
    text: 'The plan reviewer rejects a key design element for a code interpretation you\'ve never encountered. It\'s technically defensible but will require appeals. The client is frustrated. You:',
    options: [
      { letter: 'A', text: 'Fight for it—this design move is worth the effort and we can win the appeal', track: 'Design' },
      { letter: 'B', text: 'Research the code section, find precedents, and build an airtight technical rebuttal', track: 'Technical' },
      { letter: 'C', text: 'Present options to the team: appeal timeline vs. redesign timeline, and let client prioritize', track: 'Management' },
      { letter: 'D', text: 'Calculate the cost of appeal vs. redesign and recommend the path that protects schedule and relationship', track: 'Business' },
    ],
  },
]
