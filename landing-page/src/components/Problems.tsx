import { useRef, useState, type KeyboardEvent } from 'react';
import { BarChart3, CalendarX, FileSpreadsheet, IndianRupee, MessageCircle, UserMinus, type LucideIcon } from 'lucide-react';
import { Rise } from './fx';
import { Section } from './layout/Section';
import '../styles/problems.css';

/* Each card is a problem an owner has today and what GymFlow does about it. The "does" side is
   limited to behaviour already stated on the feature pages: the 18-day reminder start, the 7-day
   absence list, the 10-digit number tidy-up on import. No outcome figures. */
const ROWS: { icon: LucideIcon; problem: string; fix: string }[] = [
  {
    icon: CalendarX, problem: 'Nobody noticed the plan had ended',
    fix: 'Every member shows as Active, Expiring or Expired, and expiry reminders start 18 days before the end date.',
  },
  {
    icon: IndianRupee, problem: 'Who owes how much?',
    fix: 'Part payments stay on the member as a pending due, with a list of who owes what.',
  },
  {
    icon: MessageCircle, problem: 'Typing the same reminder again and again',
    fix: 'Welcome, renewal, expiry, payment due and birthday messages go out on WhatsApp by themselves.',
  },
  {
    icon: UserMinus, problem: 'The register shows who came, not who stopped',
    fix: 'A report lists members with a current plan who have not checked in for 7 days or more.',
  },
  {
    icon: FileSpreadsheet, problem: 'Messy lists and phone numbers',
    fix: 'Import an Excel or CSV file, see a preview before anything is saved, and numbers are tidied to 10 digits.',
  },
  {
    icon: BarChart3, problem: 'No clear picture of the month',
    fix: 'Five plain-English reports on members, money, dues, expiries and attendance, with a PDF to download.',
  },
];

const STEPS = [
  {
    when: 'The 12th',
    text: 'the first expiry reminder goes out on WhatsApp, saying how many days are left.',
  },
  {
    when: 'The 20th',
    text: 'you record the renewal. A renewal confirmation goes out and the remaining reminders stop.',
  },
  {
    when: 'If they do not renew',
    text: 'after the 30th, messages asking them to come back continue for up to 18 days.',
  },
];

export function Problems() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = ROWS.length;
    const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (i + 1) % n
      : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (i + n - 1) % n
      : e.key === 'Home' ? 0
      : e.key === 'End' ? n - 1
      : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <Section id="problems" labelledBy="problems-title" tone="paper" className="problems-band">
      <h2 id="problems-title" className="display-2 max-w-[16ch] min-w-0 text-balance [overflow-wrap:break-word]">{'The problems GymFlow solves'}</h2>
      <p className="lead mt-5 max-w-[560px]">
        The everyday jobs that eat an owner&rsquo;s week, and what GymFlow does about each one.
      </p>

      <Rise className="problem-split mt-12 md:mt-16">
        <div role="tablist" aria-orientation="vertical" aria-label="Problems" className="problem-tabs">
          {ROWS.map((r, i) => (
            <button
              key={r.problem}
              ref={el => { tabs.current[i] = el; }}
              type="button"
              role="tab"
              id={`problem-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`problem-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              data-active={i === active}
              className="problem-row"
              style={{ order: i * 2 }}
              onClick={() => setActive(i)}
              onKeyDown={e => onKey(e, i)}
            >
              <span aria-hidden className="problem-icon">
                <r.icon size={20} strokeWidth={1.75} />
              </span>
              <span className="problem-row-text">{r.problem}</span>
            </button>
          ))}
        </div>
        {ROWS.map((r, i) => (
          <div
            key={r.problem}
            role="tabpanel"
            id={`problem-panel-${i}`}
            aria-labelledby={`problem-tab-${i}`}
            data-active={i === active}
            className="problem-panel"
            style={{ order: i * 2 + 1 }}
          >
            <h3 className="problem-title">{r.problem}</h3>
            <p className="problem-label">How GymFlow fixes it</p>
            <p className="problem-fix">{r.fix}</p>
          </div>
        ))}
      </Rise>

      {/* An illustration, not a customer story: labelled as such so nobody reads it as one. */}
      <Rise className="problem-example mt-12 md:mt-16">
        <h3 className="font-sans text-[20px] font-bold leading-snug normal-case text-foreground md:text-[22px]">
          A member whose plan ends on the 30th
        </h3>
        <ol className="problem-steps mt-8">
          {STEPS.map(step => (
            <li key={step.when} className="problem-step">
              <span aria-hidden className="problem-dot" />
              <p className="font-sans text-[16px] leading-relaxed text-muted-foreground">
                <strong className="block font-mono font-medium text-foreground">{step.when}</strong>
                {step.text}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-[14px] text-muted-foreground">Example, not a customer</p>
      </Rise>
    </Section>
  );
}
