"use strict";
/* ============================================================
   FedRAMP Quest. Engine + Module 3 (VDR).
   Content checked against fedramp.gov on 2026-11-13.
   Security notes:
   - All game text is rendered with textContent, never innerHTML.
   - Only the artifact owner's progress is saved; database rules
     (declared on the artifact) restrict reads and writes to the owner.
   - Guests never touch the database.
   - Saved data is validated on load and before every write.
   ============================================================ */

const CONTENT_VERSION = "2026.11.13";
const CHECKED_DATE = "2026-11-13";

/* ---------------- Pixel art ---------------- */
const PALETTES = {
  dot:    { k:"#141428", s:"#f1c7a1", h:"#c9c9d6", g:"#5a6b8c", e:"#141428", m:"#9a3b4b", c:"#b8577c", w:"#f4f4f8", p:"#f7d046" },
  player: { k:"#141428", s:"#e8b48f", h:"#2a1a14", e:"#141428", w:"#f4f4f8", r:"#b0445a", b:"#22223a" },
  raj:    { s:"#a86b45", h:"#151515", a:"#3a3a48", e:"#141428", m:"#5a2a2a", c:"#3f8f5a", w:"#e8e8e8" },
  chad:   { s:"#f0c8a0", h:"#f2d25c", e:"#141428", w:"#ffffff", c:"#2b4fa8", r:"#d23c3c" },
  pam:    { s:"#d9a07c", h:"#a8432a", e:"#141428", m:"#7a2a2a", c:"#6b6f7a", w:"#f4f4f8", n:"#c9a26b" },
  ciso:   { s:"#c68a5e", h:"#e4e4ec", e:"#141428", m:"#6a3030", c:"#1c1c2c", w:"#f4f4f8" },
  ao:     { s:"#8d5a3b", h:"#3a2a20", e:"#141428", m:"#4a2020", c:"#4a5a3a", w:"#f4f4f8" }
};
const SPRITES = {
  dot: [
    "......hhhh......", ".....hhhhhh.....", "....hhhhhhhh....", "...hhhhhhhhhh...",
    "...hssssssssh...", "...sgggssgggs...", "...sgegssgegs...", "...sgggssgggs...",
    "...ssssssssss...", "....sssmmsss....", ".....ssssss.....", "...cccwwwwccc...",
    "..cccccwwccccc..", ".cccpcccccccpcc.", ".cccccccccccccc.", ".cccccccccccccc."
  ],
  player: [
    ".....hhhhhh.....", "....hhhhhhhh....", "...hhhhhhhhhh...", "...hssssssssh...",
    "...hseesseesh...", "...hssssssssh...", "...hsssrrsssh...", "..hhhssssssshh..",
    "..hhh.ssss.hhh..", "..bbbbbwwbbbbb..", ".bbbbbbwwbbbbbb.", ".bbbbbbbbbbbbbb.",
    ".bbbsbbbbbbsbbb.", ".bbbbbbbbbbbbbb.", ".bbbbbbbbbbbbbb.", ".bbbbbbbbbbbbbb."
  ],
  raj: [
    "................", ".....hhhhhh.....", "....hhhhhhhh....", "...ahhhhhhhha...",
    "..aahsssssshaa..", "..aaseesseesaa..", "...asssssssa....", "....sssmmsss....",
    ".....ssssss.....", "...cccccccccc...", "..cccccwwccccc..", ".cccccwccwccccc.",
    ".cccccccccccccc.", ".cccccccccccccc.", ".cccccccccccccc.", ".cccccccccccccc."
  ],
  chad: [
    "........hhhh....", "....hhhhhhhhh...", "...hhhhhhhhhhh..", "...hssssssssh...",
    "...sseesseess...", "...ssssssssss...", "...swwwwwwwws...", "....ssssssss....",
    ".....ssssss.....", "...cccwwwwccc...", "..ccccwrrwcccc..", ".cccccwrrwccccc.",
    ".ccccccrrcccccc.", ".ccccccrrcccccc.", ".cccccccccccccc.", ".cccccccccccccc."
  ],
  pam: [
    "....hhhhhhhh....", "...hhhhhhhhhh...", "..hhhhhhhhhhhh..", "..hhhssssssshh..",
    "..hhseesseeshh..", "..hhsssssssshh..", "..hhsssmmssshh..", "..hhhssssssshh..",
    ".....ssssss.....", "...cccccccccc...", "..ccccwwwwcccc..", ".ccnnnnnccccccc.",
    ".ccnwwwnccccccc.", ".ccnwwwnccccccc.", ".ccnnnnnccccccc.", ".cccccccccccccc."
  ],
  ciso: [
    "................", ".....hhhhhh.....", "....hhhhhhhh....", "...hssssssssh...",
    "...sseesseess...", "...ssssssssss...", "....sssmmsss....", ".....ssssss.....",
    "...cccwwwwccc...", "..cccccwwccccc..", ".cccccccccccccc.", ".cccccccccccccc.",
    ".cccccccccccccc.", ".cccccccccccccc.", ".cccccccccccccc.", ".cccccccccccccc."
  ]
};
SPRITES.ao = SPRITES.ciso;

function drawSprite(canvas, who) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 16, 16);
  const map = SPRITES[who], pal = PALETTES[who];
  if (!map || !pal) return;
  map.forEach((rowRaw, y) => {
    const row = (rowRaw + "................").slice(0, 16);
    for (let x = 0; x < 16; x++) {
      const c = pal[row[x]];
      if (c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); }
    }
  });
}

/* deterministic noise so art draws the same every time */
function noise(x, y) {
  let n = (x * 374761393 + y * 668265263) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

function drawTower(ctx) {
  const bands = ["#0b0d21", "#11173a", "#18214f", "#202c64"];
  bands.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(0, i * 18, 192, 18); });
  ctx.fillStyle = "#202c64"; ctx.fillRect(0, 72, 192, 36);
  for (let y = 0; y < 70; y++) for (let x = 0; x < 192; x++) {
    if (noise(x, y) > 0.993) { ctx.fillStyle = noise(y, x) > 0.5 ? "#ffffff" : "#a9b0d6"; ctx.fillRect(x, y, 1, 1); }
  }
  ctx.fillStyle = "#f4ecc0"; ctx.fillRect(24, 12, 10, 10); ctx.fillStyle = "#11173a"; ctx.fillRect(28, 12, 6, 6);
  ctx.fillStyle = "#1a2a1a"; ctx.fillRect(0, 88, 192, 20);
  for (let x = 0; x < 192; x += 2) { ctx.fillStyle = noise(x, 3) > 0.5 ? "#27402a" : "#1f3322"; ctx.fillRect(x, 88, 2, 2); }
  // tower
  ctx.fillStyle = "#5d5f74"; ctx.fillRect(120, 22, 44, 70);
  ctx.fillStyle = "#4a4c60";
  for (let y = 22; y < 92; y += 6) for (let x = 120 + ((y / 6) % 2) * 4; x < 164; x += 8) ctx.fillRect(x, y, 1, 6);
  for (let y = 22; y < 92; y += 6) ctx.fillRect(120, y, 44, 1);
  ctx.fillStyle = "#5d5f74"; for (let x = 116; x < 168; x += 8) ctx.fillRect(x, 14, 5, 8);
  ctx.fillRect(116, 20, 52, 4);
  ctx.fillStyle = "#f7d046"; ctx.fillRect(138, 34, 8, 12);
  ctx.fillStyle = "#2a2c3c"; ctx.fillRect(141, 34, 2, 12); ctx.fillRect(138, 39, 8, 1);
  ctx.fillStyle = "#2a2c3c"; ctx.fillRect(136, 76, 12, 16);
  // beam from the lookout
  ctx.fillStyle = "rgba(247,208,70,0.12)";
  for (let i = 0; i < 40; i++) ctx.fillRect(100 - i * 2, 36 - i / 4, 2, 6 + i / 2);
}

