const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");

const { bootstrapAdmin, validateAuthSecret } = require("./bootstrap-admin");

const LEGACY_HASH =
  "c0025ebe2edf525367e859821ccac33a:95992aad7ca8dc7c51855859f7adaa6282b09439b3e138fde22aeeaa6864af0f43fdd297cc7409b24a011300c038ff4d7585f89019e7629120123ec947f62b15";
const config = {
  AUTH_SECRET: crypto.randomBytes(32).toString("base64"),
  BOOTSTRAP_ADMIN_EMAIL: "owner@example.com",
  BOOTSTRAP_ADMIN_PASSWORD: "Unique strong password 2026!",
};

function database(initialUsers = []) {
  const users = initialUsers.map((user) => ({ ...user }));
  return {
    users,
    user: {
      async updateMany({ where, data }) {
        for (const user of users) {
          if (
            Object.entries(where).every(([key, value]) => user[key] === value)
          ) {
            Object.assign(user, data);
          }
        }
      },
      async findFirst({ where }) {
        return users.find((user) =>
          Object.entries(where).every(([key, value]) => user[key] === value),
        );
      },
      async findUnique({ where }) {
        return users.find((user) => user.email === where.email);
      },
      async create({ data }) {
        users.push({ ...data });
        return data;
      },
    },
  };
}

test("rejects weak authentication secrets", () => {
  assert.throws(() => validateAuthSecret("abc123"), /AUTH_SECRET/);
  assert.throws(() => validateAuthSecret("a".repeat(64)), /AUTH_SECRET/);
  assert.doesNotThrow(() => validateAuthSecret(config.AUTH_SECRET));
});

test("preserves administrators whose password was changed", async () => {
  const db = database([
    {
      email: "admin@admin.com",
      password: "changed-hash",
      role: "ADMIN",
      active: 1,
    },
  ]);
  assert.equal(
    await bootstrapAdmin(db, { AUTH_SECRET: config.AUTH_SECRET }),
    "Existing administrator retained.",
  );
  assert.equal(db.users[0].password, "changed-hash");
  assert.equal(db.users[0].active, 1);
});

test("disables the legacy password and requires explicit replacement credentials", async () => {
  const db = database([
    {
      email: "admin@admin.com",
      password: LEGACY_HASH,
      role: "ADMIN",
      active: 1,
    },
  ]);
  await assert.rejects(
    bootstrapAdmin(db, { AUTH_SECRET: config.AUTH_SECRET }),
    /No active administrator/,
  );
  assert.equal(db.users[0].password, null);
  assert.equal(db.users[0].active, 0);
});

test("disables the legacy account while retaining another active administrator", async () => {
  const db = database([
    {
      email: "admin@admin.com",
      password: LEGACY_HASH,
      role: "ADMIN",
      active: 1,
    },
    {
      email: "existing@example.com",
      password: "changed-hash",
      role: "ADMIN",
      active: 1,
    },
  ]);

  assert.equal(
    await bootstrapAdmin(db, { AUTH_SECRET: config.AUTH_SECRET }),
    "Existing administrator retained.",
  );
  assert.equal(db.users[0].active, 0);
  assert.equal(db.users[0].password, null);
  assert.equal(db.users[1].active, 1);
  assert.equal(db.users.length, 2);
});

test("rejects weak bootstrap credentials and existing-user collisions", async () => {
  const db = database([
    { email: "owner@example.com", role: "USER", active: 1 },
  ]);

  await assert.rejects(
    bootstrapAdmin(db, { ...config, BOOTSTRAP_ADMIN_PASSWORD: "short" }),
    /BOOTSTRAP_ADMIN_PASSWORD/,
  );
  await assert.rejects(bootstrapAdmin(db, config), /already belongs to a user/);
  assert.equal(db.users[0].role, "USER");
});

test("creates an administrator once, with a salted password", async () => {
  const db = database();
  assert.equal(await bootstrapAdmin(db, config), "Administrator created.");
  assert.equal(db.users[0].role, "ADMIN");
  assert.notEqual(db.users[0].password, config.BOOTSTRAP_ADMIN_PASSWORD);
  const [salt, hash] = db.users[0].password.split(":");
  assert.equal(
    crypto
      .scryptSync(config.BOOTSTRAP_ADMIN_PASSWORD, salt, 64)
      .toString("hex"),
    hash,
  );
  assert.equal(
    await bootstrapAdmin(db, { AUTH_SECRET: config.AUTH_SECRET }),
    "Existing administrator retained.",
  );
  assert.equal(db.users.length, 1);
});
