// Rebuilds public/content2.js: keeps the strongest Night Shift decisions and
// swaps in real-world pitfall scenarios. Run: node night2.js <repo>
const fs = require("fs"), path = require("path");
const repo = process.argv[2];
global.window = {};
require(path.join(repo, "public/content.js"));
require(path.join(repo, "public/content2.js"));
const N = window.FQ_NIGHT;
const D = (who, text) => ({ who, text });
const C = (text, outcome, correct) => (correct ? { text, correct: true, outcome } : { text, outcome });

/* ---------- new pitfall decisions ---------- */
const supportTool = {
  setup: [D("raj", "Real talk. Support engineers paste federal users' error logs and screenshots into our commercial ticketing tool. It's outside the boundary. It's also SOC 2 certified, so that's fine?")],
  prompt: "What do you do about the ticketing tool?",
  choices: [
    C("It handles federal data, so it's in scope. Bring it in or reroute those tickets.", [
      D("raj", "Federal tickets get their own queue in an in-scope tool. Support will grumble for a week."),
      D("dot", "Right. Anything likely to handle federal customer data belongs in the assessment scope, and any third-party resource has to be documented with its justification, mitigations and compensating controls.")], true),
    C("It's fine. SOC 2 is a recognized audit, and that covers the risk for a support tool.", [
      D("pam", "SOC 2 tells me the vendor has controls. It doesn't put federal data inside your boundary."),
      D("dot", "Common pitfall. A SOC 2 report isn't a FedRAMP certification. A tool handling federal data is in scope either way.")]),
    C("Support tools aren't part of the system, so they sit outside FedRAMP scope.", [
      D("ao", "My users' error logs are sitting in a tool nobody assessed?"),
      D("dot", "Scope follows the data, not the org chart. If a tool is likely to handle federal customer data, it's in scope.")]),
    C("Only the attachments carry federal data. Ticket text and metadata can stay where they are.", [
      D("dot", "Metadata, including metadata about federal customer data, must be in scope. Ticket text with user IDs and error details counts.")])
  ]
};
const inherited = {
  setup: [D("raj", "Good news for the package: Analytics Gov runs on a hyperscaler region with its own FedRAMP High authorization. So we inherit everything, right?")],
  prompt: "What does Analytics Gov actually inherit?",
  choices: [
    C("Only what the provider runs. Our app and configuration stay ours.", [
      D("raj", "So the data center's guards are theirs, and our admin passwords are ours. Fair."),
      D("dot", "Right. Inheritance covers what the underlying provider implements for you. Everything you build and configure on top, including their customer-responsibility items, is still yours to implement and prove.")], true),
    C("Everything. A High platform underneath covers a Moderate service on top.", [
      D("pam", "Their High authorization doesn't configure your IAM roles."),
      D("dot", "This is the most common inheritance mistake. The platform's authorization covers the platform's controls, not yours.")]),
    C("Everything physical and network-related; the rest is ours. That's the standard split.", [
      D("dot", "Closer, but there's no standard split. Many network controls depend on how you configure the platform. Check what the provider actually documents as theirs versus yours.")]),
    C("Nothing. Inheritance is a Rev 5 concept that the 2026 rules removed.", [
      D("dot", "Too far. You still rely on the provider's controls. The 2026 rules also require you to document the impact of third-party resources on federal data.")])
  ]
};
const crypto = {
  setup: [D("raj", "Planning for 2027: engineering wants to swap to a faster crypto library for data in transit. It uses FIPS-approved algorithms and has a FIPS mode switch.")],
  prompt: "Is the new crypto library OK for Halcyon Gov (Class C)?",
  choices: [
    C("No. Class C should use CMVP-validated modules, not just approved algorithms.", [
      D("raj", "Checked. The library has no validation, and its FIPS mode just limits algorithms. Back to the shortlist."),
      D("dot", "Right. For Class C the 2026 rules say you SHOULD use modules, or update streams of modules, with active NIST CMVP validations wherever crypto protects federal data, and you MUST document each one.")], true),
    C("Yes. FIPS-approved algorithms are what the rules care about, not the library.", [
      D("dot", "Approved algorithms aren't the same as a validated module. The rule is about modules with active CMVP validations.")]),
    C("Yes, once we switch on its FIPS mode, since that makes it behave like a validated module.", [
      D("pam", "FIPS mode isn't a validation certificate."),
      D("dot", "A classic pitfall. A FIPS mode setting limits the algorithms used. It doesn't make an unvalidated module validated.")]),
    C("Yes, as long as our old library's validation certificate is still active.", [
      D("dot", "The old certificate covers the old module and its update stream, not a different library. Algorithms added to an update stream aren't covered either.")])
  ]
};
const inventory = {
  setup: [D("raj", "Monthly numbers don't agree. The scanner hit 412 hosts. The inventory lists 380. The cloud console shows 450 running right now.")],
  prompt: "How do you handle the three different counts?",
  choices: [
    C("Reconcile all three. Unscanned or uninventoried hosts are a detection gap to fix.", [
      D("raj", "Found them. Forty were autoscaling nodes, and eight were a forgotten test cluster with production data."),
      D("dot", "Right. A gap between what runs and what you scan is a failure in detection, and VDR treats those as vulnerabilities. The forgotten cluster is why you reconcile.")], true),
    C("Report 380. The inventory is the official list, so that's what agencies see.", [
      D("ao", "Your own console shows 70 more machines than your inventory. Which ones hold our data?"),
      D("dot", "An inventory that misses running resources is the problem, not the answer.")]),
    C("Report 412. That's what was actually tested, and it's the most defensible number.", [
      D("dot", "Defensible until someone asks about the 38 hosts you didn't scan. Reconcile against what's actually running.")]),
    C("Scan only what's in the inventory. The extra hosts are probably short-lived autoscaling.", [
      D("pam", "Probably isn't a scope. Eight of those hosts are a test cluster with production data."),
      D("dot", "Assuming the unknown hosts are harmless is how test clusters with real data go unscanned.")])
  ]
};
const backport = {
  setup: [D("raj", "The scanner flags 40 'critical' OpenSSL CVEs on our Linux hosts. The version strings look old, but our distro backports security fixes without changing the version.")],
  prompt: "How do you handle the 40 OpenSSL findings?",
  choices: [
    C("Check each against the distro's advisories, then file the proven ones.", [
      D("raj", "Thirty-seven were backported. Three weren't. Glad we checked."),
      D("dot", "Right. Backports are a classic source of false positives, but each one needs evidence. VER says you should evaluate false positives, and that means one by one.")], true),
    C("Close all 40. That distro always backports, so the scanner is just wrong.", [
      D("pam", "Three of these were never patched by the vendor."),
      D("dot", "Usually right isn't evidence. A blanket closure is how the three real ones slip through.")]),
    C("Upgrade OpenSSL from source so the version strings satisfy the scanner.", [
      D("raj", "We just swapped a validated crypto module for an unvalidated build. And lost vendor support."),
      D("dot", "Fixing the scanner's opinion by replacing a vendor-supported crypto module creates two new problems. Prove the false positives instead.")]),
    C("Keep all 40 open as criticals until the scanner vendor fixes its detection.", [
      D("dot", "That buries real risk under noise and burns your shortest deadlines. Evaluate them now.")])
  ]
};
const ephemeral = {
  setup: [D("raj", "Our containers live about 20 minutes. The scanner runs every 3 days, so it almost never sees a running container.")],
  prompt: "How does detection work for 20-minute containers?",
  choices: [
    C("Scan images at build and in the registry, and block deploys of images with KEVs.", [
      D("raj", "Build-time scanning plus a registry gate. The containers are never running long enough to matter anyway."),
      D("dot", "Right. Short-lived resources are best covered where they're born. VDR says to check new resources automatically and not to deploy new machine-based resources with KEVs.")], true),
    C("Scan running containers more often, every few minutes, to catch them alive.", [
      D("dot", "You'd be chasing containers instead of checking where they come from. Scan the images they're built from.")]),
    C("Nothing extra. Containers that short-lived can't really be attacked.", [
      D("pam", "A vulnerable image deploys a thousand times a day. Each one is live for 20 minutes."),
      D("dot", "Short lifetimes don't remove the flaw. They just move where you need to look.")]),
    C("Count the host nodes as samples of the containers and scan those every 3 days.", [
      D("dot", "The host isn't the container image. Sampling covers effectively identical resources, and these aren't.")])
  ]
};
const extraInfo = {
  setup: [D("ao", "My team wants a weekly spreadsheet of every open finding, in our own template, on top of your standard reports.")],
  prompt: "How do you respond to the agency's request?",
  choices: [
    C("Offer standard reports first. Extra asks need an agency-head determination.", [
      D("ao", "Your machine-readable feed actually covers most of it. Let me check with my team."),
      D("dot", "Right. FedRAMP's agency rules say agencies should not request vulnerability information beyond the VDR rules unless the agency head or a delegate makes a determination, and they must notify FedRAMP when they do. Be helpful first.")], true),
    C("Agree. Agencies can require whatever reporting they want from a provider.", [
      D("raj", "We now make 14 custom spreadsheets a week for 14 agencies."),
      D("dot", "This is how ConMon becomes a full-time job. The agency rules exist to stop exactly this.")]),
    C("Refuse. FedRAMP rules prohibit agencies from asking for anything extra.", [
      D("ao", "Prohibit? I'd like to see that rule."),
      D("dot", "It's a SHOULD NOT, with an exception for a formal determination. Leading with refusal also damages the relationship.")]),
    C("Agree quietly, and keep it from FedRAMP so the relationship stays smooth.", [
      D("dot", "Agencies must tell FedRAMP when they request extra vulnerability information. Hiding it doesn't help either side.")])
  ]
};
const incident = {
  setup: [D("raj", "Bad news. That likely exploitable flaw was actually exploited overnight. Someone may have read federal records. Forensics will take days.")],
  prompt: "Under the 2026 incident rules, what's the first move?",
  choices: [
    C("Treat it as reportable now. At Class C, the first report is due within 1 hour.", [
      D("ciso", "Send it. We'll update as forensics comes in."),
      D("dot", "Right. A likely effect on federal data's confidentiality makes it reportable. It's treated as N5 until you estimate otherwise, and for Class C an N3 or higher needs the initial report within 1 hour, then ongoing updates.")], true),
    C("Wait for forensics to confirm data was accessed, then report.", [
      D("ao", "You knew for three days and said nothing?"),
      D("dot", "The rule is likely effect, not confirmed effect. Waiting for certainty is the most common incident reporting failure.")]),
    C("Report within 24 hours, which is the standard window for Class C.", [
      D("dot", "Twenty-four hours is the Class C window for an N2. Until you estimate otherwise this is treated as N5, which means 1 hour.")]),
    C("Tell only the agency whose records were involved, to limit the blast radius.", [
      D("dot", "The initial report goes to FedRAMP, to affected agencies through their own procedures, and to all necessary parties.")])
  ]
};
const vendorTool = {
  setup: [D("chad", "Great news! A compliance platform vendor says its connector covers all the KSIs out of the box. Sign today and we're basically 20x ready.")],
  prompt: "How do you evaluate the vendor's claim?",
  choices: [
    C("Test it KSI by KSI. We're accountable for the evidence, not the vendor.", [
      D("raj", "The connector covers 19 KSIs well, 12 partly, and can't see the rest. Useful, but not 'out of the box.'"),
      D("dot", "Right. Providers stay accountable for the package's accuracy even when third parties help prepare it. A connector can only prove what it can see.")], true),
    C("Sign it. A FedRAMP-focused vendor knows the KSIs better than we do.", [
      D("pam", "Your platform's dashboard says compliant. Your systems say otherwise."),
      D("dot", "Vendor expertise doesn't transfer accountability. You still own whether the evidence is true.")]),
    C("Pass. Third-party tools can't be used for 20x evidence.", [
      D("raj", "So we build all 46 integrations ourselves? Hard pass."),
      D("dot", "Tools are fine and often smart. The point is to verify what they actually cover.")]),
    C("Sign it, and ask the assessor to validate the connector at our next assessment.", [
      D("dot", "Finding gaps at assessment time is the expensive way. Test coverage before you rely on it.")])
  ]
};