function drawOffice(ctx) {
  ctx.fillStyle = "#2a2440"; ctx.fillRect(0, 0, 192, 108);
  ctx.fillStyle = "#231e38"; for (let x = 0; x < 192; x += 16) ctx.fillRect(x, 0, 1, 72);
  // window with night city
  ctx.fillStyle = "#0b0d21"; ctx.fillRect(16, 12, 64, 40);
  for (let i = 0; i < 9; i++) { const h = 8 + Math.floor(noise(i, 9) * 22); ctx.fillStyle = "#1b2250"; ctx.fillRect(18 + i * 7, 52 - h, 6, h); }
  for (let y = 14; y < 52; y += 3) for (let x = 18; x < 80; x += 3) if (noise(x, y) > 0.86) { ctx.fillStyle = "#f7d046"; ctx.fillRect(x, y, 1, 1); }
  ctx.fillStyle = "#8a86a8"; ctx.fillRect(14, 10, 68, 2); ctx.fillRect(14, 52, 68, 2); ctx.fillRect(14, 10, 2, 44); ctx.fillRect(80, 10, 2, 44); ctx.fillRect(47, 10, 2, 44);
  // floor
  ctx.fillStyle = "#3a3254"; ctx.fillRect(0, 72, 192, 36);
  for (let x = 0; x < 192; x += 12) { ctx.fillStyle = "#332c4c"; ctx.fillRect(x, 72, 1, 36); }
  // desk + monitor
  ctx.fillStyle = "#6b4a32"; ctx.fillRect(100, 62, 80, 8); ctx.fillStyle = "#4e3524"; ctx.fillRect(104, 70, 6, 24); ctx.fillRect(170, 70, 6, 24);
  ctx.fillStyle = "#141428"; ctx.fillRect(122, 34, 36, 24); ctx.fillStyle = "#1b4f7a"; ctx.fillRect(124, 36, 32, 20);
  ctx.fillStyle = "#6bd36b"; for (let y = 38; y < 54; y += 3) ctx.fillRect(126, y, 4 + Math.floor(noise(y, 4) * 24), 1);
  ctx.fillStyle = "#141428"; ctx.fillRect(138, 58, 4, 4);
  // plant
  ctx.fillStyle = "#7a4a2a"; ctx.fillRect(86, 80, 10, 12);
  ctx.fillStyle = "#3f8f5a"; ctx.fillRect(84, 66, 4, 14); ctx.fillRect(90, 62, 4, 18); ctx.fillRect(95, 68, 4, 12);
  // sticky notes on the wall (Dot was here)
  ctx.fillStyle = "#f7d046"; ctx.fillRect(96, 16, 6, 6); ctx.fillRect(104, 20, 6, 6); ctx.fillStyle = "#ef8fb0"; ctx.fillRect(100, 26, 6, 6);
}

const SCENES = { tower: drawTower, office: drawOffice };
function drawScene(name) {
  const ctx = $("#sceneCanvas").getContext("2d");
  (SCENES[name] || drawOffice)(ctx);
}

function drawTitleArt() {
  const ctx = $("#titleArt").getContext("2d");
  drawTower(ctx);
}

/* Overworld map, 180 x 260 logical pixels */
const LOCS = [
  { id: "foundations", x: 90,  y: 222, name: "HALCYON HQ",  topic: "Rev 5 foundations" },
  { id: "conmon",      x: 38,  y: 160, name: "CONMON MINES", topic: "Continuous monitoring" },
  { id: "vdr",         x: 138, y: 150, name: "WATCHTOWER",   topic: "VDR" },
  { id: "ver",         x: 46,  y: 78,  name: "ORACLE",       topic: "VER" },
  { id: "twentyx",     x: 132, y: 40,  name: "CROSSROADS",   topic: "FedRAMP 20x" }
];
function drawMap() {
  const ctx = $("#mapCanvas").getContext("2d");
  for (let y = 0; y < 260; y += 2) for (let x = 0; x < 180; x += 2) {
    const n = noise(x, y);
    ctx.fillStyle = n > 0.92 ? "#4f9a52" : n > 0.5 ? "#3a7d44" : "#357340";
    ctx.fillRect(x, y, 2, 2);
  }
  // river
  ctx.fillStyle = "#2b5fa8";
  for (let y = 0; y < 260; y++) { const x = 88 + Math.round(Math.sin(y / 22) * 14) - y / 8; ctx.fillRect(Math.round(x), y, 9, 1); }
  ctx.fillStyle = "#5c8fd6";
  for (let y = 0; y < 260; y += 5) { const x = 90 + Math.round(Math.sin(y / 22) * 14) - y / 8; ctx.fillRect(Math.round(x), y, 3, 1); }
  // path linking locations in suggested order
  ctx.fillStyle = "#c9a86b";
  const order = ["foundations", "conmon", "vdr", "ver", "twentyx"].map(id => LOCS.find(l => l.id === id));
  for (let i = 0; i < order.length - 1; i++) {
    const a = order.at(i), b = order.at(i + 1);
    const steps = 60;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = Math.round(a.x + (b.x - a.x) * t), y = Math.round(a.y + (b.y - a.y) * t);
      if (s % 3 !== 2) ctx.fillRect(x - 1, y - 1, 3, 3);
    }
  }
  // trees
  for (let i = 0; i < 26; i++) {
    const x = Math.floor(noise(i, 77) * 170), y = Math.floor(noise(77, i) * 250);
    if (LOCS.some(l => Math.abs(l.x - x) < 26 && Math.abs(l.y - y) < 22)) continue;
    ctx.fillStyle = "#1f4f2a"; ctx.fillRect(x, y, 7, 6); ctx.fillStyle = "#2c6a38"; ctx.fillRect(x + 1, y - 2, 5, 3);
    ctx.fillStyle = "#5a3a22"; ctx.fillRect(x + 3, y + 6, 1, 2);
  }
  // buildings
  const hq = LOCS.at(0); ctx.fillStyle = "#c8c8d8"; ctx.fillRect(hq.x - 14, hq.y - 26, 28, 16); ctx.fillStyle = "#b8577c"; ctx.fillRect(hq.x - 16, hq.y - 30, 32, 5);
  ctx.fillStyle = "#1b2a7a"; for (let i = 0; i < 4; i++) ctx.fillRect(hq.x - 11 + i * 6, hq.y - 23, 4, 4);
  const mn = LOCS.at(1); ctx.fillStyle = "#6a6070"; ctx.fillRect(mn.x - 14, mn.y - 28, 28, 18); ctx.fillStyle = "#141428"; ctx.fillRect(mn.x - 5, mn.y - 20, 10, 10);
  ctx.fillStyle = "#8a6a3a"; ctx.fillRect(mn.x - 7, mn.y - 22, 14, 2);
  const tw = LOCS.at(2); ctx.fillStyle = "#5d5f74"; ctx.fillRect(tw.x - 5, tw.y - 38, 10, 28); ctx.fillRect(tw.x - 7, tw.y - 42, 14, 5);
  ctx.fillStyle = "#f7d046"; ctx.fillRect(tw.x - 1, tw.y - 33, 3, 4);
  const or = LOCS.at(3); ctx.fillStyle = "#6a4aa8"; ctx.fillRect(or.x - 4, or.y - 34, 8, 24); ctx.fillStyle = "#9a7ad8"; ctx.fillRect(or.x - 2, or.y - 42, 4, 8);
  ctx.fillStyle = "#f4ecc0"; ctx.fillRect(or.x - 1, or.y - 46, 2, 3);
  const cr = LOCS.at(4); ctx.fillStyle = "#7a5a3a"; ctx.fillRect(cr.x - 1, cr.y - 32, 2, 22); ctx.fillStyle = "#c9a86b"; ctx.fillRect(cr.x - 10, cr.y - 30, 10, 4); ctx.fillRect(cr.x, cr.y - 24, 10, 4);
}

