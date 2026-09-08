// The page-content managers each own one settings key, but a key may hold
// fields this build does not know about — written by an older version of the
// screen, or by something else entirely. Replacing the whole record on save
// would silently drop those.
//
// `mergePreservingUnknown` layers the edited record over whatever is stored, so
// every field the manager edits wins and everything else survives untouched.
// Arrays are replaced wholesale, since a list the manager edits is authoritative
// (removing a row has to actually remove it).

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null && !Array.isArray(v);

export function mergePreservingUnknown<T>(stored: unknown, next: T): T {
    if (!isPlainObject(stored) || !isPlainObject(next)) return next;

    const merged: Record<string, unknown> = { ...stored };

    for (const [key, value] of Object.entries(next)) {
        merged[key] = key in stored ? mergePreservingUnknown(stored[key], value) : value;
    }

    return merged as T;
}
