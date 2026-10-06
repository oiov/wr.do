const crypto = require("node:crypto");

const LEGACY_ADMIN_EMAIL = "admin@admin.com";
const LEGACY_ADMIN_HASH =
  "c0025ebe2edf525367e859821ccac33a:95992aad7ca8dc7c51855859f7adaa6282b09439b3e138fde22aeeaa6864af0f43fdd297cc7409b24a011300c038ff4d7585f89019e7629120123ec947f62b15";

function validateAuthSecret(secret) {
  if (
    !secret ||
    Buffer.byteLength(secret, "utf8") < 32 ||
    new Set(secret).size < 8
  ) {
    throw new Error(
      "AUTH_SECRET must be a unique random value of at least 32 bytes. Generate one with: openssl rand -base64 32",
    );
  }
}

function validateBootstrapCredentials(email, password) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Set BOOTSTRAP_ADMIN_EMAIL to a valid email address.");
  }
  if (email.toLowerCase() === LEGACY_ADMIN_EMAIL) {
    throw new Error("Use a private email address instead of admin@admin.com.");
  }
  if (!password || password.length < 16 || new Set(password).size < 8) {
    throw new Error(
      "BOOTSTRAP_ADMIN_PASSWORD must be at least 16 characters with at least 8 distinct characters.",
    );
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}

async function bootstrapAdmin(prisma, config = process.env) {
  validateAuthSecret(config.AUTH_SECRET);

  await prisma.user.updateMany({
    where: {
      email: LEGACY_ADMIN_EMAIL,
      password: LEGACY_ADMIN_HASH,
      role: "ADMIN",
    },
    data: { active: 0, password: null },
  });

  const activeAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN", active: 1 },
    select: { id: true },
  });
  if (activeAdmin) return "Existing administrator retained.";

  const email = config.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = config.BOOTSTRAP_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "No active administrator exists. Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD, then restart. Existing users and data are preserved.",
    );
  }
  validateBootstrapCredentials(email, password);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error(
      "BOOTSTRAP_ADMIN_EMAIL already belongs to a user. Choose a new email address.",
    );
  }

  await prisma.user.create({
    data: {
      email,
      name: "Administrator",
      password: hashPassword(password),
      active: 1,
      role: "ADMIN",
      team: "free",
    },
  });
  return "Administrator created.";
}

if (require.main === module) {
  require("dotenv").config();
  try {
    validateAuthSecret(process.env.AUTH_SECRET);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
  if (process.argv.includes("--check-secret")) process.exit(0);

  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  bootstrapAdmin(prisma)
    .then((message) => console.log(message))
    .catch((error) => {
      console.error(`Admin bootstrap failed: ${error.message}`);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}

module.exports = {
  bootstrapAdmin,
  validateAuthSecret,
  validateBootstrapCredentials,
};