/* ---------------- Utilities ---------------- */
function $(s) { return document.querySelector(s); }
function el(tag, props, text) {
  const n = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (k === "class") n.className = v; else if (k === "on") { for (const [ev, fn] of Object.entries(v)) n.addEventListener(ev, fn); }
    else n.setAttribute(k, v);
  }
  if (text != null) n.textContent = text;
  return n;
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = b.at(i); b.splice(i, 1, b.at(j)); b.splice(j, 1, t); } return b; }
function withTimeout(p, ms) { return Promise.race([p, new Promise(r => setTimeout(() => r(null), ms))]); }
function toast(msg, ms = 2600) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("on"), ms); }
function fill(text) { return text.split("{name}").join(state.name || "you"); }

/* ---------------- Sound (off by default) ---------------- */
let audio = null;
function sfx(kind) {
  if (!state.settings.sound) return;
  try {
    if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
    const notes = { blip: [[880, .03]], good: [[660, .08], [880, .08], [1320, .14]], bad: [[220, .12], [160, .2]], clear: [[523, .1], [659, .1], [784, .1], [1047, .3]] }[kind] || [];
    let t = audio.currentTime;
    for (const [f, d] of notes) {
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = "square"; o.frequency.value = f; g.gain.value = 0.05;
      o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + d); t += d;
    }
  } catch (e) { /* audio is optional */ }
}

