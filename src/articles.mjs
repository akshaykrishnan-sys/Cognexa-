import { esc, arr, page } from './lib.mjs';

export const ARTICLES = [
  { slug: 'trust-signals-that-cost-nothing', ig: 'ig-trust', topic: 'Consumer Decision-Making', title: 'Trust signals that cost nothing', lede: 'Small reassurances at the right moment often do more than a discount.', read: 4,
    intro: 'A shopper rarely needs a bigger reason to buy. More often they need a smaller reason to stop worrying. Trust signals are the cheap, honest answers to the questions people ask silently before they commit.',
    s: [['Name the worry before the shopper does', 'Every purchase carries a quiet question: what if this goes wrong? Delivery dates, total costs and return terms answer it in advance. When they appear early, the shopper spends less effort checking and more attention on the choice itself.'],
        ['Place proof beside the decision', 'A review is most useful next to the button it supports. The same sentence placed three screens earlier is easy to forget. We look at where people hesitate, then move the evidence to that exact point.'],
        ['Keep the signals honest', 'A signal that overpromises costs more than it earns. Show only what the business can deliver every time, in words a customer would use themselves. Trust grows when the page and the parcel agree.']],
    quote: 'Reassurance works best when it arrives before the doubt does.', callT: 'Signals worth checking', call: ['Is the delivery date visible before payment?', 'Are returns described in plain words?', 'Does the payment step look familiar?'], rel: ['five-second-rule-homepage', 'loss-aversion-pricing-page'] },
  { slug: 'what-should-ai-speed-up', ig: 'ig-ai', topic: 'AI and Transformation', title: 'What should AI be allowed to speed up?', lede: 'Speed needs direction. Start with the decision.', read: 5,
    intro: 'Most teams ask what AI can do. A more useful question is which decisions are safe to hand over, which need a check, and which should stay with a person. The answer depends on the cost of a wrong call.',
    s: [['Sort work by the cost of being wrong', 'Drafting a summary and approving a refund are very different tasks. We map each task by how reversible its outcome is and how much judgement it needs. Low-risk, reversible work is where speed pays first.'],
        ['Add a review where judgement matters', 'Some work can be sped up and then checked. The check should be designed in advance: who looks, what they look for, and what they can change. Without it, people either trust the output too much or redo it from scratch.'],
        ['Keep some decisions human', 'Choices that affect trust, safety or fairness deserve a named person. AI can prepare the evidence. The call stays with someone who can explain it to the customer.']],
    quote: 'Speed is a gain only when someone still owns the decision.', callT: 'Three questions to ask', call: ['What happens if this output is wrong?', 'Who reviews it, and how quickly?', 'What does the reviewer lose by skipping the check?'], rel: ['adoption-is-a-behaviour-problem', 'trust-signals-that-cost-nothing'] },
  { slug: 'five-second-rule-homepage', ig: 'ig-five', topic: 'Digital Experience', title: 'The five-second rule, applied to a homepage', lede: 'What a first-time visitor can understand before they decide to stay.', read: 4,
    intro: 'A first-time visitor gives a homepage a few seconds before deciding whether to stay. In that time they are trying to answer three things: what is this, why should I trust it, and what happens next.',
    s: [['Say what it is, plainly', 'The first screen should name the offer in words a visitor would use. Clever phrasing asks people to work. Plain phrasing lets them move straight on to the next question.'],
        ['Give a reason to trust it', 'Proof near the top, such as who the business has worked with or what it has measured, shortens the distance to trust. Placement matters more than volume. One clear signal beats a wall of logos.'],
        ['Make the next step obvious', 'Once the visitor understands, the page should offer one clear action. Several equal choices slow people down. We test the first five seconds with a few real visitors and ask them to explain the page back.']],
    quote: 'A visitor who understands quickly has attention left to decide.', callT: 'What a visitor should know', call: ['What you offer.', 'Who it is for.', 'What to do next.'], rel: ['trust-signals-that-cost-nothing', 'when-channels-tell-different-stories'] },
  { slug: 'loss-aversion-pricing-page', ig: 'ig-loss', topic: 'Behavioural Science', title: 'Loss aversion on a pricing page', lede: 'Why the same price reads differently depending on what sits beside it.', read: 5,
    intro: 'People weigh losses more heavily than equal gains. On a pricing page, that means the same number can feel fair or painful depending on how it is framed and what appears next to it.',
    s: [['Frame the price against the cost of waiting', 'A price shown alone invites the question of whether it is worth it. Shown beside what the problem already costs, it becomes a comparison. The frame has to be true and easy to check.'],
        ['Show what the plan protects', 'Plans described by features read as a list of costs. Plans described by what they protect, such as time, revenue or peace of mind, are easier to weigh. We test both framings with the buyers who decide.'],
        ['Use the reference honestly', 'Reference points guide choice, so they must be real. An inflated anchor may win a click and lose the relationship. Use comparisons a buyer can verify for themselves.']],
    quote: 'The same price feels different next to a different reference.', callT: 'Framing checks', call: ['What sits next to the price?', 'Is the cost of waiting visible?', 'Does each tier say what it protects?'], rel: ['trust-signals-that-cost-nothing', 'five-second-rule-homepage'] },
  { slug: 'adoption-is-a-behaviour-problem', ig: 'ig-adopt', topic: 'Technology Adoption', title: 'Adoption is a behaviour problem', lede: 'Teams adopt a system when the effort of changing feels worth it.', read: 7,
    intro: 'A new system can be the right choice and still go unused. Adoption depends on the effort people expect to spend and the value they expect to get back. When effort looks larger than value, work carries on the old way.',
    s: [['Measure the effort people feel', 'Effort is more than training time. It includes the cost of learning, the risk of looking slow and the pull of the old tool. We watch real tasks to find where the effort sits.'],
        ['Make value visible early', 'A first win within the first week changes how a team feels about a tool. Design the first tasks so that value shows quickly and the effort stays small.'],
        ['Plan for the habit after launch', 'Launch day is a moment. Habit is a pattern. We plan reminders, defaults and peer examples that carry the new way of working well past the first month.']],
    quote: 'People adopt what feels easier to do than to avoid.', callT: 'First-week checks', call: ['Can a user finish one real task quickly?', 'Is the old way still easier?', 'Who can answer a question on the spot?'], rel: ['what-should-ai-speed-up', 'when-channels-tell-different-stories'] },
  { slug: 'when-channels-tell-different-stories', ig: 'ig-channels', topic: 'Growth and Marketing', title: 'When channels tell different stories', lede: 'Search, social and email each make a promise. People notice when they disagree.', read: 4,
    intro: 'A customer meets a business in several places. Search may promise the fastest delivery, social the lowest price and email premium quality. When the promises differ, the customer has to decide which one is true.',
    s: [['Read the journey as one conversation', 'Each channel is a turn in the same conversation. We line up what every channel says about the offer and look for gaps a customer would notice.'],
        ['Choose one promise to keep', 'The strongest message is the one the business can deliver every time. We pick a single lead promise, then shape each channel to support it in its own style.'],
        ['Test the handover between channels', 'The moment a customer moves from an ad to a page is where mismatches show. We follow real journeys across channels and fix the handover before adding more reach.']],
    quote: 'A customer remembers the promise and checks it at checkout.', callT: 'Channel checks', call: ['What does each channel promise?', 'Which promise can we always keep?', 'Where do the stories first disagree?'], rel: ['five-second-rule-homepage', 'loss-aversion-pricing-page'] },
];
export const bySlug = Object.fromEntries(ARTICLES.map(a => [a.slug, a]));
export const artHref = (slug) => `/thinking/${slug}/`;

