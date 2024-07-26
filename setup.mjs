import { promises as fs } from "fs";
import path from "path";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const mode = args["blog"] ? "blog" : args["docs"] ? "docs" : "all";

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

// Function to delete or update specific lines from a file
const manageLinesInFile = async (
  action,
  filePath,
  startLine,
  endLine,
  updatedContent = "",
) => {
  if (!(await fileExists(filePath))) {
    console.log(`File ${filePath} does not exist.`);
    return;
  }

  try {
    const data = await fs.readFile(filePath, "utf8");
    const lines = data.split("\n");

    if (endLine === null || endLine === undefined) {
      endLine = startLine;
    }

    if (action === "update") {
      lines.splice(startLine - 1, endLine - startLine + 1, updatedContent);
    } else if (action === "remove") {
      lines.splice(startLine - 1, endLine - startLine + 1);
    } else {
      throw new Error('Invalid action. Use "update" or "remove".');
    }

    await fs.writeFile(filePath, lines.join("\n"), "utf8");

    const relativePath = path.basename(filePath);
    if (startLine === endLine) {
      console.log(
        `${relativePath} : ${action === "update" ? "Updated" : "Removed"} line ${startLine}`,
      );
    } else {
      console.log(
        `${relativePath} : ${action === "update" ? "Updated" : "Removed"} lines ${startLine} to ${endLine}`,
      );
    }
  } catch (err) {
    console.error(`Error modifying file ${filePath}:`, err);
  }
};

const deleteFolderRecursive = async (folderPath) => {
  if (!(await fileExists(folderPath))) {
    console.log(`${folderPath} does not exist.`);
    return;
  }

  const stat = await fs.stat(folderPath);
  if (stat.isDirectory()) {
    const files = await fs.readdir(folderPath);
    await Promise.all(
      files.map((file) => deleteFolderRecursive(`${folderPath}/${file}`)),
    );
    await fs.rmdir(folderPath);
  } else {
    await fs.unlink(folderPath);
  }
};