/* ---------------- Content: Module 3, VDR ---------------- */
const D = (who, text) => ({ who, text });
const VDR = {
  id: "vdr",
  title: "THE WATCHTOWER",
  subtitle: "Vulnerability Detection and Response",
  primerScene: "tower",
  scenarioScene: "office",
  primer: [
    D("dot", "Ah, {name}. Welcome to the Watchtower. I have 90 days until retirement and one cardigan pocket left for sticky notes, so let's be efficient."),
    D("dot", "Today's subject is VDR: Vulnerability Detection and Response. It's one of two new FedRAMP rulesets for vulnerabilities. Its twin, VER, Vulnerability Evaluation and Reporting, gets its own lesson at the Oracle."),
    D("dot", "The old way, for context: scan monthly, paste the results into a spreadsheet, and fix things on a fixed clock set by severity alone. It was predictable. It was also mostly theater."),
    D("dot", "In June 2026 FedRAMP launched its Consolidated Rules for 2026, which people who enjoy acronyms call CR26. That same month CISA issued Binding Operational Directive 26-04 on prioritizing security updates by risk."),
    D("dot", "FedRAMP responded by pulling its deadline forward. VDR and VER become mandatory for every cloud offering obtaining or maintaining FedRAMP certification on December 7, 2026. That includes Rev 5 offerings like Halcyon Gov."),
    D("dot", "There is a grace period. An offering can keep its certification under a corrective action plan through March 7, 2027. After that, FedRAMP says certification is revoked for offerings not following the rules. Write that date somewhere Chad can't reach."),
    D("dot", "A word on rule language before the rules. FedRAMP writes MUST, SHOULD and MAY in the standard sense. MUST is mandatory. SHOULD means do it unless you have a real, documented reason not to. MAY is permission."),
    D("dot", "First half: detection. Providers MUST systematically, persistently and promptly find vulnerabilities. The rules name scanning, testing, threat intelligence, disclosure channels, bug bounties and supply chain monitoring."),
    D("dot", "Detection also means checking that systems and processes actually work the way your documents say they do. FedRAMP's own example: an out-of-date control statement in your Security Decision Record counts as a vulnerability."),
    D("player", "So stale documentation is a finding now."),
    D("dot", "Welcome to the future. Your paperwork can be vulnerable."),
    D("dot", "Second half: response. Every detected vulnerability MUST be tracked, evaluated, monitored, mitigated or remediated, reported and managed. That includes checking whether it has been exploited."),
    D("dot", "Know the difference between two words. Mitigation lowers the risk, but the vulnerability still exists. Remediation removes it. If you can't fix something fully, the rules expect you to partially mitigate and keep chipping away."),
    D("dot", "My favorite rule: problems or failures in your detection and response process MUST be treated as vulnerabilities themselves. A broken scanner isn't an IT ticket. It's a finding."),
    D("dot", "Next, a warning aimed squarely at people like us. FedRAMP says to use your existing security and architecture reviews and to avoid separate FedRAMP-only detection processes run by compliance teams, unless they pull data straight from the engineers who run the system."),
    D("dot", "In plain terms, don't run a shadow program. If the compliance view and the engineering view disagree, you have two truths, and assessors only want one."),
    D("dot", "The SHOULDs: automate detection and response, design the system so vulnerabilities are less likely by default, and automatically check new or significantly changed resources, at least on representative samples."),
    D("dot", "Two SHOULD NOTs worth their own sticky note. Don't weaken a system's security to make scanning easier. And don't deploy new machine-based resources that carry a Known Exploited Vulnerability, or KEV."),
    D("dot", "KEVs come from CISA's Known Exploited Vulnerabilities Catalog, which lists flaws being exploited in the wild. The rules say to remediate a KEV by the catalog's due date, even if you've already fully mitigated it."),
    D("dot", "One MAY, for efficiency: you can sample effectively identical resources, like a fleet of identical containers, unless sampling would make detection less effective."),
    D("dot", "How often depends on certification Class. Halcyon Gov is Class C. For Class C, resources likely to drift should get detection at least every 14 days, and samples of similar machines at least every 3 days."),
    D("dot", "Also for Class C: machine-based resources MUST be verified and validated at least monthly, and resources that aren't machine-based MUST be checked at least every 3 months."),
    D("dot", "That's VDR. Find everything, treat broken detection as a finding, keep one honest process, and stay away from KEVs. Here's your recap card. Then Raj has news, and he's wearing his apologetic hoodie.")
  ],
  recap: {
    title: "VDR: Vulnerability Detection and Response",
    terms: [
      ["Deadline", "Mandatory for all FedRAMP certified offerings, Rev 5 included, on December 7, 2026. Certification can continue under a corrective action plan until March 7, 2027, then is revoked for offerings not following the rules."],
      ["Why it moved up", "FedRAMP notice NTC-0014 aligned the date with CISA BOD 26-04 (June 2026). Adoption had been planned for June 1, 2027."],
      ["MUST / SHOULD / MAY", "Mandatory / expected unless you have a documented reason / permitted."],
      ["Vulnerability detection (MUST)", "Systematically, persistently and promptly finding vulnerabilities: scanning, testing, threat intelligence, disclosure channels, bug bounties, supply chain monitoring, and checking that things work as documented. A stale control statement counts."],
      ["Vulnerability response (MUST)", "Tracking, evaluating, monitoring, mitigating or remediating, assessing exploitation, reporting and managing every detected vulnerability."],
      ["Mitigation vs remediation", "Mitigation lowers risk while the vulnerability still exists. Remediation removes it. Partial mitigation is expected when a full fix isn't possible yet."],
      ["Failures are vulnerabilities (MUST)", "A problem or failure in the detection and response process is itself a vulnerability. Rule VDR-CSO-FAV."],
      ["One process", "Avoid separate FedRAMP-only detection processes run by compliance unless they consume data directly from the teams who maintain the system."],
      ["Don't weaken to scan (SHOULD NOT)", "Never reduce a resource's security to make scanning or assessment easier. Rule VDR-CSO-MSP."],
      ["KEVs", "Known Exploited Vulnerabilities from CISA's catalog. Don't deploy new machine-based resources that carry one (SHOULD NOT). Remediate by the catalog due date even if fully mitigated."],
      ["Class C cadence", "Drift-prone resources: detection at least every 14 days. Similar machines: sample at least every 3 days. Machine-based resources: verified and validated at least monthly (MUST). Non-machine resources: at least every 3 months (MUST)."]
    ],
    sources: [
      "FedRAMP VDR rules for Rev 5 providers: https://fedramp.gov/2026/providers/rev5/rules/vulnerability-detection-and-response/",
      "FedRAMP notice NTC-0014: https://fedramp.gov/notices/0014"
    ]
  },
  scenario: {
    title: "THE SCANNER WENT QUIET",
    intro: [
      D("raj", "Hey, {name}. So. I have news, more news, and a request. And Chad's lurking. Want them one at a time?"),
      D("player", "One at a time, Raj.")
    ],
    decisions: [
      {
        setup: [D("raj", "The vulnerability scanner on our east cluster stopped running two weeks ago. Its credentials expired. Nobody noticed, because technically it also stopped reporting problems.")],
        prompt: "The scanner went quiet for two weeks. What do you do?",
        choices: [
          { text: "Log the outage itself as a vulnerability, fix the credentials, and rescan the cluster right away.", correct: true,
            outcome: [D("raj", "Logged, fixed, rescanning. The rescan found two things it would have caught last week."),
                      D("dot", "That's the rule doing its job. Failures in detection MUST be treated as vulnerabilities, so the gap gets tracked and closed like any other finding.")] },
          { text: "Renew the credentials quietly. No findings came in, so nothing was missed.",
            outcome: [D("pam", "During the assessment I noticed your east cluster has a two-week hole in its scan history. Where's the vulnerability record for that?"),
                      D("player", "There... isn't one."),
                      D("dot", "Silence from a broken scanner isn't a clean bill of health. Under VDR-CSO-FAV, a failure in detection is a vulnerability and needed its own record.")] },
          { text: "Mention it as an operations hiccup in next month's monitoring report.",
            outcome: [D("pam", "Your report calls a two-week detection outage a hiccup. I'm going to call it a finding."),
                      D("dot", "Filing it as an operations note treats the scanner like a printer jam. VDR says a detection failure is a vulnerability, so it goes through tracking, evaluation and response, not a footnote.")] },
          { text: "Ask the agency whether it needs to be reported before doing anything.",
            outcome: [D("ao", "You're asking me whether you should fix your own scanner?"),
                      D("dot", "The agency doesn't decide whether a detection failure counts. The rule already did: it's a vulnerability. Track it, fix it, and report it the way the rules say.")] }
        ]
      },
      {
        setup: [D("chad", "Great news! A bug bounty researcher found a way to make our export API fetch internal URLs. Raj says it's serious. But it doesn't have a CVE number, so it's not a FedRAMP thing. Right?")],
        prompt: "Is the bug bounty report a FedRAMP thing?",
        choices: [
          { text: "Yes. Bug bounty reports are part of detection, so it goes through the same tracking, evaluation and response as anything a scanner finds.", correct: true,
            outcome: [D("chad", "So that's a no on the press release about our amazing researchers."),
                      D("dot", "Correct call. The rules list bug bounties and disclosure channels as detection methods. Where a vulnerability was found doesn't change whether it counts.")] },
          { text: "No. Fix it in the commercial backlog, since no scanner flagged it.",
            outcome: [D("raj", "Update: the researcher posted a write-up. The agency's security team read it before we did."),
                      D("dot", "VDR names bug bounties and disclosure channels as detection methods. A vulnerability in Halcyon Gov is in scope however it was found.")] },
          { text: "Wait until it gets a CVE number, then add it to the FedRAMP tracker.",
            outcome: [D("raj", "It's been three weeks. Still no CVE. Turns out flaws in our own code don't get one automatically."),
                      D("dot", "Detection isn't limited to CVE-style scanning. Waiting for a CVE means the response you owe hasn't started.")] }
        ]
      },
      {
        setup: [D("raj", "Exhibit B. Your predecessor's spreadsheet. Every month someone copies scanner output into it by hand so compliance can report from it. It has 41 tabs. One is named FINAL_v7_real.")],
        prompt: "What happens to the spreadsheet?",
        choices: [
          { text: "Retire it. Report straight from the engineering team's own vulnerability data, and automate the reporting.", correct: true,
            outcome: [D("raj", "I would hug you, but HR has a policy."),
                      D("dot", "Right. FedRAMP discourages separate FedRAMP-only processes run by compliance unless they consume data directly from the people who maintain the system, and it expects automation. One source of truth.")] },
          { text: "Keep it. Assessors find spreadsheets reassuring.",
            outcome: [D("pam", "Your spreadsheet says 12 open findings. Your engineering tracker says 19. Which one is true?"),
                      D("dot", "A hand-copied shadow tracker drifts from reality, and now you have two truths. The rules steer you away from compliance-only processes that don't use the engineers' real data.")] },
          { text: "Hire a contractor to update it weekly instead of monthly.",
            outcome: [D("raj", "Great, now FINAL_v8_real exists."),
                      D("dot", "Faster copying is still copying. The fix is one process fed by real engineering data, with automation doing the work. VDR says providers SHOULD use automated services.")] }
        ]
      },
      {
        setup: [D("raj", "The request. The scanner can't log into the database hosts. Easiest fix: I open the management port to the whole internal network and give the scanner a shared admin password. Five minutes, tops.")],
        prompt: "Raj wants to loosen the database hosts so the scanner can get in. Your call?",
        choices: [
          { text: "Decline. Find a way to scan that doesn't weaken the hosts, like a dedicated, tightly scoped scanner account or an agent on the host.", correct: true,
            outcome: [D("raj", "Fine. Scoped account it is. Takes an hour instead of five minutes, which I will mention in standup."),
                      D("dot", "Good. VDR-CSO-MSP says providers SHOULD NOT weaken a resource's security to make scanning, detection or assessment easier.")] },
          { text: "Approve it. Visibility is worth a little exposure.",
            outcome: [D("raj", "On the bright side, the scanner immediately found a new vulnerability. It's the open port."),
                      D("dot", "You created a vulnerability to find vulnerabilities. VDR-CSO-MSP says don't weaken security to make scanning easier.")] },
          { text: "Approve it, but only during scan windows.",
            outcome: [D("pam", "Help me understand. Your admin port is wide open on a schedule?"),
                      D("dot", "Part-time weakening is still weakening, and detection is supposed to be persistent, not a scheduled event. Find a scanning method that doesn't open the door.")] }
        ]
      },
      {
        setup: [D("chad", "Final thing! Raj's new container image is ready and an agency is waiting for the feature. Tiny catch: it includes a library on CISA's Known Exploited Vulnerabilities list. The patched version lands Monday. We ship Friday, yes?")],
        prompt: "Ship the new image on Friday?",
        choices: [
          { text: "No. Hold the release until the image uses the patched library, and keep the current version running until then.", correct: true,
            outcome: [D("chad", "I'll tell the agency it's a quality thing."),
                      D("player", "It is a quality thing, Chad."),
                      D("dot", "Right call. Providers SHOULD NOT deploy new machine-based resources that have known exploited vulnerabilities. Something on the KEV list is being exploited in the wild right now.")] },
          { text: "Ship it Friday and fix it within the normal timeframe.",
            outcome: [D("ciso", "Help me explain to the agency why we deployed something on CISA's exploited list on purpose."),
                      D("dot", "The rules say providers SHOULD NOT deploy new machine-based resources that carry a KEV. You would be putting a known, actively exploited flaw into production by choice.")] },
          { text: "Ship it and call it mitigated, because the firewall should block the attack.",
            outcome: [D("pam", "So the plan was a new deployment with a KEV, covered by a firewall rule you think works?"),
                      D("dot", "Two problems. You'd be deploying a new resource with a KEV, which the rules say not to do. And even a fully mitigated KEV SHOULD still be remediated by the CISA catalog's due date.")] }
        ]
      }
    ],
    verdicts: [
      [15, "That's exactly the one-slide answer I wanted. Clean sweep."],
      [12, "Solid. I'll stop checking in on you after Q1."],
      [8,  "We got there. Let's make sure the assessor doesn't find out how."],
      [0,  "Rough first lap. Run it again before December 7."]
    ]
  }
};
const MODULES = { vdr: VDR };
const NAMES = { dot: "DOT", player: null, raj: "RAJ", chad: "CHAD", pam: "PAM (3PAO)", ciso: "THE CISO", ao: "AGENCY AO" };
const RANKS = [[0, "New Hire"], [60, "Control Wrangler"], [150, "ConMon Survivor"], [300, "Package Whisperer"], [500, "Boundary Keeper"], [700, "FedRAMP Sage"]];

