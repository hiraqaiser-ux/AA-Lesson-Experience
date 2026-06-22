/** Shared building blocks for the Discussions tab + post popup. All tokens, 4px grid. */
import { Icon, type IconName } from "../Icon";
import type { AvatarColor, Role } from "../../data/discussions";

const AVATAR_BG: Record<AvatarColor, string> = {
  teal: "bg-avatar-teal",
  red: "bg-avatar-red",
  orange: "bg-warning",
  blue: "bg-avatar-blue",
};

/** Circular initials avatar in the user's identity colour. */
export function Avatar({
  initials,
  color,
  size = 46,
}: {
  initials: string;
  color: AvatarColor;
  size?: number;
}) {
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
}: {
  name: string;
  initials: string;
  color: AvatarColor;
  isTeacher?: boolean;
  role?: Role;
  time: string;
  avatarSize?: number;
}) {
  const resolved: Role | undefined = role ?? (isTeacher ? "teacher" : undefined);
  return (
    <div className="flex items-center gap-8">
      <Avatar initials={initials} color={color} size={avatarSize} />
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-8">
          <span className="text-lg font-bold text-text-primary">{name}</span>
          {resolved && <RolePill role={resolved} />}
        </div>
        <span className="text-sm text-neutral-400">{time}</span>
      </div>
    </div>
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
