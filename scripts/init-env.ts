import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";

async function findEnvExamples(dir: string, baseDir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const examples: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
      examples.push(...(await findEnvExamples(fullPath, baseDir)));
    } else if (entry.isFile() && entry.name === ".env.example") {
      examples.push(relative(baseDir, fullPath));
    }
  }

  return examples;
}

const baseDir = process.cwd();
const envExamples = await findEnvExamples(baseDir, baseDir);

let created = 0;
let skipped = 0;

for (const examplePath of envExamples) {
  const envPath = examplePath.replace(".env.example", ".env");

  const envFile = Bun.file(envPath);
  const exampleFile = Bun.file(examplePath);

  if (await envFile.exists()) {
    console.log(`✓ ${envPath} already exists, skipping`);
    skipped++;
  } else {
    await Bun.write(envPath, await exampleFile.text());
    console.log(`✓ Created ${envPath} from ${examplePath}`);
    created++;
  }
}

console.log(
  `\nDone! Created ${created} environment file${created !== 1 ? "s" : ""}, skipped ${skipped} existing file${skipped !== 1 ? "s" : ""}.`,
);