/* ---------------- State and save layer ---------------- */
function freshState() {
  return { v: 1, name: "", best: {}, cleared: {}, codex: [], last: "", settings: { speed: "normal", sound: false, big: false, calm: false } };
}
let state = freshState();
const session = { mode: "loading", signedIn: false, hasSave: false, lastSaved: "", saving: false, pending: false, aborted: false, playing: null };

const NAME_RE = /^[A-Za-z0-9 .'\-]{1,16}$/;
function validState(s) {
  if (!s || typeof s !== "object") return null;
  const out = freshState();
  if (typeof s.name === "string" && NAME_RE.test(s.name.trim())) out.name = s.name.trim();
  if (s.best && typeof s.best === "object") for (const id of Object.keys(MODULES)) {
    const n = s.best[id]; if (Number.isInteger(n) && n >= 0 && n <= 15) out.best[id] = n;
  }
  if (s.cleared && typeof s.cleared === "object") for (const id of Object.keys(MODULES)) if (s.cleared[id] === true) out.cleared[id] = true;
  if (Array.isArray(s.codex)) out.codex = s.codex.filter(id => typeof id === "string" && MODULES[id]).slice(0, 5);
  if (typeof s.last === "string" && LOCS.some(l => l.id === s.last)) out.last = s.last;
  const st = s.settings || {};
  if (["normal", "fast", "instant"].includes(st.speed)) out.settings.speed = st.speed;
  for (const k of ["sound", "big", "calm"]) if (typeof st[k] === "boolean") out.settings[k] = st[k];
  return out;
}

/* Server API. The server only issues sessions to the owner's Google account,
   and every progress call is re-checked server-side. */
async function api(path, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(path, Object.assign({ credentials: "same-origin", signal: ctrl.signal, headers: { "Content-Type": "application/json" } }, opts));
    return res;
  } finally { clearTimeout(t); }
}

async function csrfToken() {
  const res = await api("/api/auth/csrf");
  if (!res.ok) throw new Error("csrf");
  const j = await res.json();
  if (!j || typeof j.csrfToken !== "string") throw new Error("csrf");
  return j.csrfToken;
}

/* NextAuth sign-in and sign-out are form posts; build the form in script. */
function postForm(action, fields) {
  const f = el("form", { method: "POST", action });
  for (const [k, v] of Object.entries(fields)) { const i = el("input", { type: "hidden", name: k }); i.value = v; f.appendChild(i); }
  document.body.appendChild(f);
  f.submit();
}
async function signIn() {
  try { postForm("/api/auth/signin/google", { csrfToken: await csrfToken(), callbackUrl: "/" }); }
  catch (e) { console.error("sign-in failed", e); toast("Sign-in isn't available right now. Try again in a minute."); }
}
async function signOut() {
  try { postForm("/api/auth/signout", { csrfToken: await csrfToken(), callbackUrl: "/" }); }
  catch (e) { console.error("sign-out failed", e); toast("Sign-out didn't go through. Try again."); }
}

