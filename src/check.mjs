// 2-minute hesitation check: a low-commitment next step that ends in a pre-filled brief.
import { esc, arr, page, CTA, CTA_SUB, IND } from './lib.mjs';

const Q = [
  { q: 'Which industry are you in?', k: 'ind', o: [...IND.map(([s, n]) => [n, {}, s]), ['Something else', {}, '']] },
  { q: 'Where do people stop?', o: [['Before they enquire or sign up', { trust: 2 }], ['While comparing options or plans', { choice: 2 }], ['At the final step: checkout, booking or signing', { loss: 2, effort: 1 }], ['After they start: onboarding or first use', { effort: 2, habit: 1 }], ['They come once and do not come back', { habit: 2 }]] },
  { q: 'What do you hear most from customers?', o: [['“Is this safe? Can I trust it?”', { trust: 2 }], ['“Which one should I pick?”', { choice: 2 }], ['“This takes too long.”', { effort: 2 }], ['“What if it goes wrong?”', { loss: 2 }], ['“We will stick with what we have.”', { habit: 2 }]] },
  { q: 'What have you already tried?', o: [['More traffic or more ads', { trust: 1, choice: 1 }], ['A redesign', { effort: 1 }], ['Discounts or offers', { loss: 1 }], ['A new tool or automation', { habit: 1 }], ['Nothing yet', {}]] },
  { q: 'How soon do you need to see movement?', k: 'pace', o: [['This quarter', {}, 'sprint'], ['In the next six months', {}, 'audit'], ['We are exploring', {}, 'read']] },
];

const LEVERS = {
  trust: ['A trust gap', 'People want to act but are not yet sure it is safe. Proof arrives too late, or not where the doubt peaks.', ['Place proof at the exact step where people pause', 'Make guarantees, returns or safeguards visible before the ask', 'Use the words customers use to describe the risk'], ['ux-design', 'Web Design and UX'], ['video-creation', 'Video Creation']],
  choice: ['Choice overload', 'Too many options, plans or messages. People delay rather than risk the wrong pick.', ['Offer one clear default and explain why', 'Cut or group options until the first choice is easy', 'Show who each option is for, in plain words'], ['ux-design', 'Web Design and UX'], ['consulting', 'Consulting']],
  effort: ['Too much effort', 'Each step asks a little too much. The total feels bigger than the reward.', ['Remove or delay every field and step that is not needed now', 'Show progress and what comes next', 'Make the first win happen in the first session'], ['web-development', 'Web Development'], ['software-development', 'Software Development']],
  loss: ['Fear of loss', 'Costs, risks or commitments feel bigger than the gain at the moment of decision.', ['Show the full cost early, with no late surprises', 'Make the first commitment small and reversible', 'Frame the decision around what people keep, not what they give up'], ['ux-design', 'Web Design and UX'], ['digital-marketing', 'Digital Marketing']],
  habit: ['The pull of habit', 'Your real competitor is what people already do. Switching or returning feels like work.', ['Make the new behaviour easier than the old one', 'Prompt at the moment the habit usually happens', 'Celebrate the first repeat, not just the first visit'], ['digital-marketing', 'Digital Marketing'], ['software-development', 'Software Development']],
};
const PACE = { sprint: 'Start with a 4 to 6 week insight sprint focused on one behaviour.', audit: 'Start with a behavioural audit of the journey, then a phased plan.', read: 'Start with a reading of where your journey loses people, then decide together.' };

export function check() {
  const body = `
<section class="bg-ink chk-hero"><div class="wrap">
  <p class="mono c-amber rv">Hesitation check</p>
  <h1 class="rv" style="--d:1"><span>Two minutes.</span><span class="c-amber">Find where people pause.</span></h1>
  <p class="s rv" style="--d:2">Five questions. You get the behaviour most likely to be holding your results back, three first moves, and a brief you can bring to a fit call. Nothing is sent until you choose to.</p>
</div></section>
<section class="bg-paper chk-sec"><div class="wrap">
  <form class="chk" data-check novalidate>
    <div class="chk-bar" aria-hidden="true"><i></i></div>
    ${Q.map((x, i) => `<fieldset class="chk-q${i === 0 ? ' on' : ''}" data-i="${i}"><legend><span class="mono-s">Question ${i + 1} of ${Q.length}</span>${esc(x.q)}</legend>
      <div class="chk-o">${x.o.map(([t, sc, v], j) => `<label><input type="radio" name="q${i}" value="${j}" data-sc='${JSON.stringify(sc)}'${x.k ? ` data-${x.k}="${v}"` : ''}><span>${esc(t)}</span></label>`).join('')}</div>
      <div class="chk-nav">${i ? '<button type="button" class="link" data-back>Back</button>' : '<span></span>'}<span class="mono-s">${i === Q.length - 1 ? 'Last question' : 'Pick one to continue'}</span></div>
    </fieldset>`).join('')}
    <div class="chk-res" hidden aria-live="polite">
      <p class="mono-s">Your result</p>
      <h2 data-r="t"></h2>
      <p class="lede" data-r="p"></p>
      <div class="chk-cols">
        <div><p class="mono-s">Three first moves</p><ol data-r="moves"></ol></div>
        <div><p class="mono-s">Where we would start</p><p data-r="pace"></p><p class="chk-links" data-r="links"></p></div>
      </div>
      <div class="ctas"><a class="btn" data-r="cta" href="/contact/">${CTA} ${arr}</a><button type="button" class="link" data-restart>Start again</button></div>
      <p class="fn">${CTA_SUB} Your answers are added to the brief so the call starts on your real problem.</p>
    </div>
  </form>
</div></section>
<script>window.CX_CHECK=${JSON.stringify({ L: LEVERS, P: PACE, I: Object.fromEntries(IND.map(([s, n]) => [s, n])) }).replace(/</g, '\\u003c')};</script>`;
  return page({ title: 'Hesitation check', desc: 'A 2-minute hesitation check from Cognexa. Five questions show the behaviour most likely holding your results back, with three first moves.', path: '/check/', active: '', body, crumbs: [['Hesitation check', '/check/']] });
}
