/** Shared building blocks for the Discussions tab + post popup. All tokens, 4px grid. */
import type { ReactNode } from "react";
import { Icon, type IconName } from "../Icon";
import { Button } from "../Button";
import type { AvatarColor, Role } from "../../data/discussions";

/** Tailwind bg class per identity colour — exported so other UI (e.g. the account switcher) can match it. */
export const AVATAR_BG: Record<AvatarColor, string> = {
  teal: "bg-avatar-teal",
  red: "bg-avatar-red",
  orange: "bg-warning",
  blue: "bg-avatar-blue",
};

/** Circular avatar — a photo when `imageUrl` is given, else initials in the identity colour. */
export function Avatar({
  initials,
  color,
  size = 46,
  imageUrl,
}: {
  initials: string;
  color: AvatarColor;
  size?: number;
  /** Optional photo; falls back to the initials chip when omitted. */
  imageUrl?: string;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-semibold text-neutral-0 ${AVATAR_BG[color]}`}
      style={{ width: size, height: size, fontSize: size >= 46 ? 16 : 14 }}
    >
      {initials}
    </span>
  );
}

/** Persona chips — solid slate chip with a subtle role colour (no primary green). */
const ROLE_PILL: Record<Role, { label: string; cls: string }> = {
  teacher: { label: "Teacher", cls: "text-secondary-200" },
  assistant: { label: "Teacher Assistant", cls: "text-avatar-blue" },
  admin: { label: "Admin", cls: "text-star" },
};

export function RolePill({ role }: { role: Role }) {
  const { label, cls } = ROLE_PILL[role];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full bg-secondary-800 px-12 py-4 text-sm font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

/** Author row: avatar + name (+ role pill) + time. */
export function AuthorHeader({
  name,
  initials,
  color,
  isTeacher,
  role,
  time,
  avatarSize = 46,
  avatarUrl,
  school,
  onJoin,
  onOpenSchool,
  menu,
  enrollLayout = "inline",
}: {
  name: string;
  initials: string;
  color: AvatarColor;
  isTeacher?: boolean;
  role?: Role;
  time: string;
  avatarSize?: number;
  /** Optional avatar photo; falls back to the initials chip when omitted. */
  avatarUrl?: string;
  /** School the post belongs to — shown underlined below the time. */
  school?: string;
  /** Fired by the Enroll control. Omit when the viewer is already enrolled — the control simply doesn't render. */
  onJoin?: () => void;
  /** Fired by clicking the school/course name itself (e.g. opens its detail page). */
  onOpenSchool?: () => void;
  /** Optional right-aligned actions (e.g. a kebab menu). */
  menu?: ReactNode;
  /**
   * "inline" (default): Enroll renders as a pill beside the kebab — the web byline.
   * "stacked": Enroll renders as a plain underlined text link immediately before
   * the kebab (both top-right) — the mobile post header spec (Figma nodes
   * 44973:39121 "Enrolled course" / 44973:39099 "Unenrolled course"), adjusted per
   * feedback to sit next to the kebab rather than on its own line under the meta row.
   */
  enrollLayout?: "inline" | "stacked";
}) {
  const resolved: Role | undefined = role ?? (isTeacher ? "teacher" : undefined);
  const stacked = enrollLayout === "stacked";
  return (
    <div className="flex items-start gap-8">
      <Avatar initials={initials} color={color} size={avatarSize} imageUrl={avatarUrl} />
      <div className={`flex min-w-0 flex-1 flex-col ${stacked ? "gap-8" : "gap-4"}`}>
        <div className="flex flex-wrap items-center gap-8">
          <span className="text-lg font-bold text-text-primary">{name}</span>
          {!stacked && resolved && <RolePill role={resolved} />}
        </div>
        {school ? (
          <span className="flex min-w-0 items-center gap-8 text-sm text-neutral-400">
            <span className="shrink-0">{time}</span>
            <span aria-hidden className="shrink-0 text-secondary-600">
              ·
            </span>
            {onOpenSchool ? (
              <button
                type="button"
                onClick={onOpenSchool}
                className="min-w-0 flex-1 truncate rounded-sm text-left text-secondary-200 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
              >
                {school}
              </button>
            ) : (
              <span className="min-w-0 flex-1 truncate text-secondary-200 underline-offset-2 hover:underline">
                {school}
              </span>
            )}
          </span>
        ) : (
          <span className="text-sm text-neutral-400">{time}</span>
        )}
      </div>
      {stacked
        ? ((school && onJoin) || menu) && (
            <div className="flex shrink-0 items-center gap-8">
              {school && onJoin && (
                <button
                  type="button"
                  onClick={onJoin}
                  className="rounded-sm text-md font-semibold text-primary-300 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
                >
                  Enroll
                </button>
              )}
              {menu}
            </div>
          )
        : ((school && onJoin) || menu) && (
            <div className="flex shrink-0 items-center gap-4">
              {school && onJoin && (
                <Button variant="ghost" size="md" onClick={onJoin} className="shrink-0">
                  Enroll Now
                </Button>
              )}
              {menu}
            </div>
          )}
    </div>
  );
}

/**
 * Renders comment/post text with `@handle` mentions highlighted in the brand
 * colour. When `on` is false the text is returned verbatim.
 */
export function MentionText({ text, on = false }: { text: string; on?: boolean }) {
  if (!on) return <>{text}</>;
  const parts = text.split(/(@\w+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^@\w+$/.test(part) ? (
          <span key={i} className="font-semibold text-primary-500">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/** Pill showing a reaction icon + count (heart / message). */
export function ReactionPill({
  icon,
  count,
  iconSize = 24,
  active = false,
}: {
  icon: IconName;
  count: number | string;
  iconSize?: number;
  /** Highlighted (e.g. liked) — lime icon + text. */
  active?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-8 rounded-full bg-secondary-950 px-12 py-8 text-lg transition-colors ${
        active ? "text-primary-500" : "text-secondary-200"
      }`}
    >
      <Icon name={icon} size={iconSize} />
      {typeof count === "number" ? String(count).padStart(2, "0") : count}
    </span>
  );
}