export function relatedCards(slugs) {
  return `<section class="bg-paper3" style="padding:80px 0"><div class="wrap">
  <p class="mono" style="font-size:12px;color:#595957">Keep reading</p>
  <div class="related">${slugs.map((sl, i) => { const a = bySlug[sl]; return `<a class="art rv" style="--d:${i}" href="${artHref(sl)}"><div class="im"><img src="/assets/img/${a.ig}.webp" alt="" loading="lazy"></div><p class="k">${a.topic.toUpperCase()}</p><h3>${esc(a.title)}</h3></a>`; }).join('')}</div>
</div></section>`;
}

export function articlePage(a) {
  const ids = ['s1', 's2', 's3'];
  const body = `
<article>
<header class="bg-paper" style="padding:80px 0 48px"><div class="wrap ahead">
  <p class="mono rv" style="color:#595957"><a href="/thinking/" style="text-decoration:none">Thinking</a>&nbsp;&nbsp;/&nbsp;&nbsp;${esc(a.topic)}</p>
  <h1 class="rv" style="--d:1">${esc(a.title)}</h1>
  <p class="s rv" style="--d:2">${esc(a.lede)}</p>
  <p class="mono rv" style="--d:3;font-size:12px;color:#595957;margin-top:26px">Cognexa team&nbsp;&nbsp;/&nbsp;&nbsp;${a.read} min read&nbsp;&nbsp;/&nbsp;&nbsp;Sample article</p>
</div></header>
<div class="bg-paper" style="padding:0 0 64px"><div class="wrap"><div class="acover rv-img"><img src="/assets/img/${a.ig}.webp" alt="${esc(a.title)}" fetchpriority="high"></div></div></div>
<div class="bg-paper" style="padding:0 0 96px"><div class="wrap abody">
  <nav class="toc" aria-label="In this article"><p class="mono-s" style="color:#595957">In this article</p>${a.s.map(([h], i) => `<a href="#${ids[i]}"${i ? '' : ' class="on"'}>${String(i + 1).padStart(2, '0')}&nbsp;&nbsp; ${esc(h)}</a>`).join('')}</nav>
  <div class="prose">
    <p class="rv">${esc(a.intro)}</p>
    <h2 id="s1" class="rv">${esc(a.s[0][0])}</h2><p class="rv">${esc(a.s[0][1])}</p>
    <blockquote class="rv">${esc(a.quote)}</blockquote>
    <h2 id="s2" class="rv">${esc(a.s[1][0])}</h2><p class="rv">${esc(a.s[1][1])}</p>
    <div class="callout rv"><p class="mono-s" style="color:#595957">${esc(a.callT)}</p><ul>${a.call.map(c => `<li>•&nbsp; ${esc(c)}</li>`).join('')}</ul></div>
    <h2 id="s3" class="rv">${esc(a.s[2][0])}</h2><p class="rv">${esc(a.s[2][1])}</p>
    <p class="mono rv" style="font-size:12px;color:#595957;border-top:1px solid var(--line);padding-top:20px;text-transform:none;letter-spacing:.02em">Written by the Cognexa team. Sample article text, to be replaced.</p>
  </div>
</div></div>
</article>
${relatedCards(a.rel)}
<section class="tcta"><div class="wrap"><p class="mono rv" style="color:#9ea1ad">Fit call</p><h2 class="rv" style="--d:1">Bring us the brief. We will tell you what may sit behind it.</h2><a class="btn rv" style="--d:2" href="/contact/">Book a 15-min fit call ${arr}</a></div></section>`;
  return page({ title: a.title, desc: a.lede, path: artHref(a.slug), active: 'thinking', body, crumbs: [['Thinking', '/thinking/'], [a.title, artHref(a.slug)]],
    schema: [{ '@type': 'Article', headline: a.title, description: a.lede, author: { '@type': 'Organization', name: 'Cognexa team' } }] });
}
