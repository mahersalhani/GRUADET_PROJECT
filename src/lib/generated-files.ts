export type GeneratedFiles = Record<string, string>;

const REACT_HOOKS = [
  "useState",
  "useEffect",
  "useLayoutEffect",
  "useRef",
  "useReducer",
  "useCallback",
  "useMemo",
  "useTransition",
  "useDeferredValue",
] as const;

const CLIENT_DIRECTIVE_RE = /^\s*(['"])use client\1;?/;
const REACT_HOOK_IMPORT_RE = new RegExp(
  `import\\s+(?:[^{};]+,\\s*)?\\{[^}]*\\b(${REACT_HOOKS.join("|")})\\b[^}]*\\}\\s*from\\s*["']react["']`,
);
const REACT_NAMESPACE_HOOK_RE = new RegExp(
  `\\bReact\\.(${REACT_HOOKS.join("|")})\\b`,
);
const BROWSER_API_RE =
  /\b(window|document|localStorage|sessionStorage|navigator|matchMedia)\b/;
const JSX_EVENT_HANDLER_RE = /\son[A-Z][A-Za-z]+\s*=/;
const STANDALONE_CLIENT_DIRECTIVE_LINE_RE =
  /^[^\S\r\n]*(['"])use client\1;?[^\S\r\n]*$/gm;
const STANDALONE_CLIENT_DIRECTIVE_VARIANT_LINE_RE =
  /^[^\S\r\n]*['"]?\s*use client\s*['"]?\s*;?\s*,?[^\S\r\n]*$/gim;

export function hasUseClientDirective(content: string) {
  return CLIENT_DIRECTIVE_RE.test(content);
}

export function requiresClientDirective(content: string) {
  return (
    REACT_HOOK_IMPORT_RE.test(content) ||
    REACT_NAMESPACE_HOOK_RE.test(content) ||
    BROWSER_API_RE.test(content) ||
    JSX_EVENT_HANDLER_RE.test(content)
  );
}

export function addUseClientDirective(content: string) {
  const contentWithoutClientDirectives = content
    .replace(STANDALONE_CLIENT_DIRECTIVE_VARIANT_LINE_RE, "")
    .replace(STANDALONE_CLIENT_DIRECTIVE_LINE_RE, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+/, "");

  return `"use client";\n\n${contentWithoutClientDirectives}`;
}

function getUseClientDirectiveLine(content: string) {
  const match = content.match(STANDALONE_CLIENT_DIRECTIVE_LINE_RE);

  if (!match) {
    return null;
  }

  const index = content.search(STANDALONE_CLIENT_DIRECTIVE_LINE_RE);
  return content.slice(0, index).split("\n").length;
}

export function normalizeGeneratedFiles(files: GeneratedFiles) {
  return Object.fromEntries(
    Object.entries(files).map(([path, content]) => [
      path,
      path.endsWith(".tsx") && requiresClientDirective(content)
        ? addUseClientDirective(content)
        : content,
    ]),
  );
}

export function parseGeneratedFiles(value: unknown): GeneratedFiles | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const entries = Object.entries(value);

  if (entries.some(([, content]) => typeof content !== "string")) {
    return null;
  }

  return Object.fromEntries(entries) as GeneratedFiles;
}

export function getPreviewErrorDiagnostics(files: GeneratedFiles | null) {
  if (!files) {
    return [];
  }

  return Object.entries(files)
    .flatMap(([path, content]) => {
      if (!path.endsWith(".tsx") || !requiresClientDirective(content)) {
        return [];
      }

      if (hasUseClientDirective(content)) {
        return [];
      }

      const directiveLine = getUseClientDirectiveLine(content);

      if (directiveLine) {
        return [
          `${path} has "use client"; on line ${directiveLine}, but Next.js requires the directive to be the first line before imports or other expressions.`,
        ];
      }

      return [
        `${path} uses React hooks, browser APIs, or event handlers but is missing "use client"; as the first line.`,
      ];
    });
}
