"use strict";
/* FedRAMP Quest: Night Shift briefings.
   Night Shift tests judgment, not trivia. Each briefing teaches the facts its
   level relies on that the Day Shift primer doesn't cover, without pointing at
   which answer they decide. Loaded after content2.js and content3.js so that
   regenerating content2.js (scripts/night2.js) never drops them. */
(function () {
  const N = window.FQ_NIGHT || {};
  const D = (text) => ({ who: "dot", text });
  // insert briefing lines after the opening line of a level's primer
  const brief = (id, lines) => {
    const m = N[id];
    if (!m || !Array.isArray(m.primer)) return;
    m.primer.splice(1, 0, ...lines.map(D));
  };

  brief("foundations_n", [
    "First, some rules the day shift didn't need.",
    "Timing. For Classes B to D, the independent assessment behind an application has to come from the previous 3 months. One up to 9 months old can be freshened: a Recognized assessor reviews what changed since and brings it current.",
    "The package itself has to reflect status verified within the previous 7 days. And the provider submits its own application. Consultants can help you prepare; the application is yours.",
    "Inheritance. When you build on a provider that's already certified, like a big cloud platform, you inherit the controls that provider actually runs for you. Its package also lists customer responsibilities, which are yours to do.",
    "Crypto. 'FIPS-approved' describes an algorithm. 'CMVP-validated' describes a specific piece of software, a module that NIST's Cryptographic Module Validation Program has tested. A 'FIPS mode' switch limits which algorithms a library uses; it doesn't validate the library. The 2026 rules care which one you have.",
  ]);

  brief("conmon_n", [
    "Four rules the day shift skipped.",
    "Emergencies. When something breaks, a significant change can happen without advance notice. The obligations don't disappear; they move to after the fact.",
    "Every change gets evaluated to decide whether it's significant. Routine changes skip the notice. FedRAMP can still ask to see how you evaluated them.",
    "Scanners and Linux. Many Linux distributions backport security fixes: they patch the old version instead of shipping a new one. The version number stays old, so a scanner that reads version numbers can flag software that's already fixed. The distribution's security advisories say what was actually patched.",
    "Assessment reports. The assessor's results go into the package without inappropriate modification. You get your own space to respond.",
  ]);

  brief("vdr_n", [
    "One piece of plumbing first. Containers are built from images, which are templates kept in a registry. Every container is a copy of its image, so a flaw in the image is in every copy, and you can check the image before anything runs.",
  ]);

  brief("ver_n", [
    "Two rules from outside the VDR playbook.",
    "Agencies get vulnerability information through FedRAMP's standard reports. The agency rules say agencies should not ask for more unless the agency head, or someone they delegate, determines it's necessary.",
    "Incidents run on their own clock under the 2026 rules. An incident is reportable when it likely affects federal data. It's treated as N5 until you estimate otherwise, and at Class C anything N3 or higher needs an initial report within 1 hour. You update as you learn more.",
  ]);

  brief("crosswalk_n", [
    "One term to know tonight: phishing-resistant MFA. It means a second factor a fake login page can't capture, like a hardware security key or a passkey. Codes sent by text message don't qualify, because a convincing fake page can ask for the code and pass it along.",
  ]);
})();