async function initSave() {
  try {
    const res = await api("/api/auth/session");
    const sess = res.ok ? await res.json() : null;
    session.signedIn = !!(sess && sess.user);
  } catch (e) { console.error("session check failed", e); session.signedIn = false; }
  if (!session.signedIn) { session.mode = "visitor"; return; }
  try {
    const res = await api("/api/progress");
    if (res.status === 401) { session.signedIn = false; session.mode = "visitor"; return; }
    if (!res.ok) throw new Error("load " + res.status);
    const j = await res.json();
    const loaded = validState(j && j.progress);
    if (loaded && loaded.name) { state = loaded; session.hasSave = true; session.lastSaved = JSON.stringify(state); }
    session.mode = "owner";
  } catch (e) {
    console.error("load failed", e);
    session.mode = "nosave";
  }
}

async function putProgress(body) {
  const res = await api("/api/progress", { method: "PUT", body });
  if (res.status === 401) { const e = new Error("unauth"); e.code = "unauth"; throw e; }
  if (res.status === 429) { const e = new Error("slow"); e.code = "slow"; throw e; }
  if (!res.ok) throw new Error("save " + res.status);
}

async function save() {
  if (session.mode !== "owner") return;
  const clean = validState(state);
  if (!clean) return;
  const body = JSON.stringify(clean);
  if (body === session.lastSaved) return;
  if (session.saving) { session.pending = true; return; }
  session.saving = true;
  try {
    await putProgress(body);
    session.lastSaved = body;
  } catch (e) {
    console.error("save failed", e);
    if (e && e.code === "unauth") {
      session.mode = "nosave"; toast("You've been signed out, so progress isn't saving. Sign in again from the title screen.");
    } else {
      await sleep(1000 + Math.random() * 1000);
      try { await putProgress(body); session.lastSaved = body; }
      catch (e2) { console.error("save retry failed", e2); toast("Progress couldn't be saved right now. It will try again on your next move."); }
    }
  } finally {
    session.saving = false;
    if (session.pending) { session.pending = false; save(); }
  }
}

function applySettings() {
  const root = document.documentElement;
  root.classList.toggle("big", !!state.settings.big);
  root.classList.toggle("calm", !!state.settings.calm);
}

/* ---------------- Screens ---------------- */
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === id));
}
function openOv(id) { $("#" + id).classList.add("on"); const f = $("#" + id).querySelector("button, select, input, textarea"); if (f) f.focus(); }
function closeOv(id) { $("#" + id).classList.remove("on"); }

function renderTitle() {
  const menu = $("#titleMenu"); menu.textContent = "";
  const note = $("#titleNote");
  const add = (label, fn) => menu.appendChild(el("button", { class: "btn", type: "button", role: "menuitem", on: { click: () => { sfx("blip"); fn(); } } }, label));
  if (session.mode === "owner" && session.hasSave) {
    add("Continue as " + state.name, () => goMap());
    add("New game", () => confirmBox("Starting over erases your saved progress. Continue?", () => { const keep = state.settings; state = freshState(); state.settings = keep; askName(); }));
    add("Play as guest", startGuest);
    note.textContent = "Your progress is saved to your account.";
  } else if (session.mode === "owner") {
    add("New game", askName);
    add("Play as guest", startGuest);
    note.textContent = "New games save to your account. Guest runs don't save.";
  } else if (session.mode === "nosave") {
    add("Play (no saving)", () => { session.mode = "local"; askName(); });
    note.textContent = "Saving is unavailable right now, so progress will last only until you close this tab.";
  } else {
    add("Play as guest", startGuest);
    add("Owner sign-in", signIn);
    note.textContent = new URLSearchParams(location.search).get("auth") === "error"
      ? "Sign-in is limited to the game's owner. You can still play as a guest."
      : "Guest runs aren't saved. Only the game's owner keeps progress.";
  }
  const first = menu.querySelector("button"); if (first) first.focus({ preventScroll: true });
}

function startGuest() {
  session.mode = "guest";
  state = freshState();
  askName();
}

function askName() {
  show("nameScreen");
  $("#nameError").textContent = "";
  $("#nameInput").value = state.name || "";
  setTimeout(() => $("#nameInput").focus(), 50);
}

$("#nameForm").addEventListener("submit", e => {
  e.preventDefault();
  const v = $("#nameInput").value.trim();
  if (!NAME_RE.test(v)) { $("#nameError").textContent = "Use 1 to 16 letters, numbers, spaces, periods, apostrophes or hyphens."; return; }
  state.name = v;
  if (session.mode === "owner") session.hasSave = true;
  save();
  goMap();
});
$("#nameBack").addEventListener("click", () => { if (session.mode === "guest" || session.mode === "local") session.mode = session.mode === "local" ? "nosave" : (session.signedIn ? "owner" : "visitor"); show("title"); renderTitle(); });

function xp() { return Object.values(state.best).reduce((a, b) => a + b, 0) * 10; }
function rank() { let r = RANKS.at(0).at(1); for (const [min, name] of RANKS) if (xp() >= min) r = name; return r; }

function goMap() {
  show("overworld");
  $("#mapHud").textContent = state.name.toUpperCase() + " · " + rank().toUpperCase() + " · " + xp() + " XP";
  const locs = $("#locs"); locs.textContent = "";
  for (const l of LOCS) {
    const built = !!MODULES[l.id];
    const best = state.best[l.id] || 0;
    const b = el("button", { class: "loc" + (state.cleared[l.id] ? (best >= 12 ? " gold" : " clear") : ""), type: "button",
      "aria-label": `${l.name}, ${l.topic}${built ? (state.cleared[l.id] ? `, cleared with ${best} of 15 stars` : "") : ", under construction"}`,
      on: { click: () => { sfx("blip"); enterLoc(l); } } });
    b.style.left = (l.x / 180 * 100).toFixed(2) + "%";
    b.style.top = ((l.y + 6) / 260 * 100).toFixed(2) + "%";
    b.appendChild(el("span", { class: "n" }, l.name));
    b.appendChild(el("span", { class: "s" }, built ? l.topic : "COMING SOON"));
    locs.appendChild(b);
  }
  const banner = $("#banner"); banner.className = "";
  if (session.mode === "guest") { banner.textContent = "Guest run: progress disappears when you close this tab."; banner.className = "warn"; }
  else if (session.mode === "local") { banner.textContent = "Saving unavailable: progress lasts only until you close this tab."; banner.className = "warn"; }
  else banner.textContent = "Every location is open. The path shows the suggested order.";
}

async function enterLoc(l) {
  state.last = l.id; save();
  const mod = MODULES[l.id];
  if (!mod) {
    show("scene"); drawScene("office"); $("#sceneHud").textContent = l.name; setPips(0, -1);
    session.aborted = false;
    try { await runLines([D("dot", `${l.name.charAt(0) + l.name.slice(1).toLowerCase()} is still under construction. ${l.topic} arrives in a later update. The Watchtower is open now, and its deadline is the closest one on the calendar.`)]); }
    catch (e) { /* aborted */ }
    goMap();
    return;
  }
  playModule(mod);
}

