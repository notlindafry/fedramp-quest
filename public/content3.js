"use strict";
/* ============================================================
   FedRAMP Quest content: The Library (crosswalk: FedRAMP with SOC 2
   and ISO 27001) and The Gatehouse (Minimum Assessment Scope).
   Day Shift and Night Shift for each.
   Checked against fedramp.gov (Consolidated Rules for 2026) on 2026-11-14.
   Facts from secondary sources or general GRC practice are labeled on
   the recap cards.
   ============================================================ */
(function () {
  const D = (who, text) => ({ who, text });
  const C = (text, outcome, correct) => (correct ? { text, correct: true, outcome } : { text, outcome });
  const SRC = {
    certA: "FedRAMP Class A certification rules (20x): https://fedramp.gov/2026/reference/20x/a/fedramp-certification/",
    certRef: "FedRAMP Certification reference: https://www.fedramp.gov/2026/reference/fedramp-certification/",
    paths: "FedRAMP blog, 'FedRAMP certification paths are heating up' (2026-07-30): https://www.fedramp.gov/2026-07-30-fedramp-certification-paths-are-heating-up/",
    rfc22: "FedRAMP RFC-0022 (early proposal that listed ISO 27001): https://www.fedramp.gov/rfcs/0022",
    mas: "Minimum Assessment Scope (CR26 reference): https://fedramp.gov/2026/reference/minimum-assessment-scope/",
    masRev5: "Minimum Assessment Scope, Rev5 Class C: https://fedramp.gov/2026/reference/rev5/c/minimum-assessment-scope/",
    masPdf: "FedRAMP Minimum Assessment Scope (2025 release, definitions and exclusions): https://www.fedramp.gov/assets/resources/documents/2025.05_20x_Minimum_Assessment_Scope.pdf",
    guide: "FedRAMP 20x guidance explorer (KSIs apply to everything in scope): https://www.fedramp.gov/20x/guidance_explorer"
  };

  /* ================= The Library: one control set ================= */
  const CROSSWALK = {
    id: "crosswalk",
    title: "THE LIBRARY",
    primerScene: "library",
    scenarioScene: "office",
    primer: [
      D("dot", "Welcome to the Library, {name}. Every shelf holds a framework: SOC 2, ISO 27001, NIST 800-53 and FedRAMP. Today's question is the one you'll get in every leadership meeting. Can we run them as one program?"),
      D("dot", "Mostly, with care. They overlap heavily in what they care about, like access control, change management, logging and incident response. They differ in who decides the scope, how deep the evidence goes and how often it's checked."),
      D("dot", "SOC 2 is an attestation report from a CPA firm against the AICPA's Trust Services Criteria. The company picks the scope and writes its own controls. A Type I tests design at a point in time. A Type II tests whether controls operated over a period, often six to twelve months."),
      D("dot", "ISO/IEC 27001 is a certifiable standard for an information security management system. Its center of gravity is how you run the program: risk assessment, risk treatment, internal audit and management review. Annex A is its reference set of controls."),
      D("dot", "FedRAMP Rev 5 is built on NIST SP 800-53. FedRAMP chooses the controls and their parameters, an independent assessor tests them, and the agency or FedRAMP decides. You don't get to write your own control set."),
      D("player", "So in SOC 2 we write the test, ISO grades how we run the program, and FedRAMP hands us the test."),
      D("dot", "Crude, but I'll allow it."),
      D("dot", "Here's the common surprise. Policies written for a SOC 2 audit often leave whole FedRAMP Moderate control families thin or untouched. Where the frameworks do overlap, FedRAMP usually asks for more depth: specific parameters, stronger authentication and tighter timelines."),
      D("dot", "The practical tool is a crosswalk: one control library where each internal control maps to SOC 2 criteria, ISO Annex A controls and 800-53 controls. You test once, then reuse the evidence wherever the mapping genuinely holds."),
      D("dot", "The trap is mapping by title. Two controls called 'access review' can differ in frequency, population and evidence. A mapping is only as good as the requirement it was checked against, not the label on it."),
      D("dot", "The 2026 rules give commercial assurance a formal job for the first time. A 20x Class A certification requires a completed SOC 2 Type II, a GovRAMP assessment, or prior FedRAMP Rev 5 work, including FedRAMP Ready, within the past 12 months."),
      D("dot", "Notice what's missing from that list: ISO 27001. FedRAMP's early proposal for this idea included it, but the final Class A rule names only those three. ISO still helps you build the program. It just isn't a Class A ticket today."),
      D("dot", "For the SOC 2 route, FedRAMP wants more than the PDF: the complete report, a bridge or gap letter if needed, verified audit engagement documentation, and the schedule for the next report."),
      D("dot", "And Class A is a door, not a destination. Once a federal agency is using a Class A service, FedRAMP gives the provider 12 months to begin moving to Class B or higher."),
      D("dot", "One last thread ties it together. FedRAMP's 2026 rule pages list the related 800-53 controls for each rule. That's your Rosetta Stone: 800-53 is the common language underneath the whole shelf."),
      D("dot", "Halcyon has all of it: SOC 2 Type II and ISO 27001 for the commercial product, and Rev 5 Moderate for Halcyon Gov. That's three audit calendars landing on one tired engineering team. Recap card, then the CISO wants to know how many audits she can stop paying for.")
    ],
    recap: {
      title: "One control set, two audiences",
      terms: [
        ["SOC 2", "A CPA firm's attestation against the AICPA Trust Services Criteria. The company sets scope and controls. Type I: design at a point in time. Type II: operating effectiveness over a period."],
        ["ISO/IEC 27001", "A certifiable standard for an information security management system: risk assessment and treatment, internal audit, management review, with Annex A as reference controls."],
        ["FedRAMP Rev 5", "Built on NIST SP 800-53 with FedRAMP-chosen controls and parameters, tested by an independent assessor."],
        ["Typical gap", "SOC 2-oriented policies often leave FedRAMP Moderate control families thin, and overlapping areas need more depth (parameters, authentication strength, timelines). General practitioner experience, not a FedRAMP rule."],
        ["Crosswalk", "One internal control library mapped to SOC 2, ISO Annex A and 800-53. Test once, reuse evidence only where the mapping holds requirement by requirement. General GRC practice."],
        ["Class A entry (MUST)", "A completed SOC 2 Type II, GovRAMP assessment, or FedRAMP Rev 5 work (including FedRAMP Ready) within the past 12 months."],
        ["ISO 27001 and Class A", "Listed in FedRAMP's early RFC-0022 proposal, but not in the final Class A rule."],
        ["SOC 2 package materials", "Complete report, bridge or gap letter if applicable, verified audit engagement documentation, estimated schedule for the next report."],
        ["Class A is temporary", "Once a federal customer uses the service, the provider has 12 months to begin moving to Class B or higher."],
        ["Common language", "FedRAMP's 2026 rule pages list related NIST SP 800-53 controls for each rule."]
      ],
      sources: [SRC.certA, SRC.certRef, SRC.paths, SRC.rfc22]
    },
    scenario: {
      title: "HOW MANY AUDITS CAN I CANCEL?",
      intro: [
        D("ciso", "{name}, I'm paying for three audits a year. Tell me how much of that is the same work."),
        D("player", "More than you'd think. Less than you'd hope.")
      ],
      decisions: [
        {
          setup: [D("ciso", "We have a clean SOC 2 Type II for the commercial product. Doesn't that mean Halcyon Gov's controls are covered?")],
          prompt: "Does the SOC 2 cover Halcyon Gov's FedRAMP controls?",
          choices: [
            C("No. FedRAMP sets its own controls, so we map them and fill the gaps.", [
              D("ciso", "So the SOC 2 is a head start, not a finish line."),
              D("dot", "Right. In SOC 2 the company defines the controls. FedRAMP Rev 5 hands you 800-53 controls and parameters. The overlap is real, but it has to be proven control by control.")], true),
            C("Yes. Both test the same areas, so a clean SOC 2 covers FedRAMP too.", [
              D("pam", "Your SOC 2 doesn't mention half the control families I'm testing."),
              D("dot", "Same topics, different depth. A clean SOC 2 doesn't prove you meet FedRAMP's specific controls and parameters.")]),
            C("Mostly. We only need FedRAMP's paperwork layered on top of the SOC 2.", [
              D("raj", "The 'paperwork' turned out to include three new technical controls."),
              D("dot", "The gaps aren't only documents. FedRAMP often requires controls and settings a SOC 2 never asked for.")])
          ]
        },
        {
          setup: [D("raj", "Good news! I mapped our controls to 800-53 by matching control names. 92% coverage.")],
          prompt: "What do you do with Raj's 92%?",
          choices: [
            C("Recheck each match against the real requirement, not the title.", [
              D("raj", "Rechecked. It's more like 70%. The access reviews were quarterly, not monthly, among other things."),
              D("dot", "Right. A mapping by title is a guess. The real number comes from comparing what each requirement actually demands.")], true),
            C("Great. Send the 92% to the assessor as our official coverage figure.", [
              D("pam", "Your 'access review' runs quarterly. The requirement you mapped it to doesn't say quarterly."),
              D("dot", "Assessors test requirements, not titles. An inflated mapping just moves the surprise to the assessment.")]),
            C("Mark the unmatched 8% as not applicable and focus on the 92%.", [
              D("dot", "Unmatched usually means missing, not irrelevant. And the 92% hasn't been checked yet either.")])
          ]
        },
        {
          setup: [D("chad", "A startup partner has ISO 27001. They want FedRAMP Class A next quarter. Their certificate's fresh. Easy, right?")],
          prompt: "Can the partner use ISO 27001 for Class A?",
          choices: [
            C("Not with ISO alone. It isn't on the Class A list of frameworks.", [
              D("chad", "So they need a SOC 2. I'll break it to them gently."),
              D("dot", "Right. ISO was in FedRAMP's early proposal, but the final Class A rule lists only SOC 2 Type II, GovRAMP and FedRAMP Rev 5, including Ready.")], true),
            C("Yes. ISO 27001 is the most rigorous commercial standard, so it qualifies.", [
              D("dot", "Rigor isn't the test. The final Class A rule names three accepted frameworks, and ISO 27001 isn't one of them.")]),
            C("Yes, as long as the certificate was issued in the last 12 months.", [
              D("pam", "The 12-month window applies to the frameworks on the list. ISO isn't on it."),
              D("dot", "Right idea about timing, wrong framework. ISO 27001 doesn't qualify for Class A.")])
          ]
        },
        {
          setup: [D("chad", "Our Analytics team just got a SOC 2 Type I. Brand new! Good enough for Class A?")],
          prompt: "Does a SOC 2 Type I qualify for Class A?",
          choices: [
            C("No. Class A needs a Type II, which tests controls over a period.", [
              D("chad", "How long is a Type II?"),
              D("player", "Long enough that we should have started already."),
              D("dot", "Right. A Type I checks design at a point in time. The Class A rule requires a Type II.")], true),
            C("Yes. Any SOC 2 report from the last 12 months qualifies for Class A.", [
              D("dot", "The rule names SOC 2 Type II specifically. A Type I doesn't test whether controls actually operated over time.")]),
            C("Yes, if we attach a bridge letter explaining the difference in type.", [
              D("pam", "A bridge letter covers a gap in time, not a gap in report type."),
              D("dot", "Bridge letters cover the period between reports. They can't turn a Type I into a Type II.")])
          ]
        },
        {
          setup: [D("ciso", "Big picture. Should we run commercial compliance and FedRAMP as one program or two?")],
          prompt: "Your recommendation to the CISO:",
          choices: [
            C("One shared control library, mapped per framework, deeper where FedRAMP is.", [
              D("ciso", "One program, honest about the differences. Put a cost estimate behind it."),
              D("dot", "That's the defensible model. Shared where requirements truly match, FedRAMP-specific where they don't.")], true),
            C("Two separate programs. The frameworks are too different to share anything.", [
              D("raj", "So engineering answers the same access question three times a year forever?"),
              D("dot", "The frameworks overlap heavily. Running them separately pays for the same evidence several times.")]),
            C("One program built to SOC 2, with FedRAMP checking against it afterward.", [
              D("dot", "Building to the least demanding framework guarantees FedRAMP gaps. Design for the strictest requirement in each area, then reuse downward.")])
          ]
        }
      ],
      verdicts: [[15, "That's the program I want to fund."], [12, "Good instincts. Tighten the mapping before the budget meeting."], [8, "Getting there. Revisit what each framework actually requires."], [0, "Back to the stacks. Try again."]]
    }
  };

  /* ================= The Gatehouse: scope and boundaries ================= */
  const SCOPE = {
    id: "scope",
    title: "THE GATEHOUSE",
    primerScene: "gatehouse",
    scenarioScene: "office",
    primer: [
      D("dot", "Welcome to the Gatehouse, {name}. The question here sounds simple and causes most of FedRAMP's arguments. What's inside the boundary?"),
      D("dot", "The 2026 rules replace the traditional boundary with the Minimum Assessment Scope. Providers MUST identify every information resource likely to handle federal customer data, or likely to affect its confidentiality, integrity or availability. That set is the cloud service offering."),
      D("dot", "Two words do a lot of work. 'Likely' means a reasonable degree of probability based on context. 'Handle' means storing, processing or transmitting."),
      D("dot", "The intent cuts both ways. FedRAMP wants scope narrow enough to skip components that don't affect the offering's security, and complete enough to catch everything that does."),
      D("dot", "Information resources aren't just servers. Under federal law the term covers information plus related resources such as personnel, equipment and information technology. People are part of the picture."),
      D("dot", "Something can affect federal data without ever touching it. A build pipeline that deploys code into Halcyon Gov never stores a record, but it can change every control that protects one."),
      D("dot", "Metadata counts. When the scope rule applies, metadata about federal customer data MUST be in scope too: log entries, ticket fields, analytics events."),
      D("dot", "Third-party information resources are anything not entirely inside your scope: a SaaS tool, an outside API, another provider's service. For each one, you MUST document how it's used and configured, why you use it, mitigations, and compensating controls."),
      D("player", "So adding a vendor is a documentation event."),
      D("dot", "And a risk decision. Agencies read that list."),
      D("dot", "Under 20x, the newer approach you'll meet at the Crossroads, Key Security Indicators, or KSIs, are the measurable security outcomes a provider has to show. Every KSI applies to everything within the Minimum Assessment Scope. Draw the scope wide, and every KSI follows it."),
      D("dot", "Corporate systems are the hard part: email, HR, the laptop fleet, the identity provider. They're in scope only if they're likely to handle federal data or affect it. An identity provider that controls admin access to Halcyon Gov usually clears that bar. The cafeteria menu app doesn't."),
      D("dot", "Software that isn't a cloud service, like a desktop tool an agency installs and runs itself, is outside FedRAMP's scope entirely. The cloud services that tool talks to are a different story."),
      D("dot", "You MAY describe resources beyond the scope in a supplement, clearly marked and separated. They don't become certified by being described."),
      D("dot", "Scope is the provider's call, and the provider's accountability. Get it wrong and the assessor, the agency or an incident will correct you. Recap card, then Raj has a list of things he'd like to leave outside the gate.")
    ],
    recap: {
      title: "Scope and boundaries",
      terms: [
        ["Minimum Assessment Scope (MUST)", "Every information resource likely to handle federal customer data, or likely to affect its confidentiality, integrity or availability. That set is the cloud service offering."],
        ["Likely", "A reasonable degree of probability based on context."],
        ["Handle", "Store, process or transmit."],
        ["Information resource", "Information plus related resources such as personnel, equipment and IT (44 U.S.C. 3502)."],
        ["Affect without touching", "Pipelines, admin tools and identity systems can be in scope without storing federal data."],
        ["Metadata (MUST)", "Metadata, including metadata about federal customer data, is in scope when the scope rule applies."],
        ["Third-party resources (MUST)", "Anything not entirely within the scope. Document usage and configuration, justification, mitigations and compensating controls."],
        ["KSIs follow scope", "Under 20x, every KSI applies to everything within the Minimum Assessment Scope."],
        ["Non-cloud software", "Software that isn't a cloud service, run by the agency itself, is outside FedRAMP's scope."],
        ["Supplement (MAY)", "Resources beyond the scope can be documented in a clearly marked, separated supplement. They aren't certified."],
        ["Related 800-53 controls", "FedRAMP lists AC-4, CM-12, CM-12(1), RA-3 and SI-4(19) for the scope rule."]
      ],
      sources: [SRC.mas, SRC.masRev5, SRC.masPdf, SRC.guide]
    },
    scenario: {
      title: "WHAT'S INSIDE THE GATE",
      intro: [
        D("raj", "I made a list of things I'd like to be out of scope."),
        D("player", "Of course you did. Read it to me.")
      ],
      decisions: [
        {
          setup: [D("raj", "Item one: our build pipeline. It deploys code into Halcyon Gov, but it never touches federal data. Out of scope?")],
          prompt: "Is the build pipeline in scope?",
          choices: [
            C("Yes. It can change the systems protecting federal data.", [
              D("raj", "Fair. If someone owns the pipeline, they own Halcyon Gov."),
              D("dot", "Right. Scope covers resources likely to affect federal data's confidentiality, integrity or availability, not only those that store it.")], true),
            C("No. It never stores, processes or transmits federal data.", [
              D("pam", "Your pipeline can push any code into production. How is that out of scope?"),
              D("dot", "Handling is only half the test. Anything likely to affect the security of federal data is in scope too.")]),
            C("Only on deploy days, when it's actively connected to production.", [
              D("dot", "Scope isn't a schedule. If it can affect federal data, it's in scope all the time.")])
          ]
        },
        {
          setup: [D("chad", "Marketing wants an analytics tag on Halcyon Gov's login page. Just page views. Totally harmless.")],
          prompt: "What about the analytics tag?",
          choices: [
            C("Federal users' metadata would go to a third party. Justify or skip it.", [
              D("chad", "We'll skip it. The documentation is longer than the tag."),
              D("dot", "Right. Metadata about federal users counts, and any third-party resource needs documented use, justification, mitigations and compensating controls.")], true),
            C("Fine. Page views on a login page aren't federal customer data at all.", [
              D("ao", "Your login page sends my users' activity to an ad-tech company?"),
              D("dot", "Metadata about federal users is in scope. Page views tied to agency users aren't harmless just because they aren't records.")]),
            C("Fine, as long as marketing owns the vendor relationship and contract.", [
              D("dot", "Who owns the contract doesn't change the scope. The tag touches federal users' metadata.")])
          ]
        },
        {
          setup: [D("raj", "Item three: corporate email. Every company has email. In scope or not?")],
          prompt: "Is corporate email in scope?",
          choices: [
            C("Only if it's likely to handle federal data, like support replies.", [
              D("raj", "Support does paste records into replies sometimes. So we fix that habit, or email is in."),
              D("dot", "Right. Scope follows likely handling or effect, not the category of system.")], true),
            C("Always. Every corporate system is automatically in FedRAMP scope.", [
              D("ciso", "Our entire corporate IT estate is now in a FedRAMP assessment?"),
              D("dot", "Over-scoping is expensive. Corporate systems are in only when they're likely to handle or affect federal data.")]),
            C("Never. Corporate systems are outside FedRAMP by definition.", [
              D("dot", "There's no automatic exemption for corporate systems. If email is likely to carry federal data, it's in.")])
          ]
        },
        {
          setup: [D("raj", "We describe our commercial monitoring stack in the package, just for context. Does that make it certified?")],
          prompt: "Does describing it in the package certify it?",
          choices: [
            C("No. Extras go in a marked supplement and aren't certified.", [
              D("dot", "Right. Providers may document resources beyond the scope in a supplement, clearly marked and separated. Describing something doesn't certify it.")], true),
            C("Yes. Anything included in the certification package is certified.", [
              D("pam", "I didn't assess it. It isn't certified."),
              D("dot", "Only the Minimum Assessment Scope is certified. Supplemental material has to be marked and kept separate.")]),
            C("Yes, once the assessor has read the description in the package.", [
              D("dot", "Reading isn't assessing. Supplemental resources stay uncertified, however well they're described.")])
          ]
        },
        {
          setup: [D("ao", "We install your desktop plugin on our own laptops. Is it part of Halcyon Gov's FedRAMP scope?")],
          prompt: "Is the agency-run desktop plugin in scope?",
          choices: [
            C("The plugin isn't, but the cloud services it talks to are.", [
              D("ao", "So my team owns the laptop side, and you own the cloud side."),
              D("dot", "Right. Software that isn't a cloud service and runs on the agency's machines is outside FedRAMP's scope. The cloud end is in scope.")], true),
            C("Yes. Everything Halcyon produces for agencies is in FedRAMP scope.", [
              D("dot", "FedRAMP covers cloud services. Software the agency runs itself is outside it.")]),
            C("No, and neither are the services it connects to, since the agency runs it.", [
              D("pam", "The plugin sends federal data to your API. Your API is very much in scope."),
              D("dot", "The plugin is out, but the cloud services it sends data to are in.")])
          ]
        }
      ],
      verdicts: [[15, "Clean gate. Nothing gets in or out without you knowing."], [12, "Solid. Watch the things that affect data without touching it."], [8, "A few things slipped past the gate. Review the scope test."], [0, "The gate's wide open. Try again."]]
    }
  };

  /* ================= Night Shift: Library ================= */
  const crosswalkN = {
    id: "crosswalk_n", base: "crosswalk", level: 2, title: "THE LIBRARY", primerScene: null, scenarioScene: "office", night: true,
    primer: [
      D("dot", "The Library after hours, {name}. Tonight's traps are the ones that catch smart people who know two frameworks well and assume the third works the same way.")
    ],
    recap: null,
    scenario: {
      title: "NIGHT SHIFT",
      intro: [D("ciso", "Halcyon Analytics Gov is going for Class A on its SOC 2. Keep us out of trouble.")],
      decisions: [
        {
          setup: [D("chad", "Analytics Gov got Class A in September. An agency started using it in October. So we're good for a couple of years, right?")],
          prompt: "What clock started when the agency began using it?",
          choices: [
            C("Twelve months to begin moving to Class B or higher.", [
              D("ciso", "Then Class B goes on next year's budget, not the year after."),
              D("dot", "Right. Once a federal customer uses a Class A service, the provider has 12 months to begin the transition to Class B or higher.")], true),
            C("None. Class A is good for two years with no further strings.", [
              D("dot", "Class A is explicitly temporary. Agency use starts a 12-month clock to begin moving up.")]),
            C("Twelve months to finish a Class B certification, or Class A lapses.", [
              D("pam", "Twelve months to begin. Finishing Class B in twelve would be heroic."),
              D("dot", "Close. The 12 months are for beginning the transition to Class B or higher, not completing it.")]),
            C("Nothing until an agency formally asks for Class B.", [
              D("dot", "The clock starts with federal use, not with an agency's request.")])
          ]
        },
        {
          setup: [D("raj", "Our SOC 2 Type II covers the core platform. Analytics isn't in its scope. Can Analytics Gov still use it for Class A?")],
          prompt: "Can a SOC 2 for the core platform carry Analytics Gov?",
          choices: [
            C("Not as is. Analytics has to be inside a SOC 2 Type II's scope.", [
              D("raj", "So we expand the SOC 2 scope next cycle and wait for the Type II period."),
              D("dot", "Right. A report drawn around one product doesn't vouch for another, even inside the same company.")], true),
            C("Yes. Same company and the same controls, so the report carries over.", [
              D("pam", "The auditor never tested Analytics. The report says so on page three."),
              D("dot", "Shared controls aren't shared evidence. The auditor only attested to what was in scope.")]),
            C("Yes, with a bridge letter explaining Analytics wasn't covered.", [
              D("dot", "Bridge letters cover gaps in time between reports. They can't extend a report to a product that wasn't examined.")]),
            C("Yes, if the auditor adds a paragraph mentioning Analytics.", [
              D("dot", "A mention isn't an examination. Analytics needs to be inside an actual Type II scope and period.")])
          ]
        },
        {
          setup: [D("raj", "The crosswalk says 'MFA: covered by SOC 2.' The FedRAMP KSI calls for phishing-resistant MFA. Our MFA uses SMS codes, and the SOC 2 auditor was fine with that.")],
          prompt: "How do you mark the MFA row?",
          choices: [
            C("A gap. SMS codes don't meet a phishing-resistant requirement.", [
              D("raj", "Security keys for admins first, then everyone. I'll scope it."),
              D("dot", "Right. FedRAMP's KSI is specifically about enforcing phishing-resistant MFA. SMS codes can be phished, whatever another auditor accepted.")], true),
            C("Covered. Both frameworks require MFA, and our auditor accepted it.", [
              D("pam", "Your auditor isn't assessing against this KSI. I am."),
              D("dot", "Same topic, different bar. Another framework's acceptance doesn't meet FedRAMP's requirement.")]),
            C("Partly covered, so count it as half a control.", [
              D("dot", "Half-coverage hides the real gap. Either the requirement is met or it isn't.")]),
            C("Covered for now. Phishing-resistant MFA is a 20x idea, so Rev 5 doesn't care.", [
              D("dot", "Analytics Gov is a 20x Class A, so the KSI applies to it directly. And strong MFA isn't optional on Rev 5 either.")])
          ]
        },
        {
          setup: [D("raj", "SOC 2, ISO and FedRAMP auditors all asked for the same quarterly access review evidence in the same month.")],
          prompt: "How do you handle three requests for the same evidence?",
          choices: [
            C("Collect it once, tag it per framework, share only what's in scope.", [
              D("raj", "One export, three folders, zero extra meetings. I'm in love."),
              D("dot", "That's the crosswalk paying off. Share where requirements match, and limit each auditor to their scope.")], true),
            C("Have each team pull fresh evidence per audit, so nothing gets mixed up.", [
              D("raj", "Three pulls of the same report. Thrilling."),
              D("dot", "Duplicate collection costs time and invites three slightly different answers to the same question.")]),
            C("Give all three auditors read access to the whole evidence store.", [
              D("ao", "Your commercial auditor can see evidence about my agency's users?"),
              D("dot", "Reuse doesn't mean oversharing. Each auditor gets the evidence in their scope, especially where federal data is involved.")]),
            C("Send everyone the FedRAMP version, since it's the strictest.", [
              D("dot", "Strictest isn't the same as appropriate. The FedRAMP evidence may describe federal users that commercial auditors shouldn't see.")])
          ]
        },
        {
          setup: [D("ciso", "Our ISO auditor loves our risk acceptance process: a product owner can accept residual risk. Can Halcyon Gov use the same process to accept a finding we won't fix?")],
          prompt: "Can the internal risk acceptance process cover Halcyon Gov?",
          choices: [
            C("Not alone. For Halcyon Gov, agencies weigh federal risk too.", [
              D("ciso", "So one process, with an extra step for anything touching Halcyon Gov."),
              D("dot", "Right. Your process can start the decision, but for federal risk the agency decides, through deviation requests or accepted vulnerabilities it can see.")], true),
            C("Yes. A documented acceptance by an accountable owner satisfies every framework.", [
              D("ao", "Your product owner accepted risk on my agency's behalf?"),
              D("dot", "For Halcyon Gov, the risk lands on agencies, so they get the decision or at least full visibility.")]),
            C("Yes, as long as the CISO signs instead of the product owner.", [
              D("dot", "A more senior signature doesn't change whose risk it is. Agencies still need to decide or be informed.")]),
            C("No. FedRAMP never allows any risk to be accepted.", [
              D("dot", "Too strict. FedRAMP has accepted vulnerabilities and deviation processes. The agency just has to be part of it.")])
          ]
        }
      ],
      verdicts: [[15, "You could run this library."], [12, "Strong. A couple of framework assumptions to check."], [8, "The third framework surprised you. Review the differences."], [0, "Lost in the stacks. Try again."]]
    }
  };

  /* ================= Night Shift: Gatehouse ================= */
  const scopeN = {
    id: "scope_n", base: "scope", level: 2, title: "THE GATEHOUSE", primerScene: null, scenarioScene: "office", night: true,
    primer: [
      D("dot", "The Gatehouse at night, {name}. Tonight everyone has a good reason why their thing is outside the wall. Listen to the reasons, then apply the test.")
    ],
    recap: null,
    scenario: {
      title: "NIGHT SHIFT",
      intro: [D("raj", "IT, support and marketing all sent me 'quick questions.' I'm forwarding them to you.")],
      decisions: [
        {
          setup: [D("raj", "Corporate IT says our single sign-on is a corporate system, so it's out of scope. It also controls admin logins to Halcyon Gov.")],
          prompt: "Is the company SSO in scope?",
          choices: [
            C("Yes. It controls access to the systems protecting federal data.", [
              D("raj", "IT is thrilled. I'll set up the meeting."),
              D("dot", "Right. Whoever controls admin login controls the offering. That's likely to affect federal data's confidentiality, integrity and availability.")], true),
            C("No. It never stores or processes any federal customer data at all.", [
              D("pam", "If I compromise your SSO, I'm an admin in Halcyon Gov. That's in scope."),
              D("dot", "Affecting federal data is enough. SSO doesn't need to store records to be in scope.")]),
            C("No. The SSO vendor has its own SOC 2, which covers the risk.", [
              D("dot", "The vendor's SOC 2 doesn't change your scope. If it's a third-party resource, it needs documented use, justification, mitigations and compensating controls.")]),
            C("No, as long as Gov admins use separate usernames on it.", [
              D("dot", "Separate usernames on the same identity provider still depend on that provider. It's still likely to affect the offering.")])
          ]
        },
        {
          setup: [D("raj", "A contracted support team can read federal customers' tickets. Raj's position: people aren't information resources, so they're not a scope question.")],
          prompt: "Is the support team a scope question?",
          choices: [
            C("Yes. Information resources include personnel.", [
              D("raj", "Huh. Personnel. It's in the statute and everything."),
              D("dot", "Right. The federal definition covers information plus related resources such as personnel, equipment and IT.")], true),
            C("No. Scope covers systems and services, not people.", [
              D("dot", "The legal definition of information resources includes personnel. People with access to federal data are part of the picture.")]),
            C("Only employees count. Contractors fall outside the scope.", [
              D("ao", "A contractor reading my users' tickets is outside your scope?"),
              D("dot", "Employment status doesn't change access. Anyone likely to handle federal data is part of the scope.")]),
            C("Only if they have administrator rights in Halcyon Gov.", [
              D("dot", "Reading tickets is handling federal data. Admin rights aren't the threshold.")])
          ]
        },
        {
          setup: [D("chad", "To be safe, let's put everything in scope: HR, finance, the office Wi-Fi. More scope, more security!")],
          prompt: "Should Halcyon put everything in scope?",
          choices: [
            C("No. KSIs apply to everything in scope, so keep it to what matters.", [
              D("ciso", "Thank you. I wasn't going to fund FedRAMP for the office Wi-Fi."),
              D("dot", "Right. FedRAMP wants scope narrow enough to skip components that don't affect the offering's security. Over-scoping multiplies the work without helping agencies.")], true),
            C("Yes. FedRAMP prefers the widest scope possible.", [
              D("dot", "It doesn't. The scope rules aim to avoid unnecessary review of components that don't affect the offering.")]),
            C("Yes. A bigger scope makes the assessment go faster and smoother.", [
              D("pam", "A bigger scope makes my invoice go faster."),
              D("dot", "More scope means more to assess and more KSIs to prove, everywhere.")]),
            C("Yes, but only HR and finance, since they hold sensitive data.", [
              D("dot", "Sensitive to Halcyon isn't the test. The test is federal customer data. HR and finance don't handle it here.")])
          ]
        },
        {
          setup: [D("raj", "A small AI summarization API with no FedRAMP certification processes federal ticket text. I documented it as 'used for summaries.'")],
          prompt: "Is 'used for summaries' enough documentation?",
          choices: [
            C("No. It needs use, justification, mitigations and compensating controls.", [
              D("raj", "Four sections, not four words. Got it."),
              D("dot", "Right. For each third-party resource, the scope rules require all four, plus an honest look at the impact on federal data.")], true),
            C("Yes. A short description satisfies the third-party documentation rule.", [
              D("dot", "The rule lists what to document, and a usage note is only one item of four.")]),
            C("Not needed. Outside APIs aren't information resources under FedRAMP.", [
              D("dot", "An outside API processing federal ticket text is exactly a third-party information resource.")]),
            C("Enough, since the vendor's terms promise not to train on our data.", [
              D("ao", "A promise in the terms isn't a mitigation I can evaluate."),
              D("dot", "Contract terms can support your case, but they don't replace documenting mitigations and compensating controls.")])
          ]
        },
        {
          setup: [D("raj", "The logging pipeline strips customer content but keeps agency names, user emails and request paths. That's not federal data, right?")],
          prompt: "Is the logging pipeline in scope?",
          choices: [
            C("Yes. Names, emails and request paths are metadata about federal data.", [
              D("raj", "So 'we strip the content' gets us less sensitivity, not less scope."),
              D("dot", "Right. When the scope rule applies, metadata about federal customer data must be in scope.")], true),
            C("No. The content is stripped, so what's left isn't federal data.", [
              D("dot", "Stripping content doesn't strip identity. Who used the service, and how, is metadata about federal customer data.")]),
            C("Only if the logs are kept for longer than 30 days.", [
              D("dot", "Retention doesn't decide scope. Metadata is in scope however briefly it's kept.")]),
            C("No, as long as the logs are kept in a separate cloud account entirely.", [
              D("pam", "A separate account is still your account."),
              D("dot", "Moving data to another account moves the boundary line. It doesn't take the data out of scope.")])
          ]
        }
      ],
      verdicts: [[15, "Nothing gets past this gate."], [12, "Strong. Keep listening for the 'good reasons.'"], [8, "Some reasons sounded better than they were. Review the scope test."], [0, "The gate fell. Try again."]]
    }
  };

  window.FQ_MODULES = Object.assign(window.FQ_MODULES || {}, { crosswalk: CROSSWALK, scope: SCOPE });
  window.FQ_NIGHT = Object.assign(window.FQ_NIGHT || {}, { crosswalk_n: crosswalkN, scope_n: scopeN });
})();
