"use strict";
/* ============================================================
   FedRAMP Quest: Night Shift (level 2) for all five locations.
   Harder scenarios: every option is plausible, wrong answers are
   "right rule, wrong detail". Rules checked against fedramp.gov
   (Consolidated Rules for 2026) on 2026-11-13.
   ============================================================ */
(function () {
  const D = (who, text) => ({ who, text });
  const M = window.FQ_MODULES || {};

  const night = (base, title, briefing, intro, decisions, verdicts) => ({
    id: base + "_n", base, level: 2, title: title, primerScene: null, scenarioScene: "office", night: true,
    primer: briefing, recap: null, scenario: { title: "NIGHT SHIFT", intro, decisions, verdicts }
  });

  /* ---------- HQ: certification rules ---------- */
  const foundationsN = night("foundations", "HALCYON HQ", [
    D("dot", "Night shift, {name}. No primer tonight. Every answer will sound reasonable, and most of them are almost right. Read the details."),
    D("dot", "Tonight's file: Halcyon is launching a second offering, Halcyon Analytics Gov, and everyone has opinions about how to certify it.")
  ], [
    D("ciso", "I need Halcyon Analytics Gov certified at Class C on the Program path. Quickly, and without surprises.")
  ], [
    { setup: [D("raj", "Analytics Gov's independent assessment finished five months ago. We want to submit the application next week.")],
      prompt: "What has to happen before Analytics Gov applies?",
      choices: [
        { text: "Have a Recognized assessor freshen it by reviewing changes, then apply.", correct: true,
          outcome: [D("dot", "Right. For Classes B to D the independent assessment must be from the previous 3 months. A stale one can be freshened by a Recognized assessor reviewing changes, as long as it isn't more than 9 months old.")] },
        { text: "Apply as planned. Assessments stay valid for 9 months; five is fine.",
          outcome: [D("pam", "Nine months is the cutoff for freshening, not for using it as is."),
                    D("dot", "The assessment must be from the previous 3 months. Nine months is the limit on how old it can be and still be freshened.")] },
        { text: "Commission a full new assessment. Over 3 months old means start over.",
          outcome: [D("ciso", "You just spent a quarter's budget we didn't need to spend."),
                    D("dot", "A stale assessment under 9 months old can be freshened by a Recognized assessor reviewing the changes. A full redo isn't required.")] },
        { text: "Apply now and disclose its age. Class C allows up to 6 months.",
          outcome: [D("dot", "There's no 6-month allowance. For Classes B to D, the independent assessment must be from the previous 3 months, or freshened.")] }
      ] },
    { setup: [D("chad", "Our consultant built the whole package three weeks ago. They offered to submit the application for us so we don't have to.")],
      prompt: "How should the application go in?",
      choices: [
        { text: "Refresh it to status verified in the last 7 days, then apply ourselves.", correct: true,
          outcome: [D("dot", "Right on both counts. The package must reflect status verified within the previous 7 days, and the provider must apply itself. Third parties can help prepare, not apply.")] },
        { text: "Let the consultant submit. They prepared it, so they're accountable.",
          outcome: [D("dot", "Two misses. Providers must apply themselves, and providers stay accountable for the package's accuracy even when a third party prepares it.")] },
        { text: "Submit it ourselves today. It was accurate three weeks ago.",
          outcome: [D("pam", "Your package describes a firewall rule you removed last week."),
                    D("dot", "Submitting yourself is right, but the package must reflect status verified within the previous 7 days. Three weeks is too old.")] },
        { text: "Let the consultant submit, with our CISO's signature on the form.",
          outcome: [D("dot", "A signature doesn't change who applied. FedRAMP says providers must apply themselves, not through a third party.")] }
      ] },
    { setup: [D("ciso", "The board wants a hedge on Halcyon Gov: keep the Rev 5 Agency certification and also pursue a 20x Program certification for the same offering.")],
      prompt: "Is the board's hedge allowed?",
      choices: [
        { text: "Allowed but discouraged, so the hedge has to be worth it.", correct: true,
          outcome: [D("ciso", "Discouraged but allowed. I can work with that, and I'll make them justify it."),
                    D("dot", "Right. Rev 5 Agency plus 20x Program is discouraged but not prohibited. The combination that's prohibited is Rev 5 Program plus 20x Program.")] },
        { text: "Not allowed. An offering can hold only one certification Type.",
          outcome: [D("dot", "Too strict. The rules prohibit pursuing both Rev 5 Program and 20x Program for one offering. Rev 5 Agency plus 20x Program is discouraged, not banned.")] },
        { text: "Allowed, once we move Rev 5 to the Program path so both are FedRAMP-run.",
          outcome: [D("pam", "That would put you in the one combination the rules prohibit."),
                    D("dot", "Providers must not pursue both Rev 5 Program and 20x Program certification for the same offering. Converting would create exactly that.")] },
        { text: "Allowed and encouraged. It's FedRAMP's recommended migration route.",
          outcome: [D("dot", "Allowed, yes. Encouraged, no. FedRAMP says Rev 5 Agency plus 20x Program is discouraged.")] }
      ] },
    { setup: [D("chad", "Finance wants to drop Analytics Gov from Class C to Class B next quarter, in about 60 days, to save money.")],
      prompt: "What does the downgrade require?",
      choices: [
        { text: "A new Class B certification, with at least 120 days' notice. Sixty is too soon.", correct: true,
          outcome: [D("chad", "So the savings start a quarter later. Finance will love that."),
                    D("dot", "Right. Downgrading class requires a new certification, and providers should notify all necessary parties at least 120 days before an intended downgrade.")] },
        { text: "A transformative change notice: 30 business days ahead, then 10.",
          outcome: [D("dot", "Change notifications can't change class. Downgrading requires a new certification, with 120 days' notice to all necessary parties.")] },
        { text: "A new Class B certification, with 30 days' notice to agencies.",
          outcome: [D("ao", "Thirty days to rethink my agency's use of your service? That's not enough."),
                    D("dot", "The new certification part is right. The notice should be at least 120 days before an intended downgrade.")] },
        { text: "Nothing formal. Drop the Class C extras; it steps down at the next assessment.",
          outcome: [D("dot", "Class doesn't drift down on its own. Downgrading requires a new certification, with advance notice.")] }
      ] },
    { setup: [D("raj", "One agency needs higher assurance for the analytics service inside Halcyon Gov. I could raise just that service's security categorization. The rest of the offering stays the same.")],
      prompt: "What is raising one service's categorization?",
      choices: [
        { text: "Transformative, with full notice. The offering's class doesn't change.", correct: true,
          outcome: [D("dot", "Right. Raising the security categorization of a service within the offering that handles federal data is transformative. Changing the whole offering's impact level would be a class change.")] },
        { text: "A class change. Any categorization increase needs a new certification.",
          outcome: [D("dot", "Close, but that's for changing the impact level of the entire offering. Raising one service's categorization is a transformative change.")] },
        { text: "Adaptive, since only one service changes. Notify within 10 business days.",
          outcome: [D("ao", "You raised the categorization of the service holding our data and told us afterward?"),
                    D("dot", "Raising a service's categorization when it handles federal data is transformative, so the notices come before you start.")] },
        { text: "Transformative, and once assessed, Halcyon Gov counts as Class D for them.",
          outcome: [D("dot", "The first half is right. But class belongs to the whole offering. Getting a higher class takes a new certification.")] }
      ] }
  ], [[15, "Flawless. You read the fine print like an assessor."], [12, "Sharp. One detail slipped, which is what night shift is for."], [8, "The traps got you. Review the certification rules."], [0, "Rough night. Run it again."]]);

  /* ---------- Mines: changes, CCM, IVV ---------- */
  const conmonN = night("conmon", "CONMON MINES", [
    D("dot", "Night shift in the mines, {name}. Changes, reviews and assessments, with no obvious answers."),
    D("dot", "Assume the 2026 change and monitoring rules are in effect for Halcyon Gov tonight.")
  ], [
    D("raj", "You're on call with me tonight. Brought you a headlamp.")
  ], [
    { setup: [D("raj", "11 p.m. Our database provider just had a major outage. To keep agencies online, I failed Halcyon Gov over to a different third-party database service. No notice went out.")],
      prompt: "What does Halcyon owe now?",
      choices: [
        { text: "Follow emergency procedures, notify afterward, and get it assessed.", correct: true,
          outcome: [D("raj", "Paperwork, then sleep. Fair."),
                    D("dot", "Right. In an emergency, significant changes, even transformative ones, may happen without advance notice. You still owe the emergency procedures, the notifications after the fact, and an assessment afterward.")] },
        { text: "Roll back until the 30-business-day transformative notice period passes.",
          outcome: [D("ao", "You took us offline again to fill out a form?"),
                    D("dot", "Emergencies are why the emergency rule exists. You can make the change without advance notice, then notify and assess afterward.")] },
        { text: "Nothing. Emergency changes are exempt from change notification rules.",
          outcome: [D("dot", "Not exempt. You can skip advance notice, but you must still notify afterward, provide the notification materials and complete an assessment.")] },
        { text: "Call it adaptive, since agencies saw no difference, and notify in 10 days.",
          outcome: [D("pam", "Replacing a critical third-party service is the textbook transformative change."),
                    D("dot", "Agencies not noticing doesn't make it adaptive. Swapping a critical third-party service is transformative, handled here under the emergency rule.")] }
      ] },
    { setup: [D("raj", "Different topic. We want to add a newer model to Halcyon Gov's already-approved AI service. Federal data won't reach any new service.")],
      prompt: "What kind of change is adding the model?",
      choices: [
        { text: "Adaptive. Notify everyone within 10 business days after finishing.", correct: true,
          outcome: [D("dot", "Right. FedRAMP's own adaptive example is adding models to approved AI services without exposing federal data to new services.")] },
        { text: "Routine recurring. Models update constantly, so no notification.",
          outcome: [D("dot", "Routine recurring covers things like patching and scaling capacity. FedRAMP lists adding a model to an approved AI service as adaptive.")] },
        { text: "Transformative. AI changes the risk profile, so 30 business days' notice.",
          outcome: [D("ciso", "We just delayed a harmless upgrade by six weeks."),
                    D("dot", "As long as federal data isn't exposed to new services, FedRAMP calls this adaptive. Exposing federal data to a new service would be a different story.")] },
        { text: "Adaptive, but notify everyone at least 10 business days before starting.",
          outcome: [D("dot", "Adaptive is right, but the timing is backward. Adaptive notices go out within 10 business days after you finish.")] }
      ] },
    { setup: [D("pam", "Raj tells me he evaluated about 40 possible changes this quarter, decided they were all routine, and kept no notes. I'd like the evaluation records.")],
      prompt: "What's the right response to Pam?",
      choices: [
        { text: "We owed auditable records of every evaluation, routine ones included.", correct: true,
          outcome: [D("raj", "So my brain isn't an auditable record. Noted."),
                    D("dot", "Right. Providers must keep auditable records of significant change evaluations and provide them to FedRAMP on request. Routine changes skip the notice, not the evaluation.")] },
        { text: "Routine changes are exempt from the change rules, so no records were needed.",
          outcome: [D("dot", "Routine changes are exempt from notification. They still have to be evaluated, and the evaluations need auditable records.")] },
        { text: "Records are only required for changes that turn out to be transformative.",
          outcome: [D("dot", "The record-keeping rule covers evaluations of all potential significant changes, whatever type they turn out to be.")] },
        { text: "Records only matter if FedRAMP asks, so there was nothing to keep yet.",
          outcome: [D("pam", "You can't produce on request what you never kept."),
                    D("dot", "The records go to FedRAMP on request, so you have to keep them all along.")] }
      ] },
    { setup: [D("chad", "The quarterly report goes out Monday. Let's hold the quarterly review that afternoon, invite only our two biggest agencies plus our consulting partner, and skip the recording.")],
      prompt: "How should the quarterly review be run?",
      choices: [
        { text: "Wait 3 to 10 business days, open it to all, no partner, and record it.", correct: true,
          outcome: [D("dot", "Right. For Class C, hosting is a MUST, registration must be provided, and the timing, recording and third-party limits are SHOULDs. Chad's plan missed every one.")] },
        { text: "Keep Monday, but open it to every agency. Same-day is within 10 days.",
          outcome: [D("dot", "Opening it up is right. But the review should be at least 3 business days after the report, so people have time to read it.")] },
        { text: "Run it Chad's way. For Class C the review is only a SHOULD.",
          outcome: [D("ao", "We use Halcyon Gov too. Why weren't we invited?"),
                    D("dot", "For Class C, hosting the review is a MUST, and it's open to all necessary parties.")] },
        { text: "Wait 3 to 10 business days, open it to everyone, and bring the partner too.",
          outcome: [D("dot", "Almost. Providers should not invite third parties unless they're specifically relevant. Your independent assessor is relevant by default. A sales partner usually isn't.")] }
      ] },
    { setup: [D("ciso", "Pam's draft assessment report has a finding that reads badly. Can we soften the wording before it goes into the certification package?")],
      prompt: "What do you do with Pam's finding?",
      choices: [
        { text: "Include it unchanged. We can add our response, but Pam's wording stays.", correct: true,
          outcome: [D("ciso", "Fine. Then let's make our response excellent."),
                    D("dot", "Right. Providers must include assessment results in the package without inappropriate modification. Your response can sit alongside them.")] },
        { text: "Edit it. We own the certification package and answer for its contents.",
          outcome: [D("pam", "If my findings get rewritten, my firm stops signing your reports."),
                    D("dot", "Owning the package doesn't mean editing the assessor's results. They go in without inappropriate modification.")] },
        { text: "Ask Pam to drop it. Providers may ask for and accept assessor advice.",
          outcome: [D("dot", "You may accept advice, but not in a way likely to compromise the assessor's objectivity. Asking an assessor to drop a finding does exactly that.")] },
        { text: "Leave it out, then show it fixed at next year's assessment.",
          outcome: [D("dot", "Omitting a finding is the most inappropriate modification of all. And findings from this assessment must be retested next time anyway.")] }
      ] }
  ], [[15, "The mines are yours. Not one trap stuck."], [12, "Strong shift. Re-check the timing rules."], [8, "The details bit you. Review changes and reviews."], [0, "Long night. Run it again."]]);

  /* ---------- Watchtower: VDR ---------- */
  const vdrN = night("vdr", "WATCHTOWER", [
    D("dot", "Night watch, {name}. Halcyon Gov is Class C. The detection rules all sound alike after midnight, so read slowly."),
  ], [
    D("raj", "The tower's quiet. Which is exactly when I get nervous.")
  ], [
    { setup: [D("raj", "We run 200 identical containers built from one image. Scanning all of them is expensive. Can we scan a sample instead?")],
      prompt: "Can Halcyon sample the containers?",
      choices: [
        { text: "Yes, unless it weakens detection. Class C samples at least every 3 days.", correct: true,
          outcome: [D("dot", "Right. Providers may sample effectively identical resources unless sampling hurts detection, and Class C should run detection on representative samples at least every 3 days.")] },
        { text: "No. VDR requires detection on every machine-based resource, individually.",
          outcome: [D("dot", "Too strict. Sampling effectively identical resources is explicitly allowed, unless it reduces detection's effectiveness.")] },
        { text: "Yes. Sample monthly, to match the monthly verification requirement.",
          outcome: [D("dot", "Sampling is fine, but monthly is the verification and validation floor. Representative samples of similar machines should get detection at least every 3 days for Class C.")] },
        { text: "Yes. Scan one container daily; one sample covers identical machines.",
          outcome: [D("pam", "Daily is a Class D cadence, and a single sample may not be representative."),
                    D("dot", "Representative is the word to watch. One container may not represent 200, and the Class C cadence for samples is every 3 days.")] }
      ] },
    { setup: [D("raj", "Our config tool reports drift on 12 hosts almost every night. I'd like to run detection on them monthly, like everything else.")],
      prompt: "How often should the drift-prone hosts get detection?",
      choices: [
        { text: "At least every 14 days. Monthly is for hosts not likely to drift.", correct: true,
          outcome: [D("dot", "Right. For Class C, resources likely to drift should get detection at least every 14 days. Monthly applies to resources not likely to drift.")] },
        { text: "Monthly is fine. That's the Class C minimum for every resource.",
          outcome: [D("dot", "Monthly is the floor for resources not likely to drift. Drift-prone ones should be checked at least every 14 days for Class C.")] },
        { text: "Daily. Anything that drifts needs detection every day.",
          outcome: [D("raj", "Daily is a lot of scanning for hosts we already watch."),
                    D("dot", "Daily is the Class D cadence for samples. For Class C, drift-prone resources should get detection at least every 14 days.")] },
        { text: "Every 3 days, since drift-prone hosts count as samples of similar machines.",
          outcome: [D("dot", "That's mixing two rules. Every 3 days is for representative samples of similar machines. Drift-prone resources are every 14 days for Class C.")] }
      ] },
    { setup: [D("raj", "A KEV is in production. I've fully mitigated it with a firewall rule and network isolation. The catalog due date is in 9 days, but the vendor patch arrives in 30.")],
      prompt: "What now for the mitigated KEV?",
      choices: [
        { text: "Remediate by the catalog date anyway, barring a valid technical reason.", correct: true,
          outcome: [D("raj", "Calling the vendor's escalation line. Wish me luck."),
                    D("dot", "Right. KEVs should be remediated by the CISA catalog's due date even if fully mitigated, unless there's a valid technical reason they can't be.")] },
        { text: "Fully mitigated means done. Close it, since the risk to agencies is now gone.",
          outcome: [D("dot", "A fully mitigated vulnerability still exists until it's remediated. And KEVs should be remediated by the catalog date even when fully mitigated.")] },
        { text: "Once fully mitigated, a KEV moves to the normal PAIN timeframes instead.",
          outcome: [D("dot", "The catalog due date still applies to KEVs, even fully mitigated ones.")] },
        { text: "Mark it accepted, since the fix is in the vendor's hands, not ours.",
          outcome: [D("ao", "You're accepting a known exploited vulnerability because a vendor is slow?"),
                    D("dot", "Accepted is for vulnerabilities you don't intend to fully fix, or that pass the 192-day limit. You intend to fix this one.")] }
      ] },
    { setup: [D("raj", "Your team built a FedRAMP dashboard that pulls straight from our vulnerability tracker and adds FedRAMP fields. Isn't a compliance-run process exactly what FedRAMP discourages? Should we kill it?")],
      prompt: "What happens to the dashboard?",
      choices: [
        { text: "Keep it. It reads engineering's data directly, which is the point.", correct: true,
          outcome: [D("raj", "Huh. So the problem was never compliance. It was copying."),
                    D("dot", "Right. The discouraged pattern is a FedRAMP-only process run by compliance unless it consumes data directly from the teams who maintain the system.")] },
        { text: "Kill it. FedRAMP discourages vulnerability processes run by compliance.",
          outcome: [D("dot", "Too broad. The concern is processes that don't consume engineering's data directly. A dashboard on top of the real tracker is fine.")] },
        { text: "Keep it, but as a curated monthly export so compliance controls the view.",
          outcome: [D("dot", "That turns a good dashboard into the problem: a separate process drifting from engineering's data.")] },
        { text: "Keep it, and make it the system of record so reporting has one owner.",
          outcome: [D("raj", "So engineers now update your dashboard instead of their tracker? Hard no."),
                    D("dot", "It works because it reads engineering's data. Moving the source of truth to compliance creates the split FedRAMP warns about.")] }
      ] },
    { setup: [D("player", "During a quarterly check, I find the on-call runbook and the incident response statement in our Security Decision Record both describe a paging tool we retired in the spring.")],
      prompt: "How do you treat the stale runbook and SDR statement?",
      choices: [
        { text: "As vulnerabilities. Detection includes checking things work as documented.", correct: true,
          outcome: [D("dot", "Right. Detection covers verifying that processes operate as documented, and FedRAMP's own example of a vulnerability is an out-of-date control statement in the SDR.")] },
        { text: "As documentation updates for the next assessment, not vulnerabilities.",
          outcome: [D("dot", "FedRAMP's own example says otherwise: an out-of-date control statement in the Security Decision Record is a vulnerability.")] },
        { text: "Only the runbook counts, since it affects operations. The SDR is paperwork.",
          outcome: [D("pam", "The SDR is what agencies rely on. 'Just paperwork' is the vulnerability."),
                    D("dot", "Both count. FedRAMP specifically names an out-of-date SDR control statement as a vulnerability.")] },
        { text: "As a note in the next quarterly report. Documentation drift is operational.",
          outcome: [D("dot", "Footnoting it skips the response process. Out-of-date control statements are vulnerabilities and get tracked like any other.")] }
      ] }
  ], [[15, "Nothing gets past you on the wall."], [12, "Good watch. Mind the cadences."], [8, "A few traps landed. Review the detection rules."], [0, "The tower fell asleep. Try again."]]);

  /* ---------- Oracle: VER ---------- */
  const verN = night("ver", "ORACLE", [
    D("dot", "The Oracle at night, {name}. Halcyon Gov is Class C. These findings were chosen because they're ambiguous.")
  ], [
    D("raj", "I brought the weird ones.")
  ], [
    { setup: [D("raj", "Our internet-facing API passes uploaded files to an internal image service. The flaw is in the image service. The API is fully patched.")],
      prompt: "Which component is internet-reachable?",
      choices: [
        { text: "The image service. IRV belongs to the resource that processes the payload.", correct: true,
          outcome: [D("dot", "Right. A vulnerability is internet-reachable if an internet-originating payload might trigger it, even without a direct route, and the label applies to the specific resource processing the payload.")] },
        { text: "Neither. The image service has no internet route, and the API is patched.",
          outcome: [D("pam", "Every file your users upload reaches that service."),
                    D("dot", "No direct route doesn't mean unreachable. If an internet payload can trigger it, it's IRV.")] },
        { text: "The API, since it faces the internet and accepts the payload.",
          outcome: [D("dot", "The API isn't vulnerable. The label goes on the resource that processes the payload and has the flaw.")] },
        { text: "Both the API and the image service, since the payload passes through both.",
          outcome: [D("dot", "The IRV label applies only to the specific resource processing the payload, which is the vulnerable image service.")] }
      ] },
    { setup: [D("raj", "One outdated library shows up as 300 findings across a dozen services. I'd like to handle them as one item instead of 300.")],
      prompt: "Can the 300 findings be handled as one?",
      choices: [
        { text: "Yes. Group them into a logical set, and response rules apply to the group.", correct: true,
          outcome: [D("raj", "One ticket instead of 300. I'm emotional."),
                    D("dot", "Right. Providers should group vulnerabilities into logical sets, and the response rules then apply to the group as a whole.")] },
        { text: "No. Every finding has to be tracked separately, or grouping will hide the risk.",
          outcome: [D("dot", "VER explicitly says providers should group vulnerabilities into logical sets. The response rules then apply to each group.")] },
        { text: "Yes, rated at the lowest PAIN among the 300, so the deadline is realistic.",
          outcome: [D("ao", "So the instance in our records service gets the build tool's deadline?"),
                    D("dot", "Grouping is right. Rating the group by its mildest member understates the risk where it matters most.")] },
        { text: "Group them in the monthly report, but keep 300 separate deadlines.",
          outcome: [D("dot", "That keeps the workload and loses the point. When grouped, the response rules apply to the group.")] }
      ] },
    { setup: [D("raj", "Likely exploitable, N5, in a backend service that is not internet-reachable. We're Class C. Is it a reportable incident?")],
      prompt: "How do you handle the non-reachable N5?",
      choices: [
        { text: "Optional for Class C, but it still needs mitigating below N5 within 4 days.", correct: true,
          outcome: [D("dot", "Right. For a non-internet-reachable LEV at N5, treating it as reportable is a MAY for Class C and a SHOULD for Class D. The Class C clock for an N5 LEV that isn't reachable is 4 days.")] },
        { text: "Yes. It SHOULD be treated as reportable until it's mitigated to N4 or below.",
          outcome: [D("dot", "That's the Class D rule. For Class C, treating a non-reachable N5 LEV as reportable is a MAY.")] },
        { text: "No, and because it isn't reachable, it gets the 16-day clock.",
          outcome: [D("pam", "Sixteen days is for findings that aren't likely exploitable. This one is."),
                    D("dot", "Reachability and exploitability are separate inputs. An N5 LEV that isn't reachable gets 4 days in Class C.")] },
        { text: "Yes. Every N5 finding is automatically a FedRAMP reportable incident.",
          outcome: [D("dot", "Not automatically. It depends on reachability, exploitability and Class. For this one in Class C, it's optional.")] }
      ] },
    { setup: [D("raj", "This finding was detected 200 days ago, but after a backlog it was only evaluated 150 days ago. Is it an accepted vulnerability yet?")],
      prompt: "Is the finding an accepted vulnerability yet?",
      choices: [
        { text: "Not yet. The clock runs from evaluation, though the slow evaluation is a problem.", correct: true,
          outcome: [D("dot", "Right. Accepted status comes at 192 days from evaluation. And Class C evaluation should happen within 5 days of detection, so the backlog itself needs fixing.")] },
        { text: "Yes. The 192 days run from detection, and it was detected 200 days ago.",
          outcome: [D("dot", "The rule counts 192 days from evaluation, not from detection.")] },
        { text: "Not yet, and the late evaluation doesn't matter, since no deadline was missed.",
          outcome: [D("pam", "A 50-day evaluation lag doesn't matter?"),
                    D("dot", "The 192-day answer is right, but evaluation should happen within 5 days of detection for Class C. Fifty days is a problem worth fixing.")] },
        { text: "Not yet. The 192-day clock restarts every time the PAIN rating changes.",
          outcome: [D("dot", "There's no restart. The clock runs from evaluation, and rating reductions are tracked along the way.")] }
      ] },
    { setup: [D("ao", "There's an open N4 on Halcyon Gov. I'd like the full exploit details so I can brief my security operations team.")],
      prompt: "What do you share with the agency?",
      choices: [
        { text: "Enough to make risk decisions, without an exploit recipe.", correct: true,
          outcome: [D("ao", "That works. My team needs to know what to watch for, not how to build it."),
                    D("dot", "Right. Don't irresponsibly disclose details that enable exploitation, but share enough for informed risk decisions with all necessary parties.")] },
        { text: "Send the full proof of concept. Agencies are necessary parties.",
          outcome: [D("raj", "The PoC is now in a shared drive with 400 people on it."),
                    D("dot", "Necessary parties get what they need for risk decisions. Exploitation-enabling details shouldn't be shared irresponsibly, even with them.")] },
        { text: "Decline. Vulnerability details can't be shared until the fix is complete.",
          outcome: [D("dot", "Too closed. VER requires sharing enough for all necessary parties to make informed risk decisions.")] },
        { text: "Publish a public advisory so every agency gets the same information.",
          outcome: [D("dot", "Public disclosure is a MAY, only if it's unlikely to lead to exploitation. For an open N4, it likely would.")] }
      ] }
  ], [[15, "Even the Oracle is taking notes."], [12, "Strong judgment. Watch the class-specific rules."], [8, "Some cases fooled you. Revisit reachability and clocks."], [0, "The Oracle sighs. Try again."]]);

  /* ---------- Crossroads: 20x ---------- */
  const twentyxN = night("twentyx", "CROSSROADS", [
    D("dot", "The Crossroads after dark, {name}. Halcyon Analytics Gov is pursuing 20x. The easy questions are behind you.")
  ], [
    D("ciso", "Analytics Gov goes 20x. Help me avoid the expensive mistakes.")
  ], [
    { setup: [D("raj", "For Class B, two of our KSIs can only be checked by a human right now. Everything else is automated.")],
      prompt: "What does Class B expect for the two manual KSIs?",
      choices: [
        { text: "Document why those two are manual and plan to automate them. It's a SHOULD.", correct: true,
          outcome: [D("dot", "Right. For Class B, at least one automated verification and validation method per KSI is a SHOULD. A SHOULD you don't meet needs a real, documented reason.")] },
        { text: "Those two block Class B. Every KSI MUST have an automated validation method.",
          outcome: [D("dot", "For Class B the automation rule is a SHOULD, not a MUST. It needs justification, not a full stop.")] },
        { text: "Nothing to do. Automation is optional at Class B, so no explanation.",
          outcome: [D("pam", "A SHOULD isn't a shrug. Where's the justification?"),
                    D("dot", "SHOULD means do it unless you have a real, documented reason not to. Optional-with-no-explanation is the wrong reading.")] },
        { text: "Swap those two for KSIs we can automate. Class B lets us pick.",
          outcome: [D("dot", "Class B has a few optional KSIs, but you don't get to substitute ones you can't automate. Applicable KSIs still need evidence.")] }
      ] },
    { setup: [D("raj", "For our Class C package, I can export a really nice screenshot of today's KSI dashboard. All green.")],
      prompt: "Is today's dashboard enough evidence for Class C?",
      choices: [
        { text: "No. The SDR needs a 30-day summary of each KSI metric.", correct: true,
          outcome: [D("raj", "Thirty days of history. Good thing we kept logs. We kept logs, right?"),
                    D("dot", "Right. For 20x Class C, the SDR must include historical metrics, at least a 30-day summary for each applicable KSI.")] },
        { text: "Yes, if it's machine-readable. 20x cares about format more than history.",
          outcome: [D("dot", "Format matters, but so does history. Class C requires a 30-day summary for each KSI in the SDR.")] },
        { text: "No. It needs a full year of KSI history, to match the annual assessment cycle.",
          outcome: [D("dot", "Too much. The Class C rule is a summary of each metric over the past 30 days.")] },
        { text: "Yes, if the assessor confirms the dashboard matches production that day.",
          outcome: [D("pam", "I can confirm one day. Your SDR still needs thirty."),
                    D("dot", "Assessor confirmation doesn't replace history. The SDR must include a 30-day summary for each KSI.")] }
      ] },
    { setup: [D("ao", "We sponsored your Rev 5 authorization. We'd happily sponsor Analytics Gov's 20x certification too.")],
      prompt: "How does sponsorship work for 20x?",
      choices: [
        { text: "20x is Program path only. FedRAMP certifies directly; the agency still decides.", correct: true,
          outcome: [D("ao", "Less paperwork for me. I'm not complaining."),
                    D("dot", "Right. The Agency path is legacy and exists only for Rev 5. 20x certifications go through the Program path.")] },
        { text: "Accept. An agency sponsor is still the fastest route to a 20x certification.",
          outcome: [D("dot", "There's no agency sponsorship route for 20x. The Agency path exists only for Rev 5.")] },
        { text: "Accept, but only for Class D, the one 20x class that still uses agency sponsors.",
          outcome: [D("dot", "No 20x class uses agency sponsorship. 20x is Program path only.")] },
        { text: "Decline. On 20x, agencies no longer decide whether to use the service.",
          outcome: [D("ao", "We absolutely still decide what we use."),
                    D("dot", "The path changes who certifies. Agencies still make their own risk-based decisions to use a service.")] }
      ] },
    { setup: [D("chad", "Once we're 20x certified, we can stop paying assessors. The KSIs validate themselves all day long.")],
      prompt: "What about independent assessment under 20x?",
      choices: [
        { text: "No. Classes B to D still need an independent assessment at least once a year.", correct: true,
          outcome: [D("chad", "So the robots and Pam."),
                    D("dot", "Right. Persistent validation doesn't replace the annual independent assessment for Classes B through D.")] },
        { text: "Correct. Persistent validation replaces the annual assessment under 20x.",
          outcome: [D("dot", "Persistent validation is in addition to it, not instead of it. Classes B to D need an independent assessment at least once a year.")] },
        { text: "Assessments drop to every 3 years, since KSIs are validated continuously.",
          outcome: [D("dot", "Three years is the Rev 5 window for covering all controls. The independent assessment is still at least once a year for Classes B to D.")] },
        { text: "Assessments happen only when we change class or make a transformative change.",
          outcome: [D("pam", "I'll see you next year either way."),
                    D("dot", "Those events can trigger assessment work, but the at-least-annual independent assessment still applies to Classes B to D.")] }
      ] },
    { setup: [D("chad", "A contractor will write our KSI evidence by hand from engineer interviews and format it as JSON. Fast and machine-readable!")],
      prompt: "Should Halcyon buy the contractor's hand-written evidence?",
      choices: [
        { text: "No. KSI evidence should come from persistent validation of the real systems.", correct: true,
          outcome: [D("raj", "Interviews converted to JSON. I've seen the future and it's a Word doc."),
                    D("dot", "Right. KSIs aren't one-time requirements. FedRAMP expects continuous evidence collection and says KSIs aren't a traditional compliance exercise.")] },
        { text: "Yes. 20x requires machine-readable evidence, and JSON is machine-readable.",
          outcome: [D("dot", "Machine-readable is necessary, not sufficient. The point is evidence that comes persistently from the systems themselves.")] },
        { text: "Yes, as long as each engineer signs an attestation that the JSON is accurate.",
          outcome: [D("pam", "So the evidence is a signed narrative?"),
                    D("dot", "An attestation is still a narrative. KSIs are meant to be demonstrated with persistent, measured evidence.")] },
        { text: "Yes, for the first submission only, then switch to automated evidence.",
          outcome: [D("dot", "Starting with hand-built evidence means certifying on something that isn't persistent validation. Build the real pipeline first.")] }
      ] }
  ], [[15, "You'd make a fine 20x program lead."], [12, "Solid. Mind the class-specific rules."], [8, "The traps got you. Revisit the 20x rules."], [0, "Lost at the crossroads. Try again."]]);

  window.FQ_NIGHT = { foundations_n: foundationsN, conmon_n: conmonN, vdr_n: vdrN, ver_n: verN, twentyx_n: twentyxN };
})();