/* ---------------- Dialog engine ---------------- */
let typing = null, advanceResolver = null;
function speedMs() { return { normal: 22, fast: 8, instant: 0 }[state.settings.speed] ?? 22; }

function setSpeaker(who) {
  const p = $("#portrait");
  if (who && SPRITES[who]) { p.classList.remove("hide"); drawSprite(p, who); } else p.classList.add("hide");
  $("#speaker").textContent = who === "player" ? state.name.toUpperCase() : (NAMES[who] || "");
}

function typeText(text) {
  const t = $("#text"); t.textContent = "";
  $("#more").classList.remove("on");
  const ms = speedMs();
  if (ms === 0) { t.textContent = text; $("#more").classList.add("on"); return Promise.resolve(); }
  return new Promise(resolve => {
    let i = 0;
    typing = { finish: () => { clearInterval(typing.h); t.textContent = text; typing = null; $("#more").classList.add("on"); resolve(); } };
    typing.h = setInterval(() => {
      i += 1; t.textContent = text.slice(0, i);
      if (i % 3 === 0) sfx("blip");
      if (i >= text.length && typing) typing.finish();
    }, ms);
  });
}

function waitAdvance() { return new Promise(r => { advanceResolver = r; }); }
function advance(kind = "next") {
  if (typing) { typing.finish(); return; }
  if (advanceResolver) { const r = advanceResolver; advanceResolver = null; r(kind); }
}

async function say(line, canBack) {
  if (session.aborted) throw new Error("abort");
  $("#backBtn").hidden = !canBack;
  setSpeaker(line.who);
  await typeText(fill(line.text));
  if (session.aborted) throw new Error("abort");
  const res = await waitAdvance();
  if (session.aborted || res === "abort") throw new Error("abort");
  return res;
}

async function runLines(lines, opts = {}) {
  let i = 0;
  while (i < lines.length) {
    const res = await say(lines.at(i), !!opts.back && i > 0);
    if (res === "back") i = Math.max(0, i - 1); else i++;
  }
  $("#backBtn").hidden = true;
}

function choose(prompt, choices) {
  if (session.aborted) return Promise.reject(new Error("abort"));
  setSpeaker(null);
  $("#text").textContent = prompt;
  $("#more").classList.remove("on");
  $("#backBtn").hidden = true;
  const list = $("#choiceList"); list.textContent = "";
  list.appendChild(el("p", { id: "choicePrompt" }, prompt));
  $("#scene").classList.add("choosing");
  $("#choices").classList.add("on");
  return new Promise((resolve, reject) => {
    // the dialog box ignores taps while choices are open; only an abort gets through
    advanceResolver = function guard(k) { if (k === "abort") { $("#choices").classList.remove("on"); $("#scene").classList.remove("choosing"); reject(new Error("abort")); } else advanceResolver = guard; };
    choices.forEach((c, idx) => {
      const b = el("button", { class: "btn", type: "button", on: { click: () => {
        sfx("blip"); advanceResolver = null; $("#choices").classList.remove("on"); $("#scene").classList.remove("choosing"); resolve(c);
      } } }, String.fromCharCode(65 + idx) + ". " + c.text);
      list.appendChild(b);
    });
    const first = list.querySelector("button"); if (first) first.focus({ preventScroll: true });
  });
}

$("#dialog").addEventListener("click", () => advance());
$("#dialog").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); advance(); } });
document.addEventListener("keydown", e => {
  if (!$("#scene").classList.contains("on") || document.querySelector(".overlay.on")) return;
  if ((e.key === "Enter" || e.key === " ") && document.activeElement === document.body) { e.preventDefault(); advance(); }
});
$("#backBtn").addEventListener("click", () => { if (typing) typing.finish(); if (advanceResolver) { const r = advanceResolver; advanceResolver = null; r("back"); } });

function setPips(n, now) {
  const p = $("#pips"); p.textContent = "";
  for (let i = 0; i < n; i++) p.appendChild(el("span", { class: "pip" + (i < now ? " done" : i === now ? " now" : "") }));
}

function punish() {
  sfx("bad");
  const f = $("#flash"); f.classList.remove("on"); void f.offsetWidth; f.classList.add("on");
  if (!state.settings.calm && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const w = $("#sceneWrap"); w.classList.remove("shake"); void w.offsetWidth; w.classList.add("shake");
  }
}

/* ---------------- Module flow ---------------- */
async function playModule(mod) {
  session.aborted = false;
  show("scene");
  try {
    drawScene(mod.primerScene);
    $("#sceneHud").textContent = mod.title + " · PRIMER";
    setPips(0, -1);
    await runLines(mod.primer, { back: true });
    await showRecap(mod, true);
    if (!state.codex.includes(mod.id)) { state.codex.push(mod.id); save(); }

    drawScene(mod.scenarioScene);
    $("#sceneHud").textContent = mod.title + " · " + mod.scenario.title;
    const ds = mod.scenario.decisions;
    setPips(ds.length, 0);
    await runLines(mod.scenario.intro);
    let stars = 0;
    for (let i = 0; i < ds.length; i++) {
      const d = ds.at(i);
      setPips(ds.length, i);
      await runLines(d.setup);
      let tries = 0;
      for (;;) {
        const c = await choose(d.prompt, shuffle(d.choices));
        tries++;
        if (c.correct) { sfx("good"); await runLines(c.outcome); stars += tries === 1 ? 3 : 1; break; }
        punish();
        await runLines(c.outcome.concat([D("dot", "Try that decision again.")]));
        await runLines(d.setup);
      }
    }
    setPips(ds.length, ds.length);
    await chapterClear(mod, stars);
  } catch (e) {
    if (e && e.message !== "abort") { console.error(e); toast("Something went wrong. Returning to the map."); }
    $("#choices").classList.remove("on");
    $("#scene").classList.remove("choosing");
    goMap();
  }
}

function showRecap(mod, fromModule) {
  return new Promise(resolve => {
    $("#recapH").textContent = mod.recap.title.toUpperCase();
    const body = $("#recapBody"); body.textContent = "";
    const dl = el("dl", { class: "terms" });
    for (const [t, d] of mod.recap.terms) { dl.appendChild(el("dt", null, t)); dl.appendChild(el("dd", null, d)); }
    body.appendChild(dl);
    $("#recapChecked").textContent = `Checked against fedramp.gov on ${CHECKED_DATE}. Rules change through FedRAMP's public process, so confirm before relying on details.`;
    $("#recapClose").textContent = fromModule ? "ON TO THE SCENARIO" : "CLOSE";
    $("#recapExport").onclick = () => exportRecap(mod);
    $("#recapClose").onclick = () => { closeOv("recapOv"); resolve(); };
    openOv("recapOv");
    $("#recapOv .panel").scrollTop = 0;
  });
}

