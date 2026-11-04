// Text that stays in Instrument Serif italic in Figma (everything else serif → Outfit Light).
export const ITALICS = `What's the problem?|What's the|problem?|What are you really trying to change?|What are you really trying to|change?|Not sure where to start?|Book a 15-min fit call.|Choose a brief.|What makes acquisition the constraint?|What needs to become better?|What needs to change because of it?|What should become automatic?|And what should not?|We start with the|behaviour.|Not sure what you need?|Find the|doubt.|Find the doubt.|Remove it.|Be the|safe pick.|Find the risk.|Build|certainty.|Find the worry.|Show them|belonging.|Find the hurdle.|Design out|regret.|Find the friction.|Get|chosen.|Find the leak.|Fix it.|Make the|decision.|Find the priority.|Commit.|Build for|flow.|Find the delay.|People make|choices.|Find the stall.|Ship the fix.|Design for|scanning.|Design it out.|They keep|stories.|Find the story.|Show it.|Message|match.|Find the mismatch.|Close it.|It's|earned.|Find the proof.|Film it.|behavioural|intelligence.|behavioural intelligence.|Behaviour. Narrative.|Technology.|"If anything, those questions become more important when technology moves faster than behaviour."|Six principles.|Running through every page.|Bring us the problem.|Bring us the brief too.|Behaviour in a digital economy.|Reading is a start. The brief is the conversation.|A conversion problem is often a trust problem wearing a different label.|Bring us the brief. We will tell you what may sit behind it.|Find where|people pause.|Find the pause.|Ease it.|Reassurance works best when it arrives before the doubt does.|Speed is a gain only when someone still owns the decision.|A visitor who understands quickly has attention left to decide.|The same price feels different next to a different reference.|People adopt what feels easier to do than to avoid.|A customer remembers the promise and checks it at checkout.|Bring us the brief.|See what moves.|Not sure what|you need?`.split('|');
const norm = t => t.replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;|[’‘]/g, "'").replace(/&quot;|[“”]/g, '"').replace(/\s+/g, ' ').trim().toLowerCase();
const SET = new Set(ITALICS.map(norm));
export const hits = new Set();
export function markItalics(html) {
  const i = html.indexOf('<body');
  if (i < 0) return html;
  return html.slice(0, i) + html.slice(i).replace(/>([^<>]+)</g, (m, t) => {
    const n = norm(t);
    if (!n || !SET.has(n)) return m;
    hits.add(n);
    return `><span class="it">${t}</span><`;
  });
}
export const unmatched = () => [...SET].filter(x => !hits.has(x));
