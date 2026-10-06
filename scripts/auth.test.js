const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const source = ts.transpileModule(
  fs.readFileSync(path.join(__dirname, "../auth.ts"), "utf8"),
  {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  },
).outputText;

function authCallbacks(dbUser) {
  let callbacks;
  const dependencies = {
    "@/auth.config": {},
    "@auth/prisma-adapter": { PrismaAdapter: () => ({}) },
    "@/lib/db": { prisma: {} },
    "@/lib/dto/user": { getUserById: async () => dbUser },
    "next-auth": (config) => {
      callbacks = config.callbacks;
      return { handlers: {} };
    },
  };
  vm.runInNewContext(source, {
    exports: {},
    require(name) {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  });
  return callbacks;
}

test("revokes an existing administrator token when the user is disabled", async () => {
  const callbacks = authCallbacks({ id: "legacy", active: 0, role: "ADMIN" });
  assert.equal(
    await callbacks.jwt({ token: { sub: "legacy", active: 1, role: "ADMIN" } }),
    null,
  );
});

test("revokes an existing token when the user is missing", async () => {
  assert.equal(
    await authCallbacks(null).jwt({ token: { sub: "deleted", role: "ADMIN" } }),
    null,
  );
});

test("refreshes an active user's session from the database", async () => {
  const callbacks = authCallbacks({
    id: "owner",
    active: 1,
    role: "ADMIN",
    email: "owner@example.com",
    name: "Owner",
    team: "free",
  });
  const token = await callbacks.jwt({ token: { sub: "owner", role: "USER" } });
  const session = await callbacks.session({ token, session: { user: {} } });
  assert.equal(session.user.id, "owner");
  assert.equal(session.user.role, "ADMIN");
  assert.equal(session.user.active, 1);
  assert.equal(session.user.email, "owner@example.com");
});