(async () => {
  if (!mode) return;

  const appDir = path.join(process.cwd(), "app");
  const configDir = path.join(process.cwd(), "config");
  const componentsDir = path.join(process.cwd(), "components");
  const contentDir = path.join(process.cwd(), "content");
  const contentlayerPath = path.join(process.cwd(), "contentlayer.config.ts");
  const nextConfigPath = path.join(process.cwd(), "next.config.js");
  const staticDir = path.join(process.cwd(), "public", "_static");
  const typesDir = path.join(process.cwd(), "types");

  switch (mode) {
    case "blog":
      console.log("Deleting blog-related content only\n");

      // contentlayer.config.ts
      await manageLinesInFile('update', contentlayerPath, 109, null, "documentTypes: [Page, Doc],");
      await manageLinesInFile('remove', contentlayerPath, 43, 90);

      // docs.ts
      await manageLinesInFile('remove', path.join(configDir, "docs.ts"), 31, 34);
      await manageLinesInFile('remove', path.join(configDir, "docs.ts"), 5, 8);

      // marketing.ts
      await manageLinesInFile('remove', path.join(configDir, "marketing.ts"), 5, 8);

      // remove folders & files
      await deleteFolderRecursive(path.join(appDir, "(marketing)", "(blog-post)"));
      await deleteFolderRecursive(path.join(appDir, "(marketing)", "blog"));
      await deleteFolderRecursive(path.join(componentsDir, "content", "author.tsx"));
      await deleteFolderRecursive(path.join(componentsDir, "content", "blog-card.tsx"));
      await deleteFolderRecursive(path.join(componentsDir, "content", "blog-header-layout.tsx"));
      await deleteFolderRecursive(path.join(componentsDir, "content", "blog-posts.tsx"));
      await deleteFolderRecursive(path.join(contentDir, "blog"));
      await deleteFolderRecursive(path.join(contentDir, "docs", "configuration", "blog.mdx"));
      await deleteFolderRecursive(path.join(configDir, "blog.ts"));
      await deleteFolderRecursive(path.join(staticDir, "avatars"));

      console.log("\nDone.");
      break;

    case "docs":
      console.log("Deleting docs-related content only\n");

      // contentlayer.config.ts
      await manageLinesInFile('update', contentlayerPath, 109, null, "documentTypes: [Page, Post],");
      await manageLinesInFile('remove', contentlayerPath, 23, 42);

      // hero-landing.tsx
      await manageLinesInFile('update', path.join(componentsDir, "sections", "hero-landing.tsx"), 37, null, 'href="/login"');
      await manageLinesInFile('update', path.join(componentsDir, "sections", "hero-landing.tsx"), 44, null, "<span>Go to Login Page</span>");

      // mobile-nav.tsx
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "mobile-nav.tsx"), 124, 129);
      await manageLinesInFile('update', path.join(componentsDir, "layout", "mobile-nav.tsx"), 21, 29, "const links = marketingConfig.mainNav;");
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "mobile-nav.tsx"), 13, null);
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "mobile-nav.tsx"), 9, null);
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "mobile-nav.tsx"), 5, null);

      // navbar.tsx
      await manageLinesInFile('update', path.join(componentsDir, "layout", "navbar.tsx"), 29, null, "const links = marketingConfig.mainNav;");
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "navbar.tsx"), 81, 102);
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "navbar.tsx"), 48, null);
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "navbar.tsx"), 31, 38);
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "navbar.tsx"), 15, null);
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "navbar.tsx"), 8, null);

      // dashboard.ts
      await manageLinesInFile('remove', path.join(configDir, "dashboard.ts"), 38, null);

      // marketing.ts
      await manageLinesInFile('remove', path.join(configDir, "marketing.ts"), 9, 12);

      // types/index.d.ts
      await manageLinesInFile('remove', path.join(typesDir, "index.d.ts"), 34, 44);

      // remove folders & files
      await deleteFolderRecursive(path.join(appDir, "(docs)"));
      await deleteFolderRecursive(path.join(componentsDir, "docs"));
      await deleteFolderRecursive(path.join(configDir, "docs.ts"));
      await deleteFolderRecursive(path.join(contentDir, "docs"));
      await deleteFolderRecursive(path.join(staticDir, "docs"));

      console.log("\nDone.");
      break;

    default:
      console.log("Deleting all content\n");

      // hero-landing.tsx
      await manageLinesInFile('update', path.join(componentsDir, "sections", "hero-landing.tsx"), 37, null, 'href="/login"');
      await manageLinesInFile('update', path.join(componentsDir, "sections", "hero-landing.tsx"), 44, null, "<span>Go to Login Page</span>");

      // mobile-nav.tsx
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "mobile-nav.tsx"), 124, 129);
      await manageLinesInFile('update', path.join(componentsDir, "layout", "mobile-nav.tsx"), 21, 29, "const links = marketingConfig.mainNav;");
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "mobile-nav.tsx"), 13, null);
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "mobile-nav.tsx"), 9, null);
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "mobile-nav.tsx"), 5, null);

      // navbar.tsx
      await manageLinesInFile('update', path.join(componentsDir, "layout", "navbar.tsx"), 29, null, "const links = marketingConfig.mainNav;");
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "navbar.tsx"), 81, 102);
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "navbar.tsx"), 48, null);
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "navbar.tsx"), 31, 38);
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "navbar.tsx"), 15, null);
      await manageLinesInFile('remove', path.join(componentsDir, "layout", "navbar.tsx"), 8, null);

      // config files
      await manageLinesInFile('remove', path.join(configDir, "dashboard.ts"), 38, null);
      await manageLinesInFile('remove', path.join(configDir, "marketing.ts"), 5, 12);

      // types/index.d.ts
      await manageLinesInFile('remove', path.join(typesDir, "index.d.ts"), 34, 44);

      // next.config.js
      await manageLinesInFile('update', nextConfigPath, 30, null, "module.exports = nextConfig;");
      await manageLinesInFile('remove', nextConfigPath, 1, 2);

      // remove folders & files
      await deleteFolderRecursive(path.join(appDir, "(docs)"));
      await deleteFolderRecursive(path.join(appDir, "(marketing)", "(blog-post)"));
      await deleteFolderRecursive(path.join(appDir, "(marketing)", "[slug]"));
      await deleteFolderRecursive(path.join(appDir, "(marketing)", "blog"));
      await deleteFolderRecursive(path.join(componentsDir, "content"));
      await deleteFolderRecursive(path.join(componentsDir, "docs"));
      await deleteFolderRecursive(path.join(configDir, "blog.ts"));
      await deleteFolderRecursive(path.join(configDir, "docs.ts"));
      await deleteFolderRecursive(contentDir);
      await deleteFolderRecursive(path.join(staticDir, "avatars"));
      await deleteFolderRecursive(path.join(staticDir, "blog"));
      await deleteFolderRecursive(path.join(staticDir, "docs"));
      await deleteFolderRecursive(path.join(process.cwd(), "styles", "mdx.css"));
      await deleteFolderRecursive("contentlayer.config.ts");
      await deleteFolderRecursive(path.join(process.cwd(), ".contentlayer"));

      console.log("\nDone.");
      break;
  }
})();
