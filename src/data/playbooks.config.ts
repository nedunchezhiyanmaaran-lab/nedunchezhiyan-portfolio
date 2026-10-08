export type PlaybookGoalKey = 'new_app' | 'revamp' | 'manual_process';

export interface PlaybookItem {
  num: string;
  question: string;
  rule?: string;
  trap?: string;
  example?: string;
}

export interface PlaybookConfig {
  title: string;
  disclaimer: string;
  items: PlaybookItem[];
}

export const PLAYBOOKS: Record<PlaybookGoalKey, PlaybookConfig> = {
  new_app: {
    title: 'MVP Scoping Playbook',
    disclaimer: 'My rules of thumb from building MVPs, not industry standards. Examples are illustrative.',
    items: [
      {
        num: '01',
        question: 'Who is the user? (one sentence)',
        rule: 'Pick one specific person in one specific role with one recurring problem. "Anyone" or "small businesses" is too broad to design for.',
        trap: 'Targeting several user types in v1 (for example buyers and sellers).',
        example: '"Freelance designers who chase late client invoices by hand."',
      },
      {
        num: '02',
        question: 'What is the ONE job your product does?',
        rule: 'Strong MVPs usually solve one painful problem clearly better than the current workaround, like spreadsheets or messy message threads.',
        trap: 'Building an all-in-one platform before you know users will pay for one thing.',
        example: '"Sends polite payment reminders automatically."',
      },
      {
        num: '03',
        question: 'What screens does the user see?',
        rule: 'Many MVPs need only about 3 to 5 core screens: sign-in, the main action, results, and sometimes settings.',
        trap: 'Designing many secondary screens (help center, nested settings, profile customization) before launch.',
        example: '1) Add invoice 2) Reminder schedule 3) Status overview.',
      },
      {
        num: '04',
        question: 'What are the must-haves, and what can wait?',
        rule: 'If removing a feature does not stop the core job from working, move it to later.',
        trap: 'Confusing "nice once we have many users" with "needed for the first few users".',
        example: 'Must-have: reminder emails. Later: team accounts, reports.',
      },
      {
        num: '05',
        question: 'What can be done manually at first?',
        rule: 'Do things that do not scale. Handling onboarding or invoicing by hand can save days or weeks of backend work.',
        trap: 'Building self-serve automation before you have seen where users get stuck.',
        example: 'Send a payment link by hand after a demo instead of building a checkout.',
      },
      {
        num: '06',
        question: 'Do you need payments, user roles, an admin panel, emails, or integrations?',
        rule: 'Each can add days or weeks of edge cases (refunds, failed payments, permissions, bounced emails). Build only what is needed to prove demand.',
        trap: 'Building several user roles when no team has signed up yet.',
        example: 'Single-user sign-in with a magic link; skip role permissions until a customer asks.',
      },
      {
        num: '07',
        question: 'How will you know it worked in 30 days?',
        rule: 'Set one measurable target, with a number and a date, before writing code.',
        trap: 'Vanity metrics like page views or "my friends liked it".',
        example: '"5 freelance designers send reminders weekly within 30 days."',
      },
      {
        num: '08',
        question: 'What is fixed: budget or deadline?',
        rule: 'If the deadline is fixed, cut scope. If the budget is fixed, cut scope or extend the timeline, and build the core first.',
        trap: 'Trying to fix deadline, budget, and scope all at once.',
        example: '"Launch in 4 weeks; anything unfinished by week 3 moves to v2."',
      },
    ],
  },
  revamp: {
    title: 'MVP Scoping Playbook',
    disclaimer: 'My rules of thumb from building MVPs, not industry standards. Examples are illustrative.',
    items: [
      { num: '01', question: 'What works today that must not break?' },
      { num: '02', question: 'Where do users complain or drop off?' },
      { num: '03', question: 'Who built it, and is there documentation?' },
      { num: '04', question: 'Do you have access to the code, hosting, and database?' },
      { num: '05', question: 'What is the smallest change that fixes the biggest problem?' },
      { num: '06', question: 'Does any data need to be migrated?' },
      { num: '07', question: 'How will you know it improved in 30 days?' },
      { num: '08', question: 'What is fixed: budget or deadline?' },
    ],
  },
  manual_process: {
    title: 'MVP Scoping Playbook',
    disclaimer: 'My rules of thumb from building MVPs, not industry standards. Examples are illustrative.',
    items: [
      { num: '01', question: 'Who does this today, and how long does it take?' },
      { num: '02', question: 'What are the steps, in order?' },
      { num: '03', question: 'Where do mistakes or delays happen?' },
      { num: '04', question: 'Which tools or spreadsheets are used now?' },
      { num: '05', question: 'What must stay manual?' },
      { num: '06', question: 'Who needs access, and with what permissions?' },
      { num: '07', question: 'How will you measure time saved?' },
      { num: '08', question: 'What is fixed: budget or deadline?' },
    ],
  },
};
