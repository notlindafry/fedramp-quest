"use strict";
/* ============================================================
   FedRAMP Quest content: modules 1, 2, 4 and 5.
   Module 3 (VDR) lives in game.js.
   Checked against fedramp.gov (Consolidated Rules for 2026) on 2026-11-13.
   Facts taken from secondary sources are marked in the recap cards.
   ============================================================ */
(function () {
  const D = (who, text) => ({ who, text });
  const SRC = {
    cert: "FedRAMP Rev5 Certification rules: https://www.fedramp.gov/2026/providers/rev5/rules/fedramp-certification/",
    defs: "FedRAMP definitions (CR26): https://www.fedramp.gov/2026/definitions/",
    cls: "Choose a Class: https://www.fedramp.gov/2026/providers/start/class/",
    pkg: "Rev5 Package rulesets: https://www.fedramp.gov/2026/providers/rev5/package/",
    rev5dl: "Rev5 deadlines: https://www.fedramp.gov/2026/providers/updating/deadlines/rev5/",
    scn: "Significant Change Notification (Rev5): https://www.fedramp.gov/2026/providers/rev5/rules/significant-change-notification/",
    ccm: "Collaborative Continuous Monitoring (Rev5): https://www.fedramp.gov/2026/providers/rev5/rules/collaborative-continuous-monitoring/",
    ivv: "Independent Verification and Validation (Rev5): https://www.fedramp.gov/2026/providers/rev5/rules/independent-verification-and-validation/",
    ver: "Vulnerability Evaluation and Reporting (Rev5): https://www.fedramp.gov/2026/providers/rev5/rules/vulnerability-evaluation-and-reporting/",
    vdr: "Vulnerability Detection and Response (Rev5): https://fedramp.gov/2026/providers/rev5/rules/vulnerability-detection-and-response/",
    ksi: "Key Security Indicators: https://www.fedramp.gov/2026/providers/20x/key-security-indicators/",
    x20: "FedRAMP 20x certification rules: https://www.fedramp.gov/2026/providers/20x/"
  };

  /* ---------------- Module 1: Rev 5 foundations ---------------- */
  const FOUNDATIONS = {
    id: "foundations",
    title: "HALCYON HQ",
    primerScene: "office",
    scenarioScene: "office",
    primer: [
      D("dot", "Welcome to Halcyon HQ, {name}. Before the deadlines and the drama, you need the map: what FedRAMP is, and what Halcyon Gov actually holds."),
      D("dot", "FedRAMP is the federal government's program for trusting cloud services. The idea is to assess a cloud service once, to a common standard, so every agency doesn't start from scratch."),
      D("dot", "For Rev 5, the yardstick is NIST SP 800-53 Revision 5, a big catalog of security and privacy controls. FedRAMP draws baselines from it by impact level: Low, Moderate and High, depending on how bad a breach of the data would be."),
      D("dot", "The Rev 5 baselines run roughly 156 controls for Low, 323 for Moderate and 410 for High. Halcyon Gov was assessed at Moderate."),
      D("dot", "The vocabulary changed this year. Under the Consolidated Rules for 2026, FedRAMP talks about certification, and every offering has a Certification Profile with three parts: a Type, a Path and a Class."),
      D("dot", "Type is the method. Rev 5 is the legacy approach, built mostly on documented plans. 20x is the newer approach, built mostly on measured outcomes. Halcyon Gov is Type Rev 5."),
      D("dot", "Path is who stands behind it. On the Agency path, a sponsoring agency issues an Authorization to Operate, or ATO, and FedRAMP reviews it. The Program path is a direct FedRAMP certification. The Agency path is legacy and exists only for Rev 5."),
      D("dot", "Class is the level of assurance, from Class A, the minimum, up to Class D, the most significant. Classes loosely track Low, Moderate and High, but FedRAMP says there's no direct mapping. Halcyon Gov's Moderate lines up most closely with Class C."),
      D("player", "So we're Rev 5, Agency path, Class C."),
      D("dot", "Look at you, speaking fluent bureaucrat."),
      D("dot", "Next, the boundary. The authorization boundary is the line around everything the certification covers: the servers, services, data flows and people that run Halcyon Gov. Anything outside that line isn't covered, however similar it looks."),
      D("dot", "That matters because Halcyon also sells a commercial product. Same brand, same feature list in Chad's slides, different boundary. A feature exists for federal customers only once it's inside Halcyon Gov's boundary and assessed."),
      D("dot", "Outside services that touch federal data, like a logging tool or an email provider, generally need their own FedRAMP certification, or the gap has to be documented and accepted as a risk by the agency. Shiny new SaaS tools are where boundaries go to die."),
      D("dot", "Now the cast. The provider, which is us, owns the system and the package and is accountable for its accuracy. The sponsoring agency's authorizing official decides whether to accept the risk and signs the ATO. FedRAMP reviews and runs the program."),
      D("dot", "Then the assessor. Most people still say 3PAO, short for third party assessment organization. The 2026 rules call it a FedRAMP Recognized independent assessment service. Pam's firm is one. Assessors test and report. They don't accept risk."),
      D("dot", "The package is the evidence. In the classic Rev 5 world, that's the System Security Plan or SSP, the security assessment plan and report, and the POA&M, the Plan of Action and Milestones that tracks open weaknesses."),
      D("dot", "The 2026 rules replace the SSP with a Security Decision Record, a living record of security decisions, plus a short Certification Package Overview. For Rev 5, new certifications need them from January 1, 2027, and existing ones phase in during 2027."),
      D("dot", "One more rule worth knowing. Changing Class, up or down, requires a new certification with every requirement met first. You can't just announce that you're High now."),
      D("dot", "That's the lay of the land. Your recap card is next. Then Chad has promised somebody something, which is how most of my mornings started.")
    ],
    recap: {
      title: "Rev 5 foundations",
      terms: [
        ["FedRAMP", "The federal program that assesses a cloud service once, to a common standard, so agencies can reuse that assessment."],
        ["Rev 5 baselines", "Control sets drawn from NIST SP 800-53 Rev. 5 by impact level: roughly 156 (Low), 323 (Moderate) and 410 (High). Counts come from secondary sources; verify against the current baselines."],
        ["Certification Profile", "Type + Path + Class. Halcyon Gov: Type Rev 5, Agency path, Class C."],
        ["Type", "Rev 5 (legacy, based mainly on documented plans) or 20x (based mainly on measured outcomes)."],
        ["Path", "Agency (a sponsoring agency issues an ATO; legacy and Rev 5 only) or Program (direct FedRAMP certification)."],
        ["Class", "A (minimal assurance) to D (significant assurance). Classes loosely track Low, Moderate and High with no direct mapping."],
        ["Authorization boundary", "Everything the certification covers. Anything outside it isn't covered, including look-alike commercial features."],
        ["Who accepts risk", "On the Agency path, the sponsoring agency's authorizing official accepts risk by signing the ATO. Assessors test and report; FedRAMP reviews."],
        ["Assessor", "Commonly called a 3PAO. The 2026 rules say FedRAMP Recognized independent assessment service."],
        ["Package", "Classic Rev 5: SSP, assessment plan and report, POA&M. CR26 replaces the SSP with a Security Decision Record and a Certification Package Overview (Rev 5: required for new certifications from 2027-01-01; existing ones by mid-2027)."],
        ["Class change", "Upgrading or downgrading class requires a new certification with all requirements met in advance."]
      ],
      sources: [SRC.cert, SRC.defs, SRC.cls, SRC.pkg, SRC.rev5dl]
    },
    scenario: {
      title: "CHAD PROMISED THEM THE AI FEATURE",
      intro: [
        D("chad", "{name}! Welcome aboard. I have a few small, totally normal questions."),
        D("player", "That sentence has never once been true, Chad.")
      ],
      decisions: [
        {
          setup: [D("chad", "I told an agency that our new AI summarizer is available in Halcyon Gov. It's in the commercial product, so it's basically in Gov, right?")],
          prompt: "Is the AI summarizer available to federal customers?",
          choices: [
            { text: "Not yet. It's outside Halcyon Gov's boundary, so it has to be built into the boundary and assessed before federal customers can use it.", correct: true,
              outcome: [D("chad", "Can we say 'coming soon'?"), D("player", "We can say 'not yet.'"),
                        D("dot", "Right. The boundary defines what the certification covers. Same brand doesn't mean same boundary.")] },
            { text: "Yes. Same codebase, same features.",
              outcome: [D("ao", "Your sales team says the AI feature is covered by your FedRAMP authorization. Your package doesn't mention it anywhere."),
                        D("dot", "Code in the commercial product isn't covered because it shares a name. Only what's inside the boundary and assessed is covered.")] },
            { text: "Yes, as long as federal users only use it for non-sensitive data.",
              outcome: [D("raj", "Update: the first thing a federal user pasted in was a case file."),
                        D("dot", "Boundaries aren't drawn by how users promise to behave. A feature outside the boundary isn't covered, whatever data people intend to put in it.")] }
          ]
        },
        {
          setup: [D("raj", "Engineering wants to send Halcyon Gov's logs to SnazzyLogs, a commercial logging tool. It's genuinely great. It has no FedRAMP certification.")],
          prompt: "Can Halcyon Gov's logs go to SnazzyLogs?",
          choices: [
            { text: "Hold off. A service receiving Halcyon Gov's data needs its own FedRAMP certification, or the gap has to be documented and accepted as a risk by the agency first.", correct: true,
              outcome: [D("raj", "So it's a certified logging vendor or a very awkward meeting. Got it."),
                        D("dot", "Exactly. Outside services that touch federal data are part of the risk the agency accepts, so they can't be added quietly.")] },
            { text: "Go ahead. Logs aren't customer data.",
              outcome: [D("pam", "Your logs include federal users' IDs and request contents. Where's the authorization for SnazzyLogs?"),
                        D("dot", "Logs often carry federal data. Treat any service that receives them as part of the risk picture.")] },
            { text: "Go ahead, and add it to the documentation at next year's assessment.",
              outcome: [D("ao", "So federal data has been flowing to an unassessed service for a year, and I'm hearing about it now?"),
                        D("dot", "Documenting it later means the agency never got to make the call. That decision belongs to the agency before the data moves.")] }
          ]
        },
        {
          setup: [D("ao", "Quick question for your new GRC lead. Who decided Halcyon Gov was acceptable for my agency to use?")],
          prompt: "Who accepted the risk of using Halcyon Gov?",
          choices: [
            { text: "Your agency's authorizing official, when they signed the ATO. The assessor tested the system and FedRAMP reviewed it, but the risk decision was your agency's.", correct: true,
              outcome: [D("ao", "Correct. And I'd like to keep it that way."),
                        D("dot", "Assessors assess, FedRAMP reviews, and on the Agency path the agency accepts the risk. Keep those three straight and half your meetings get shorter.")] },
            { text: "The 3PAO. They passed us.",
              outcome: [D("pam", "Please never put that in writing. We test and report. We don't accept anyone's risk."),
                        D("dot", "Assessors don't accept risk. On the Agency path, the authorizing official does that when they sign the ATO.")] },
            { text: "FedRAMP. They issued the authorization.",
              outcome: [D("ao", "I signed that ATO myself. I remember the coffee."),
                        D("dot", "On the Agency path, the sponsoring agency issues the ATO and its authorizing official accepts the risk. FedRAMP reviews and approves it for the program.")] }
          ]
        },
        {
          setup: [D("chad", "A prospect at another agency wants proof we're secure. Can I just email them our whole security package? It's a big PDF. Very convincing.")],
          prompt: "How should a prospect see Halcyon Gov's security package?",
          choices: [
            { text: "Start them at Halcyon Gov's FedRAMP Marketplace listing, and share the package only through the controlled channel set up for agencies.", correct: true,
              outcome: [D("chad", "Fine. Can I at least send them a nice logo?"),
                        D("dot", "Good. A package describes exactly how the system is protected, so it goes to agencies through controlled channels. The Marketplace listing is where a prospect starts.")] },
            { text: "Sure, email it. They're a federal agency.",
              outcome: [D("raj", "Fun update. The PDF got forwarded to a contractor's personal email."),
                        D("dot", "The package holds sensitive details about the system's defenses. Uncontrolled email is how it ends up somewhere it shouldn't.")] },
            { text: "Post it on the website so everyone can see how secure we are.",
              outcome: [D("pam", "You've published your security architecture. Attackers thank you for the reading material."),
                        D("dot", "Some certification information is meant to be public, like the Marketplace listing. The detailed package isn't.")] }
          ]
        },
        {
          setup: [D("chad", "Last one! A new customer needs High. We'll just tell them we're High now. We're basically secure.")],
          prompt: "Can Halcyon Gov start calling itself High?",
          choices: [
            { text: "No. Moving up a class requires a new certification with all requirements met first. Let's scope what it would take before promising anything.", correct: true,
              outcome: [D("ciso", "Thank you. Bring me a cost and a timeline, not a press release."),
                        D("dot", "Right. Upgrading class means a new certification, met in advance. High also adds many controls beyond Moderate, so the scope is real work.")] },
            { text: "Yes, if we file a significant change notice.",
              outcome: [D("pam", "You can't notice your way into a higher class."),
                        D("dot", "Changing the impact level of the whole offering is a class change. It needs a new assessment, and significant change rules can't be used for it.")] },
            { text: "Yes, once the assessor signs off on a few extra controls.",
              outcome: [D("ao", "A few extra controls? High isn't a sticker."),
                        D("dot", "There's no partial upgrade. A higher class means a new certification with every requirement met before you claim it.")] }
          ]
        }
      ],
      verdicts: [[15, "You understand the map better than half my leadership team."], [12, "Good grounding. Keep Chad on a short leash."], [8, "Getting there. Review the Profile before your next agency call."], [0, "Let's run this one again before you meet the agency."]]
    }
  };

  /* ---------------- Module 2: Continuous monitoring ---------------- */
  const CONMON = {
    id: "conmon",
    title: "CONMON MINES",
    primerScene: "mine",
    scenarioScene: "office",
    primer: [
      D("dot", "Welcome to the ConMon Mines, {name}. Certification isn't a finish line. Continuous monitoring is how you keep proving that Halcyon Gov is still the system that was assessed."),
      D("dot", "Classic Rev 5 continuous monitoring runs monthly. Each month the provider sends its agency customers vulnerability scan results, an updated POA&M and an updated inventory."),
      D("dot", "The POA&M, Plan of Action and Milestones, is the quest log. Every open weakness gets an owner, a plan and a due date. A POA&M full of overdue items tells an agency you're losing ground."),
      D("dot", "When a finding needs special handling, the classic process uses deviation requests: a false positive, a risk adjustment that lowers severity, or an operational requirement when a fix would break the service. Each needs evidence, and the agency decides."),
      D("dot", "Once a year, an independent assessor retests the system. Under the 2026 rules, Class B, C and D need that assessment at least once a year. Each one must include a set list of Rev 5 controls for your class, and every applicable control must be covered within 3 years."),
      D("dot", "One rule I'm fond of: controls with negative findings in the previous assessment MUST be included in the next one. Assessors don't forget, and now the rules don't either."),
      D("dot", "Change is the other half of the grind. Under classic Rev 5, a significant change, like a new data center or a new core component, needs a significant change request that the agency approves before you make it."),
      D("dot", "The 2026 rules replace that with Significant Change Notifications. For Rev 5 they're required from January 1, 2027, and existing certifications have until June 1, 2027."),
      D("dot", "Under the new rules, changes come in types. Routine recurring changes, like patching or scaling capacity, need no formal notification at all."),
      D("dot", "Adaptive changes are improvements that don't add significant new risk, like a like-for-like component swap. You notify all necessary parties within 10 business days after you finish."),
      D("dot", "Transformative changes alter the risk profile, like replacing a critical third-party service or migrating a data center full of federal data. You notify initial plans at least 30 business days before you start and final plans at least 10 business days before, then send updates after you finish and after it's assessed."),
      D("player", "Notice, not approval?"),
      D("dot", "Notice. Agencies stay informed and make their own risk calls. Every notification also has to include your impact analysis and the name and title of the person who approved the change on your side."),
      D("dot", "One exception: changing the impact level of the whole offering is a class change. That needs a new assessment, not a notification. And in a genuine emergency you may change first, but you owe the notifications and an assessment afterward."),
      D("dot", "The monthly package itself is changing too. Collaborative Continuous Monitoring brings an Ongoing Certification Report every 3 months, plus a live quarterly review. Class C providers MUST host that review."),
      D("dot", "The report summarizes changes since the last one, planned changes for the next 3 months, accepted vulnerabilities, transformative changes, which agencies use the service, and any reportable incidents, or an attestation that there were none."),
      D("dot", "For Rev 5, existing certifications should adopt it by April 2, 2027, and must by October 1, 2027. Separately, VER requires a human-readable vulnerability report at least monthly from December 7, 2026."),
      D("dot", "So the grind is changing shape: from monthly paperwork toward quarterly conversations and persistent data. Until you formally adopt the new rules, expect your agency to keep asking for the classic monthly package. Recap card, then Raj has POA&M news. Bring snacks.")
    ],
    recap: {
      title: "Continuous monitoring",
      terms: [
        ["Classic monthly ConMon", "Each month: vulnerability scan results, an updated POA&M and an updated inventory to agency customers."],
        ["POA&M", "Plan of Action and Milestones: every open weakness with an owner, plan and due date. Overdue items need honest explanations."],
        ["Deviation requests (classic)", "False positive, risk adjustment or operational requirement. Each needs evidence; the agency decides."],
        ["Annual assessment (CR26)", "Class B, C and D: an independent assessment at least once a year, including a class-specific list of Rev 5 controls; all applicable controls covered within 3 years. Controls with negative findings last time MUST be in the next assessment."],
        ["Significant change (classic)", "A significant change request approved by the agency before the change."],
        ["Significant Change Notifications (CR26)", "Rev 5: required from 2027-01-01 for new certifications; existing certifications by 2027-06-01."],
        ["Routine recurring change", "Patching, scaling and similar. No formal notification."],
        ["Adaptive change", "No significant new risk. Notify within 10 business days after finishing."],
        ["Transformative change", "Alters the risk profile. Initial plans at least 30 business days before, final plans at least 10 business days before, updates within 5 business days after finishing and after assessment, docs within 30 business days."],
        ["Class change", "Changing the whole offering's impact level needs a new assessment, not a notification."],
        ["Ongoing Certification Report (CR26)", "Every 3 months, plus a quarterly review (Class C: MUST host). Rev 5 existing certifications: should adopt by 2027-04-02, must by 2027-10-01."],
        ["VER monthly report", "Human-readable vulnerability activity report at least monthly, from 2026-12-07."]
      ],
      sources: [SRC.scn, SRC.ccm, SRC.ivv, SRC.ver, SRC.rev5dl]
    },
    scenario: {
      title: "THE POA&M IS HAUNTED",
      intro: [
        D("raj", "Hey. So the POA&M has a few... ghosts. And Chad has opinions."),
        D("player", "Chad always has opinions. Start with the ghosts.")
      ],
      decisions: [
        {
          setup: [D("raj", "The monthly package is due Friday. Three POA&M items are past their due dates. Chad suggests we just move the dates.")],
          prompt: "What do you do with the three overdue POA&M items?",
          choices: [
            { text: "Keep the dates honest. Mark them overdue, explain why, and give each a realistic new plan in the package.", correct: true,
              outcome: [D("ao", "Thanks for flagging those. A credible plan I can work with."),
                        D("dot", "Overdue items with a credible plan are a conversation. Quietly moved dates are an integrity problem, and agencies notice.")] },
            { text: "Move the due dates out 90 days so nothing shows as overdue.",
              outcome: [D("pam", "Your POA&M history shows these dates moved three times with no explanation. Help me understand."),
                        D("dot", "Moving dates hides the slip without fixing anything. The history is visible, and now trust is the problem instead of three findings.")] },
            { text: "Leave them off this month's package and add them back once they're fixed.",
              outcome: [D("ao", "Three items disappeared from your POA&M last month. Where did they go?"),
                        D("dot", "The POA&M is supposed to be the complete list of open weaknesses. Leaving items off misrepresents the system's state.")] }
          ]
        },
        {
          setup: [D("raj", "A high finding says our web servers run a vulnerable version of a library. They don't. The scanner reads the version wrong.")],
          prompt: "How do you handle a finding Raj says is a false positive?",
          choices: [
            { text: "Collect evidence that the vulnerable version isn't present, then submit it as a false positive for the agency to accept.", correct: true,
              outcome: [D("raj", "Screenshots, package manifests and a very smug comment. On it."),
                        D("dot", "Evidence first. A false positive is a claim, and the agency accepts it based on proof. Under VER you SHOULD also evaluate false positives as part of normal evaluation.")] },
            { text: "Close it. Raj is confident.",
              outcome: [D("pam", "Confidence is lovely. Do you have evidence?"),
                        D("dot", "A finding closes on evidence, not certainty. Without proof, it's still open.")] },
            { text: "Lower it to low severity so it stops mattering.",
              outcome: [D("pam", "So it's not real, but you also kept it, at a lower severity? Which is it?"),
                        D("dot", "Lowering severity is a risk adjustment, a different request with its own justification. Using it to hide a false positive mislabels the problem.")] }
          ]
        },
        {
          setup: [D("raj", "Big one. Next quarter we're moving Halcyon Gov to a new data center region. All the federal data moves with it.")],
          prompt: "Under the 2026 change rules, what does this migration require?",
          choices: [
            { text: "It's a transformative change. Notify all necessary parties of initial plans at least 30 business days before starting, and final plans at least 10 business days before.", correct: true,
              outcome: [D("raj", "Thirty business days. I'll tell the migration team their deadline just moved up."),
                        D("dot", "Right. Data center migrations involving lots of federal data are FedRAMP's own example of a transformative change.")] },
            { text: "It's routine. It's just infrastructure.",
              outcome: [D("ao", "I found out you moved our data to a new region from my own monitoring. Not from you."),
                        D("dot", "Routine means things like patching and scaling. A data center migration with federal data is transformative and needs notice in advance.")] },
            { text: "It's adaptive. Notify everyone within 10 business days after it's done.",
              outcome: [D("pam", "After it's done? The agencies needed a say before their data moved."),
                        D("dot", "Adaptive is for changes that don't add significant new risk. Moving all the federal data is transformative, so the notices come before you start.")] }
          ]
        },
        {
          setup: [D("chad", "Budget idea! Last year's findings are fixed, so let's ask Pam to skip those controls this year. Saves a whole week.")],
          prompt: "Should this year's assessment skip last year's problem controls?",
          choices: [
            { text: "No. Controls with negative findings in the previous assessment must be included in the next one, so they stay in scope.", correct: true,
              outcome: [D("pam", "Good, because I was going to include them anyway."),
                        D("dot", "Correct. Last year's problem controls get retested. Fixed is a claim until an assessor confirms it.")] },
            { text: "Yes. Fixed is fixed.",
              outcome: [D("pam", "I can't skip them. The rules require me to retest last year's findings."),
                        D("dot", "Under the 2026 rules, controls with negative findings in the previous assessment MUST be in the next one.")] },
            { text: "Yes, but keep last year's fix evidence on file in case anyone asks.",
              outcome: [D("ao", "The rules say those controls get retested. Why weren't they?"),
                        D("dot", "Evidence on file doesn't replace the retest. Controls with negative findings MUST be in the next assessment.")] }
          ]
        },
        {
          setup: [D("ciso", "I read that the new rules use quarterly reports and reviews instead of monthly packages. Can your team stop doing monthly ConMon this winter?")],
          prompt: "Should the team stop the monthly ConMon package now?",
          choices: [
            { text: "No. Keep the monthly process until we formally adopt the new rules, and plan the switch ahead of the 2027 deadlines. The VER monthly report starts December 7 either way.", correct: true,
              outcome: [D("ciso", "Sensible. Put the switch on the roadmap so I can see it."),
                        D("dot", "Right. New rules apply when you adopt them or when the deadlines arrive. Until then, your agency expects the process you're on.")] },
            { text: "Yes, stop now. Quarterly is the new standard.",
              outcome: [D("ao", "We didn't get your monthly package. Is everything all right over there?"),
                        D("dot", "Stopping the old process before adopting the new one leaves a gap. Plan the switch; don't just stop.")] },
            { text: "Yes, and skip the quarterly review too. It's optional for us.",
              outcome: [D("pam", "For a Class C offering, hosting the quarterly review isn't optional."),
                        D("dot", "For Class C, the quarterly review is a MUST. It's optional only for Class A.")] }
          ]
        }
      ],
      verdicts: [[15, "Flawless. I didn't know monitoring could be this calm."], [12, "Solid. The POA&M looks less haunted already."], [8, "Okay. Let's keep an eye on those change notices."], [0, "The mines won this round. Try again."]]
    }
  };

  /* ---------------- Module 4: VER ---------------- */
  const VER = {
    id: "ver",
    title: "THE ORACLE",
    primerScene: "oracle",
    scenarioScene: "office",
    primer: [
      D("dot", "Welcome to the Oracle, {name}. VDR taught you to find and fix. VER, Vulnerability Evaluation and Reporting, decides how urgent each finding is and how you tell everyone about it."),
      D("dot", "VER shares VDR's deadline: mandatory on December 7, 2026, with certification kept under a corrective action plan until March 7, 2027. The two rulesets are meant to work as a pair."),
      D("dot", "The old way rated findings mostly by scanner severity and gave you fixed windows, commonly 30 days for high, 90 for moderate and 180 for low. Same score, same clock, whatever the context."),
      D("dot", "VER asks three questions about every finding instead. Is it likely exploitable? Is it internet-reachable? And how bad would it be for agencies if someone exploited it?"),
      D("dot", "Likely exploitable, LEV for short, means a likely attacker could reach it and would probably cause harm. Anything an automated, unauthenticated attacker can exploit over the internet is at least an LEV. Everything else is NLEV."),
      D("dot", "Internet-reachable, or IRV, means a payload from the internet might trigger it, even if the vulnerable component has no direct internet route. A database behind your API can still be reachable if it processes what the API passes along."),
      D("dot", "And a MUST: assume exploitation can be automated unless you have evidence it can't. Optimism is not evidence."),
      D("dot", "Third question: Potential Agency Impact, or PAIN, rated N0 to N5. N0 means exploitation is extremely unlikely to hurt agencies. N3 is a disruptive effect on one agency. N5 is a debilitating effect on more than one."),
      D("dot", "In between: N1 is minimal effects, N2 is narrow effects, and N4 is debilitating for one agency or disruptive for more than one. Nobody named it PAIN by accident."),
      D("dot", "Those three answers plus your Class set the deadline to bring a finding down to a lower rating. For Class C, a likely exploitable, internet-reachable N5 gets 2 days. The same N5, not internet-reachable, gets 4. If it's not likely exploitable, 16."),
      D("dot", "Lower ratings get more time. A likely exploitable, internet-reachable N3 in Class C gets 16 days, and N2 findings range from 48 to 192 days. Below that, you handle things in routine operations."),
      D("player", "So two findings with the same scanner score can have deadlines months apart."),
      D("dot", "Now you're thinking like an oracle."),
      D("dot", "You also have to evaluate quickly. For Class C, evaluation SHOULD happen within 5 days of detection."),
      D("dot", "Any vulnerability not fully mitigated or remediated within 192 days of evaluation MUST be categorized as an accepted vulnerability, with an explanation of why it's accepted."),
      D("dot", "Some findings count as FedRAMP reportable incidents. For Class C, a likely exploitable, internet-reachable finding above N3 SHOULD be treated as a reportable incident until you've mitigated it to N3 or below."),
      D("dot", "Reporting has rules too. You MUST report detection and response activity persistently, and in a human-readable format at least monthly. For Class C, recent history SHOULD also be available as machine-readable JSON, refreshed at least every 14 days."),
      D("dot", "Each open vulnerability's record covers when and how it was found, its LEV and IRV status, its PAIN rating over time, and whether it's overdue. Accepted ones need the explanation of why."),
      D("dot", "And a MUST NOT: don't disclose details that would help someone exploit the flaw. Share enough for people to make risk decisions, and no more. Recap card, then Raj has a pile of findings for you to judge.")
    ],
    recap: {
      title: "VER: Vulnerability Evaluation and Reporting",
      terms: [
        ["Deadline", "Mandatory 2026-12-07 for Class B, C and D; grace period under a corrective action plan to 2027-03-07."],
        ["Old clock", "Fixed windows by severity, commonly 30 / 90 / 180 days. VER replaces them with context."],
        ["LEV / NLEV (MUST evaluate)", "Likely exploitable: a likely attacker could reach it and would probably cause harm. Anything exploitable by an automated, unauthenticated attacker over the internet is at least an LEV."],
        ["IRV / NIRV (MUST evaluate)", "Internet-reachable: an internet-originating payload might trigger it, even without a direct internet route."],
        ["Assume automation (MUST)", "Assume exploitation can be automated unless you have evidence otherwise."],
        ["PAIN N0 to N5 (MUST)", "N0 extremely unlikely to affect agencies; N1 minimal; N2 narrow; N3 disruptive for one agency; N4 debilitating for one or disruptive for several; N5 debilitating for several."],
        ["Class C timeframes", "To lower the rating: N5 LEV+IRV 2 days, LEV+NIRV 4, NLEV 16. N4: 4 / 8 / 64. N3: 16 / 32 / 128. N2: 48 / 128 / 192 days."],
        ["Evaluate quickly", "Class C: evaluate within 5 days of detection (SHOULD)."],
        ["Accepted vulnerability (MUST)", "Not fully mitigated or remediated within 192 days of evaluation, with a documented explanation."],
        ["Reportable incident", "Class C: an internet-reachable LEV above N3 SHOULD be treated as a FedRAMP reportable incident until mitigated to N3 or below."],
        ["Reporting", "Persistent reporting (MUST); human-readable at least monthly (MUST); Class C machine-readable JSON history refreshed at least every 14 days (SHOULD)."],
        ["Responsible disclosure (MUST NOT)", "Don't disclose exploitation-enabling details; share enough for informed risk decisions."]
      ],
      sources: [SRC.ver, SRC.vdr, SRC.defs]
    },
    scenario: {
      title: "SAME SCORE, DIFFERENT FATE",
      intro: [
        D("raj", "I have findings. Many findings. I need an oracle."),
        D("player", "You have a GRC lead with a recap card. Let's go.")
      ],
      decisions: [
        {
          setup: [D("raj", "Two findings came in with the same scanner score. One is in the customer-facing API that holds agency records. The other is in an internal build tool that touches no federal data.")],
          prompt: "How do you rate the two findings?",
          choices: [
            { text: "Rate each in its own context. The API finding likely gets a high PAIN rating and the build tool a much lower one, so their deadlines differ.", correct: true,
              outcome: [D("raj", "So the API gets days and the build tool gets months. My weekend thanks you."),
                        D("dot", "Right. VER rates potential agency impact, reachability and exploitability, so an identical scanner score can land very differently.")] },
            { text: "Same score, same rating. Consistency matters.",
              outcome: [D("pam", "Your build tool has the same urgency as your agency-facing API? Walk me through that."),
                        D("dot", "VER doesn't rate on scanner score. It rates on what exploitation would do to agencies, in this system's real context.")] },
            { text: "Rate both N5 to be safe.",
              outcome: [D("raj", "We now have 400 N5s and no idea which ones actually matter."),
                        D("dot", "Overrating everything buries the urgent findings and burns your shortest deadlines on things that don't need them.")] }
          ]
        },
        {
          setup: [D("raj", "This one's in a database behind the firewall. No internet route at all. So it's not internet-reachable, right?")],
          prompt: "Is the database finding internet-reachable?",
          choices: [
            { text: "Not necessarily. If the database processes payloads that arrive through the internet-facing API, it can still be internet-reachable.", correct: true,
              outcome: [D("raj", "Huh. The API does pass search queries straight through to it."),
                        D("dot", "Exactly. Internet-reachable means an internet-originating payload might trigger it, even without a direct route.")] },
            { text: "Right. Behind the firewall means not reachable.",
              outcome: [D("pam", "Your API forwards user input to that database. So a request from the internet reaches it, doesn't it?"),
                        D("dot", "A firewall stops direct connections, not payloads that ride in through your own API. Reachability follows the data.")] },
            { text: "Right, and since it's internal, it's also not likely exploitable.",
              outcome: [D("dot", "Two mistakes for the price of one. Reachability and exploitability are separate questions, and this one may be reachable through the API.")] }
          ]
        },
        {
          setup: [D("raj", "I really doubt anyone could automate an attack on this one. Gut feel. Can we treat it as manual-only?")],
          prompt: "What do you assume about automation?",
          choices: [
            { text: "Assume it can be automated unless we have evidence it can't, and rate it accordingly.", correct: true,
              outcome: [D("raj", "Fine. My gut is overruled."),
                        D("dot", "Correct. VER makes automation the default assumption. Only evidence moves you off it.")] },
            { text: "Treat it as manual. Raj knows the system.",
              outcome: [D("pam", "What's the evidence that it can't be automated?"),
                        D("raj", "...Vibes?"),
                        D("dot", "Assuming manual exploitation without evidence breaks a MUST. Gut feel isn't evidence.")] },
            { text: "Treat it as manual, but rate it a little higher to compensate.",
              outcome: [D("dot", "That's a guess on top of a guess. Start from the required assumption, automatable, and rate from there.")] }
          ]
        },
        {
          setup: [D("chad", "This old finding just hit day 192, and the fix needs a rewrite we can't afford this year. Can we just leave it open on the list forever?")],
          prompt: "What happens to a finding at day 192?",
          choices: [
            { text: "It must be categorized as an accepted vulnerability, with a written explanation of why, and reported that way.", correct: true,
              outcome: [D("chad", "So we have to explain ourselves in writing. Bold."),
                        D("dot", "Right. After 192 days a finding becomes an accepted vulnerability, and accepted ones carry an explanation that agencies can weigh.")] },
            { text: "Leave it open. Open is open.",
              outcome: [D("ao", "This finding has been open for over six months with no explanation. Is anyone planning to fix it?"),
                        D("dot", "Anything not fixed within 192 days MUST be categorized as accepted, with the reason documented. Leaving it in limbo doesn't meet the rule.")] },
            { text: "Delete it from the tracker. Out of sight, out of mind.",
              outcome: [D("pam", "A finding vanished from your records without a fix. That's going in my report."),
                        D("dot", "Deleting a real vulnerability misrepresents the system. Accepted vulnerabilities stay on the record with their explanation.")] }
          ]
        },
        {
          setup: [D("raj", "Bad one. Likely exploitable, internet-reachable, and we rate it N4. We're Class C.")],
          prompt: "What happens now?",
          choices: [
            { text: "Mitigate it below N4 within 4 days, and treat it as a FedRAMP reportable incident until it's down to N3 or below.", correct: true,
              outcome: [D("ciso", "Four days. Clear the decks, and loop me in on the incident report."),
                        D("dot", "Right. Class C gives an LEV, IRV N4 finding 4 days, and anything internet-reachable and likely exploitable above N3 SHOULD be treated as reportable until it's mitigated to N3 or below.")] },
            { text: "Fix it within the usual 30 days for high findings.",
              outcome: [D("ao", "Thirty days for a likely exploitable, internet-reachable N4? Why wasn't I told?"),
                        D("dot", "The flat 30-day clock is gone. For this combination in Class C, you have 4 days, and it should be treated as a reportable incident meanwhile.")] },
            { text: "Fix it within 4 days. No need to tell anyone unless it's exploited.",
              outcome: [D("pam", "Your deadline was right. Your silence wasn't."),
                        D("dot", "The clock is correct, but for Class C an internet-reachable LEV above N3 SHOULD be treated as a reportable incident until it's mitigated to N3 or below.")] }
          ]
        }
      ],
      verdicts: [[15, "That's an oracle. I'd trust your ratings in front of any agency."], [12, "Strong. Watch the reachability calls."], [8, "Decent. Re-read the PAIN scale before the next batch."], [0, "The Oracle is unimpressed. Try another round."]]
    }
  };

  /* ---------------- Module 5: FedRAMP 20x ---------------- */
  const TWENTYX = {
    id: "twentyx",
    title: "THE CROSSROADS",
    primerScene: "crossroads",
    scenarioScene: "office",
    primer: [
      D("dot", "Last stop, {name}: the Crossroads. One road is the Rev 5 path you know. The other is 20x. Today the CISO wants to know which one Halcyon Gov should take."),
      D("dot", "FedRAMP announced 20x in March 2025 to make certification faster and less document-heavy. It ran public pilots: Low in 2025, then Moderate from late 2025 to March 2026."),
      D("dot", "In 2026 the Consolidated Rules made 20x a full certification Type. The submission pipelines opened in late summer: Class A in early August, and Classes B and C on August 31."),
      D("dot", "The big idea: instead of narrating hundreds of controls, you prove Key Security Indicators, or KSIs. Each one is a security outcome you demonstrate with evidence, not a paragraph you write."),
      D("dot", "The KSIs sit in 10 themes, including Identity and Access Management, Change Management, Incident Response, Recovery Planning and Supply Chain Risk. The industry count under the 2026 rules is 46, with Class C requiring all of them and Class B making 5 optional."),
      D("dot", "KSIs aren't one-time requirements. FedRAMP expects you to collect evidence continuously, detect drift, watch whether controls keep working and alert when something deviates."),
      D("dot", "Automation is the point. For Class B, providers SHOULD have at least one automated method to verify and validate each KSI. And a failed validation is a problem in your detection process. You know what VDR says those are."),
      D("player", "Vulnerabilities."),
      D("dot", "Gold star. Your evidence lives in the Security Decision Record, the same living record that's replacing the SSP. For 20x Class C, it MUST include a summary of each KSI metric over the past 30 days."),
      D("dot", "20x uses only the Program path: FedRAMP certifies directly, with no agency sponsor. The Agency path is legacy and Rev 5 only."),
      D("dot", "You MUST NOT pursue both a Rev 5 Program certification and a 20x Program certification for the same offering. Rev 5 Agency plus 20x Program is discouraged, but not forbidden."),
      D("dot", "Independent assessment doesn't disappear. Classes B, C and D still need an independent assessment at least once a year."),
      D("dot", "And the security work doesn't disappear either. 20x changes how you prove it. FedRAMP says plainly that KSIs aren't a traditional compliance exercise, and that providers have to work with hands-on engineers."),
      D("player", "So 20x is cheaper only if our evidence is already automated."),
      D("dot", "Now you're asking the right question. One more limit: 20x currently supports Classes A, B and C. Class D, the highest, is reported to still be in development."),
      D("dot", "That's the Crossroads. Recap card, then the CISO wants a recommendation, and she'd like it on one slide.")
    ],
    recap: {
      title: "FedRAMP 20x",
      terms: [
        ["What 20x is", "A certification Type based mainly on measured outcomes, proven with Key Security Indicators instead of control narratives."],
        ["Timeline", "Announced March 2025; Low pilot 2025; Moderate pilot to March 2026; pipelines opened 2026 (Class A early August, B and C on August 31). Dates from secondary sources."],
        ["KSIs", "10 themes, including Identity and Access Management, Change Management, Incident Response, Recovery Planning and Supply Chain Risk. Count of 46 (Class C all, Class B 41 required plus 5 optional) is from secondary sources; verify on fedramp.gov."],
        ["Persistent validation", "Collect evidence continuously, detect drift, monitor effectiveness, alert on deviations."],
        ["Automation", "Class B: SHOULD have at least one automated verification and validation method per KSI. A failed validation is a detection failure, which VDR treats as a vulnerability."],
        ["Security Decision Record", "Where KSI evidence lives. Class C MUST include a 30-day summary of each KSI metric."],
        ["Path", "20x is Program path only. The Agency path is legacy and Rev 5 only."],
        ["No double dipping (MUST NOT)", "Don't pursue Rev 5 Program and 20x Program certification for the same offering. Rev 5 Agency plus 20x Program is discouraged, not prohibited."],
        ["Assessment", "Classes B, C and D: independent assessment at least once a year."],
        ["Engineers", "FedRAMP says KSIs aren't a traditional compliance exercise; providers must work with hands-on engineers."],
        ["Class D", "Reported to still be in development for 20x (secondary source)."]
      ],
      sources: [SRC.ksi, SRC.x20, SRC.cert, SRC.defs, "Secondary: Secureframe, A-LIGN, Coalfire, Schellman and Anecdotes 2026 coverage of 20x Phase 3 and KSI counts"]
    },
    scenario: {
      title: "PAVE THE ROAD OR TAKE THE SHORTCUT",
      intro: [
        D("ciso", "{name}, I have a board update in two weeks. I'd like to say something intelligent about FedRAMP 20x."),
        D("player", "Then let's make sure it's intelligent.")
      ],
      decisions: [
        {
          setup: [D("ciso", "Should Halcyon Gov move from Rev 5 to 20x? What's your first move?")],
          prompt: "What do you need to know first?",
          choices: [
            { text: "How much of our security evidence is already automated, what our agency customers require, and whether the class we need is supported on 20x yet.", correct: true,
              outcome: [D("ciso", "Good. That's a real plan, not a vibe."),
                        D("dot", "Right. 20x pays off when evidence is automated, customers will accept it, and the class you need is available.")] },
            { text: "Nothing. 20x is newer, so it's better. Let's switch.",
              outcome: [D("raj", "Quick question: who's automating the evidence?"),
                        D("dot", "Newer isn't a business case. 20x rewards automated evidence and asks a lot of engineering. You need to know whether you have it.")] },
            { text: "What it would cost to rewrite our SSP for 20x.",
              outcome: [D("dot", "20x proves Key Security Indicators with evidence instead of narratives, so the SSP rewrite is the wrong yardstick. Measure your evidence automation instead.")] }
          ]
        },
        {
          setup: [D("raj", "Good news: our pipelines already produce most of the KSI evidence. Probably. I think.")],
          prompt: "How do you test Raj's claim?",
          choices: [
            { text: "Map each KSI to the specific automated evidence that proves it today, and list the gaps. That turns 'probably' into a number.", correct: true,
              outcome: [D("raj", "Mapping started. It's... more gaps than I thought."),
                        D("dot", "That's the point of mapping. Better to find the gaps now than during an assessment.")] },
            { text: "Take his word for it. He's the engineer.",
              outcome: [D("pam", "Your assessment readiness memo says 'probably.' I can't assess 'probably.'"),
                        D("dot", "Trust, then verify. A KSI-by-KSI map is the only way to know what you actually have.")] },
            { text: "Let the assessor find the gaps during the assessment.",
              outcome: [D("ciso", "So we paid for an assessment to tell us we weren't ready?"),
                        D("dot", "Finding gaps during the assessment is the most expensive place to find them.")] }
          ]
        },
        {
          setup: [D("chad", "Can we update the website to say 'FedRAMP 20x Certified'? We're basically there.")],
          prompt: "What can the website say?",
          choices: [
            { text: "Nothing about 20x certification until FedRAMP grants it. Until then, we can accurately say we're pursuing it.", correct: true,
              outcome: [D("chad", "'Pursuing' is less fun but fine."),
                        D("dot", "Right. A certification claim has to be true when you make it. Accurate status protects every agency conversation that follows.")] },
            { text: "Yes, with a small asterisk.",
              outcome: [D("ao", "Your site says certified. The Marketplace says otherwise. Which one is lying?"),
                        D("dot", "An asterisk doesn't fix a false claim. Agencies check the Marketplace.")] },
            { text: "Yes, since we're already Rev 5 certified.",
              outcome: [D("pam", "Rev 5 and 20x are different certification Types. One doesn't count as the other."),
                        D("dot", "Different Types, different certifications. Your Rev 5 certification doesn't make you 20x certified.")] }
          ]
        },
        {
          setup: [D("raj", "It's 2 a.m. on a Saturday. An automated KSI check just failed: MFA got switched off on an admin account during a config change.")],
          prompt: "What process owns this failure?",
          choices: [
            { text: "VDR. A failed validation is a finding, so it's tracked, evaluated, fixed and reported like any vulnerability.", correct: true,
              outcome: [D("raj", "MFA's back on, the finding's logged, and I'm going back to bed."),
                        D("dot", "Right. Failures in your detection and validation are vulnerabilities, not dashboard colors.")] },
            { text: "It can wait for the next quarterly review.",
              outcome: [D("pam", "An admin account sat without MFA for six weeks because it was waiting for a meeting?"),
                        D("dot", "Quarterly reviews summarize. They don't replace response. A failed validation goes straight into VDR.")] },
            { text: "Nobody needs to act. The check will pass again once the config change finishes.",
              outcome: [D("raj", "It did not pass again. The config change finished three days ago."),
                        D("dot", "Assuming it fixes itself is how drift becomes an incident. Treat the failure as a vulnerability.")] }
          ]
        },
        {
          setup: [D("ciso", "Final answer. Halcyon Gov is Rev 5, Agency path, Class C. What do we do?")],
          prompt: "Your recommendation to the CISO:",
          choices: [
            { text: "Stay on Rev 5 and meet the new 2026 and 2027 rules first, while building KSI evidence automation. Revisit 20x once the evidence is real and our agencies are ready for it.", correct: true,
              outcome: [D("ciso", "That fits on one slide. Thank you."),
                        D("dot", "That's the defensible call. The VDR, VER and 2027 rules build the same automation 20x rewards, so none of the work is wasted.")] },
            { text: "Drop Rev 5 now and apply for 20x next month.",
              outcome: [D("ao", "If your Rev 5 certification lapses, what covers our use of Halcyon Gov in the meantime?"),
                        D("dot", "Abandoning the certification you have before a replacement exists leaves your agencies uncovered. And the evidence isn't automated yet.")] },
            { text: "Pursue Rev 5 Program and 20x Program certifications at the same time, to hedge.",
              outcome: [D("pam", "The rules say you can't pursue both Program certifications for the same offering."),
                        D("dot", "FedRAMP says providers MUST NOT pursue both Rev 5 Program and 20x Program certification for the same offering.")] }
          ]
        }
      ],
      verdicts: [[15, "Board-ready. I'm stealing your slide."], [12, "Solid recommendation. Let's pressure-test the automation numbers."], [8, "Close. Let's sharpen it before the board sees it."], [0, "Not quite ready for the board. Run it again."]]
    }
  };

  window.FQ_MODULES = { foundations: FOUNDATIONS, conmon: CONMON, ver: VER, twentyx: TWENTYX };
})();