function chapterClear(mod, stars) {
  return new Promise(resolve => {
    sfx("clear");
    const prev = state.best[mod.id] || 0;
    if (stars > prev) state.best[mod.id] = stars;
    state.cleared[mod.id] = true;
    save();
    const s = $("#clearStars"); s.textContent = "";
    const shown = Math.round(stars / 3);
    for (let i = 0; i < 5; i++) s.appendChild(el("span", i < shown ? null : { class: "off" }, "★"));
    s.setAttribute("aria-label", `${stars} of 15 stars`);
    $("#clearStats").textContent = `${stars} of 15 stars · best ${state.best[mod.id]} · ${xp()} XP total · ${rank()}`;
    drawSprite($("#cisoPortrait"), "ciso");
    const v = mod.scenario.verdicts.find(([min]) => stars >= min);
    $("#clearVerdict").textContent = "The CISO: “" + (v ? v.at(1) : "") + "”";
    $("#clearReplay").onclick = () => { closeOv("clearOv"); resolve(); playModule(mod); };
    $("#clearMap").onclick = () => { closeOv("clearOv"); resolve(); goMap(); };
    openOv("clearOv");
  });
}

/* ---------------- Export ---------------- */
function recapMarkdown(mod) {
  const L = [];
  L.push(`# FedRAMP Quest recap: ${mod.recap.title}`, "");
  L.push(`Content checked against fedramp.gov on ${CHECKED_DATE} (content version ${CONTENT_VERSION}).`, "");
  L.push("## Key terms", "");
  for (const [t, d] of mod.recap.terms) L.push(`- **${t}:** ${d}`);
  L.push("", "## Scenario decisions", "");
  mod.scenario.decisions.forEach((d, i) => {
    const right = d.choices.find(c => c.correct);
    const why = right.outcome.filter(o => o.who === "dot").map(o => o.text).join(" ");
    L.push(`${i + 1}. **${d.prompt}**`);
    L.push(`    - Correct answer: ${right.text}`);
    L.push(`    - Why: ${why}`);
  });
  L.push("", "## Sources", "");
  for (const s of mod.recap.sources) L.push(`- ${s}`);
  return L.join("\n") + "\n";
}

function exportRecap(mod) {
  const md = recapMarkdown(mod);
  try {
    const url = URL.createObjectURL(new Blob([md], { type: "text/markdown" }));
    const a = el("a", { href: url, download: `fedramp-quest-${mod.id}-recap.md` });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    toast("Recap downloaded.");
  } catch (e) {
    console.error("download failed", e);
    $("#exportNote").textContent = "Downloading didn't work here, so copy the recap instead.";
    $("#exportText").value = md;
    openOv("exportOv");
  }
}
$("#exportCopy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText($("#exportText").value); toast("Copied."); }
  catch (e) { $("#exportText").select(); toast("Select the text and copy it manually."); }
});
$("#exportClose").addEventListener("click", () => closeOv("exportOv"));

/* ---------------- Menus ---------------- */
function openMenu(inModule) {
  const list = $("#menuList"); list.textContent = "";
  const add = (label, fn) => list.appendChild(el("button", { class: "btn", type: "button", on: { click: () => { sfx("blip"); fn(); } } }, label));
  add("Resume", () => closeOv("menuOv"));
  add("Codex", () => { closeOv("menuOv"); openCodex(); });
  add("Settings", () => { closeOv("menuOv"); openSettings(); });
  if (inModule) add("Return to map (lose this run)", () => {
    closeOv("menuOv"); session.aborted = true;
    if (typing) typing.finish();
    if (advanceResolver) { const r = advanceResolver; advanceResolver = null; r("abort"); }
  });
  add("Title screen", () => {
    closeOv("menuOv");
    session.aborted = true;
    if (typing) typing.finish();
    if (advanceResolver) { const r = advanceResolver; advanceResolver = null; r("abort"); }
    setTimeout(() => { show("title"); if (session.mode === "guest" || session.mode === "local") { session.mode = session.mode === "local" ? "nosave" : (session.signedIn ? "owner" : "visitor"); state = session.lastSaved ? validState(JSON.parse(session.lastSaved)) : freshState(); } renderTitle(); }, 30);
  });
  openOv("menuOv");
}
$("#mapMenuBtn").addEventListener("click", () => openMenu(false));
$("#sceneMenuBtn").addEventListener("click", () => openMenu(true));

function openCodex() {
  const list = $("#codexList"); list.textContent = "";
  if (!state.codex.length) list.appendChild(el("p", null, "No cards yet. Finish a primer to unlock its recap card."));
  for (const id of state.codex) {
    const mod = MODULES[id]; if (!mod) continue;
    list.appendChild(el("button", { class: "codexItem", type: "button", on: { click: () => { closeOv("codexOv"); showRecap(mod, false); } } }, mod.recap.title));
  }
  openOv("codexOv");
}
$("#codexClose").addEventListener("click", () => closeOv("codexOv"));

function openSettings() {
  $("#setSpeed").value = state.settings.speed;
  $("#setSound").checked = state.settings.sound;
  $("#setBig").checked = state.settings.big;
  $("#setCalm").checked = state.settings.calm;
  const info = $("#accountInfo");
  info.textContent = session.mode === "owner"
    ? "Signed in as the owner. Progress saves to your account."
    : session.mode === "guest" ? "Guest run. Nothing is saved." : "Progress isn't being saved on this visit.";
  $("#setReset").hidden = session.mode !== "owner";
  $("#setSignOut").hidden = !session.signedIn;
  openOv("settingsOv");
}
for (const id of ["setSpeed", "setSound", "setBig", "setCalm"]) {
  $("#" + id).addEventListener("change", () => {
    state.settings.speed = ["normal", "fast", "instant"].includes($("#setSpeed").value) ? $("#setSpeed").value : "normal";
    state.settings.sound = $("#setSound").checked;
    state.settings.big = $("#setBig").checked;
    state.settings.calm = $("#setCalm").checked;
    applySettings();
    save();
  });
}
$("#setClose").addEventListener("click", () => closeOv("settingsOv"));
$("#setSignOut").addEventListener("click", () => { closeOv("settingsOv"); signOut(); });
$("#setReset").addEventListener("click", () => {
  closeOv("settingsOv");
  confirmBox("This erases your stars, codex and name. Continue?", () => {
    const keep = state.settings; state = freshState(); state.settings = keep;
    session.hasSave = false;
    session.aborted = true;
    if (advanceResolver) { const r = advanceResolver; advanceResolver = null; r("abort"); }
    askName();
  });
});

function confirmBox(text, onYes) {
  $("#confirmText").textContent = text;
  $("#confirmYes").onclick = () => { closeOv("confirmOv"); onYes(); };
  $("#confirmNo").onclick = () => closeOv("confirmOv");
  openOv("confirmOv");
}

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  const ov = document.querySelector(".overlay.on");
  if (ov && ov.id !== "recapOv" && ov.id !== "clearOv") ov.classList.remove("on");
});

/* ---------------- Boot ---------------- */
drawTitleArt();
drawMap();
applySettings();
(async () => {
  await initSave();
  applySettings();
  renderTitle();
})();
