/**
 * MobileSettingsScreen — "Settings" tab, two variants per persona:
 * - Visitor (Figma node 43888:19880): full-width "Login/Sign Up" CTA, then
 *   About Athan Academy / Feedback / Restore Purchase / Privacy Policy.
 * - Signed-in — Enrolled Student/Teacher (Figma node 43902:9518): no CTA;
 *   adds Account Details / My Accomplishments / Delete Account to the menu,
 *   and a footer with a "Sign Out" button + "Become an Instructor" link.
 *
 * Feedback reuses the existing FeedbackButton (opens the same feedback modal
 * used in the lesson screens) instead of a new implementation. Every other
 * row (Account Details, My Accomplishments, About, Restore Purchase, Delete
 * Account, Privacy Policy, Become an Instructor) has no destination/flow
 * built yet, so tapping it is a no-op for now, same as other "out of scope"
 * taps on these mobile screens.
 */
import { Icon, type IconName } from "../../components/Icon";
import { Button } from "../../components/Button";
import { FeedbackButton } from "../../components/FeedbackButton";
import type { PersonaId } from "../../data/personas";

const ROW_CLASS =
  "flex w-full items-center gap-8 py-10 text-left transition-colors hover:bg-overlay-white-8";

/** Hairline divider — its own element so the gap-12 on the menu list applies evenly around it, matching the Figma spacing. */
function Divider() {
  return <div aria-hidden className="h-0 border-t border-secondary-950" />;
}

function MenuRow({
  icon,
  label,
  chevron = false,
  emphasized = false,
  onOpen,
}: {
  icon: IconName;
  label: string;
  chevron?: boolean;
  /** Bold + brighter text — Account Details only, per the signed-in Figma spec. */
  emphasized?: boolean;
  onOpen: () => void;
}) {
  return (
    <button type="button" onClick={onOpen} className={ROW_CLASS}>
      <Icon name={icon} size={20} className="shrink-0 text-neutral-0" />
      <span className={`flex-1 text-md ${emphasized ? "font-bold text-text-primary" : "font-medium text-secondary-50"}`}>
        {label}
      </span>
      {chevron && <Icon name="chevron-right" size={20} className="shrink-0 text-secondary-400" />}
    </button>
  );
}

export function MobileSettingsScreen({
  persona,
  onSignIn,
  onSignOut,
}: {
  persona: PersonaId;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  const signedIn = persona !== "visitor";

  return (
    <div className="flex flex-1 flex-col gap-16 px-16 pb-32 pt-16">
      <h1 className="text-md font-bold text-neutral-0">Settings</h1>

      {signedIn ? (
        <div className="flex flex-col gap-24">
          <div className="flex flex-col gap-12">
            <Divider />
            <MenuRow icon="user" label="Account Details" chevron emphasized onOpen={() => {}} />
            <Divider />
            <MenuRow icon="award" label="My Accomplishments" chevron onOpen={() => {}} />
            <Divider />
            <MenuRow icon="info" label="About Athan Academy" chevron onOpen={() => {}} />
            <Divider />
            <FeedbackButton className={ROW_CLASS} forceMobile>
              <Icon name="edit" size={20} className="shrink-0 text-neutral-0" />
              <span className="flex-1 text-left text-md font-medium text-secondary-50">Feedback</span>
            </FeedbackButton>
            <Divider />
            <MenuRow icon="rotate-ccw" label="Restore Purchase" chevron onOpen={() => {}} />
            <Divider />
            <MenuRow icon="trash" label="Delete Account" onOpen={() => {}} />
            <Divider />
            <MenuRow icon="lock" label="Privacy Policy" chevron onOpen={() => {}} />
          </div>

          <div className="flex flex-col gap-8">
            <Button variant="muted" size="lg" fullWidth onClick={onSignOut}>
              Sign Out
            </Button>
            <button
              type="button"
              onClick={() => {}}
              className="h-48 w-full rounded-sm text-center text-md font-semibold text-primary-500 underline underline-offset-2"
            >
              Become an Instructor
            </button>
          </div>
        </div>
      ) : (
        <>
          <Button variant="primary" size="lg" fullWidth onClick={onSignIn}>
            Login/Sign Up
          </Button>

          <div className="flex flex-col gap-12">
            <Divider />
            <MenuRow icon="info" label="About Athan Academy" chevron onOpen={() => {}} />
            <Divider />
            <FeedbackButton className={ROW_CLASS} forceMobile>
              <Icon name="edit" size={20} className="shrink-0 text-neutral-0" />
              <span className="flex-1 text-left text-md font-medium text-secondary-50">Feedback</span>
            </FeedbackButton>
            <Divider />
            <MenuRow icon="rotate-ccw" label="Restore Purchase" chevron onOpen={() => {}} />
            <Divider />
            <MenuRow icon="lock" label="Privacy Policy" chevron onOpen={() => {}} />
          </div>
        </>
      )}
    </div>
  );
}