/* ---------- assemble ---------- */
const pick = (id, idx) => N[id].scenario.decisions[idx];
const dualPath = pick("foundations_n", 2);
N.foundations_n.scenario.decisions = [pick("foundations_n", 0), pick("foundations_n", 1), supportTool, inherited, crypto];
N.conmon_n.scenario.decisions = [pick("conmon_n", 0), inventory, pick("conmon_n", 2), backport, pick("conmon_n", 4)];
N.vdr_n.scenario.decisions = [pick("vdr_n", 0), ephemeral, pick("vdr_n", 2), pick("vdr_n", 3), pick("vdr_n", 4)];
N.ver_n.scenario.decisions = [pick("ver_n", 0), extraInfo, pick("ver_n", 2), incident, pick("ver_n", 4)];
N.twentyx_n.scenario.decisions = [pick("twentyx_n", 0), pick("twentyx_n", 1), dualPath, pick("twentyx_n", 3), vendorTool];

N.foundations_n.primer = [
  D("dot", "Night shift, {name}. Tonight is about the things that trip up real programs: scope creep, inheritance, crypto and paperwork timing."),
  D("dot", "The file: Halcyon is launching a second offering, Halcyon Analytics Gov, and everyone has opinions about how to certify it.")
];
N.conmon_n.primer = [
  D("dot", "Night shift in the mines, {name}. This is where real ConMon programs quietly break: bad counts, noisy scanners and polite pressure."),
  D("dot", "Assume the 2026 change and monitoring rules are in effect for Halcyon Gov tonight.")
];

const out = '"use strict";\n/* FedRAMP Quest: Night Shift (level 2). Generated by scripts/night2.js.\n   Real-world pitfall scenarios. Rules checked against fedramp.gov (CR26) on 2026-11-13. */\nwindow.FQ_NIGHT = ' + JSON.stringify(N, null, 1) + ";\n";
fs.writeFileSync(path.join(repo, "public/content2.js"), out);
console.log("wrote", Object.keys(N).map(k => k + ":" + N[k].scenario.decisions.length).join(" "));
