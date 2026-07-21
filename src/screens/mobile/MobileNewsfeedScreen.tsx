/**
 * MobileNewsfeedScreen — standalone preview of the new mobile "Home"/"Explore"
 * concept (Figma nodes 43882:79195 + 43882:79235), reachable at ?screen=mobile.
 * A separate concept shell (bottom tab bar) from the existing web community
 * screens — see MOBILE_ALIGNMENT_CONTEXT.md.
 */
import { useState } from "react";
import { MobileAppShell, type MobileTab } from "../../components/mobile/MobileAppShell";
import { ContinueLearningCard } from "../../components/mobile/ContinueLearningCard";
import { MobileHomeScreen } from "./MobileHomeScreen";
import { MobileExploreScreen } from "./MobileExploreScreen";
import { MobileSettingsScreen } from "./MobileSettingsScreen";
import { MobileSchoolDetailScreen } from "./MobileSchoolDetailScreen";
import { SCHOOLS, getCurrentEnrolledSchool, type School } from "../../data/newsfeed";
import { getMySchools } from "../../data/personas";
import { usePersona } from "../../hooks/usePersona";

/** Only Recite Quran has real School Detail content (SECTIONS/FEED_POSTS/bio) — every
 *  "open a school" entry point routes here regardless of which school was tapped, same
 *  "one page built out, id accepted but unused" convention already used on the web
 *  (NewsfeedScreen's openSchoolDetail). The header title is hardcoded to match, rather
 *  than showing the tapped school's own title over the wrong body content. */
const BUILT_SCHOOL_TITLE = "Learn to Recite Quran in 12 weeks";

export function MobileNewsfeedScreen() {
  const [tab, setTab] = useState<MobileTab>("home");
  const [persona, setPersona] = usePersona();
  const [schoolDetailOpen, setSchoolDetailOpen] = useState(false);
  // "Continue Learning" only makes sense for the Enrolled Student persona —
  // a Teacher isn't "continuing" the course they teach, and a Visitor has none.
  const currentSchool =
    persona === "student" ? getCurrentEnrolledSchool(getMySchools(SCHOOLS, persona)) : undefined;

  const openSchoolDetail = (_school?: School) => setSchoolDetailOpen(true);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-1000 py-32">
      <MobileAppShell
        active={tab}
        onChangeTab={setTab}
        persona={persona}
        onChangePersona={setPersona}
        floating={
          tab === "home" && currentSchool ? (
            <ContinueLearningCard school={currentSchool} onOpen={() => openSchoolDetail(currentSchool)} />
          ) : undefined
        }
      >
        {tab === "explore" ? (
          <MobileExploreScreen persona={persona} onOpenSchool={openSchoolDetail} />
        ) : tab === "settings" ? (
          <MobileSettingsScreen
            persona={persona}
            onSignIn={() => setPersona("student")}
            onSignOut={() => setPersona("visitor")}
          />
        ) : (
          <MobileHomeScreen
            persona={persona}
            onEnroll={() => setPersona("student")}
            onOpenSchool={openSchoolDetail}
          />
        )}

        {/* Rendered here (a descendant of MobileAppShell's frame root), not as a sibling of
            MobileAppShell — its "fixed inset-0" only stays contained within the simulated
            390x812 frame (via the frame root's containing-block transform trick) as long as
            it's nested inside that tree. A sibling placement would cover the real browser
            window instead. */}
        {schoolDetailOpen && (
          <MobileSchoolDetailScreen
            courseTitle={BUILT_SCHOOL_TITLE}
            persona={persona}
            onBack={() => setSchoolDetailOpen(false)}
            onEnroll={() => setPersona("student")}
          />
        )}
      </MobileAppShell>
    </div>
  );
}
