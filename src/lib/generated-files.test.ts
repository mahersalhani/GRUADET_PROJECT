import test from "node:test";
import assert from "node:assert/strict";

import {
  getPreviewErrorDiagnostics,
  normalizeGeneratedFiles,
  parseGeneratedFiles,
} from "./generated-files";

test("diagnoses generated interactive page files without use client", () => {
  const diagnostics = getPreviewErrorDiagnostics({
    "app/page.tsx": `import { useState } from "react";

export default function Page() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
`,
  });

  assert.deepEqual(diagnostics, [
    `app/page.tsx uses React hooks, browser APIs, or event handlers but is missing "use client"; as the first line.`,
  ]);
});

test("does not diagnose files that already start with use client", () => {
  const diagnostics = getPreviewErrorDiagnostics({
    "app/page.tsx": `"use client";

import { useState } from "react";

export default function Page() {
  const [count] = useState(0);
  return <p>{count}</p>;
}
`,
  });

  assert.deepEqual(diagnostics, []);
});

test("diagnoses use client directives that are not first", () => {
  const diagnostics = getPreviewErrorDiagnostics({
    "app/page.tsx": `import { HomeIcon } from "lucide-react";

"use client";

export default function Page() {
  return <button onClick={() => window.alert("hi")}>Open</button>;
}
`,
  });

  assert.deepEqual(diagnostics, [
    `app/page.tsx has "use client"; on line 3, but Next.js requires the directive to be the first line before imports or other expressions.`,
  ]);
});

test("normalizes generated interactive tsx files", () => {
  const files = normalizeGeneratedFiles({
    "app/page.tsx": `import React, { useState } from "react";

export default function Page() {
  const [count] = useState(0);
  return <p>{count}</p>;
}
`,
    "lib/data.ts": `export const value = 1;`,
  });

  assert.match(files["app/page.tsx"], /^"use client";\n\n/);
  assert.equal(files["lib/data.ts"], `export const value = 1;`);
});

test("normalizes misplaced use client directives", () => {
  const files = normalizeGeneratedFiles({
    "app/page.tsx": `import { HomeIcon } from "lucide-react";

"use client";

export default function Page() {
  return <button onClick={() => window.alert("hi")}><HomeIcon /></button>;
}
`,
  });

  assert.equal(
    files["app/page.tsx"],
    `"use client";\n\nimport { HomeIcon } from "lucide-react";\n\nexport default function Page() {\n  return <button onClick={() => window.alert("hi")}><HomeIcon /></button>;\n}\n`,
  );
});

test("normalizes malformed and duplicated use client directives", () => {
  const files = normalizeGeneratedFiles({
    "app/page.tsx": `"use client";,

use client

import { useState } from "react";

export default function Page() {
  const [count] = useState(0);
  return <p>{count}</p>;
}
`,
  });

  assert.equal(
    files["app/page.tsx"],
    `"use client";\n\nimport { useState } from "react";\n\nexport default function Page() {\n  const [count] = useState(0);\n  return <p>{count}</p>;\n}\n`,
  );
});

test("parses generated file snapshots from persisted fragment JSON", () => {
  const files = parseGeneratedFiles({
    "app/page.tsx": `export default function Page() {
  return <main>Hello</main>;
}
`,
    "app/widget.tsx": `export function Widget() {
  return <div />;
}
`,
  });

  assert.deepEqual(files, {
    "app/page.tsx": `export default function Page() {
  return <main>Hello</main>;
}
`,
    "app/widget.tsx": `export function Widget() {
  return <div />;
}
`,
  });
});

test("rejects invalid generated file snapshots", () => {
  assert.equal(parseGeneratedFiles(null), null);
  assert.equal(parseGeneratedFiles(["app/page.tsx"]), null);
  assert.equal(parseGeneratedFiles({ "app/page.tsx": 123 }), null);
});
