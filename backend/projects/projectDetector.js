import fs from "fs";
import path from "path";

export function detectProject(workspacePath) {
  const files = fs.readdirSync(workspacePath);

  /* ================= SPRING BOOT ================= */
  if (files.includes("pom.xml")) {
    return {
      type: "spring-boot",
      command: "mvn spring-boot:run",
      port: 8080,
      mode: "server",
    };
  }

  /* ================= NODE / MERN ================= */
  if (files.includes("package.json")) {
    const pkg = JSON.parse(
      fs.readFileSync(
        path.join(workspacePath, "package.json"),
        "utf-8"
      )
    );

    if (pkg.dependencies?.react && pkg.scripts?.start) {
      return {
        type: "mern-client",
        command: "[ -d node_modules ] || npm install && npm start",
        port: 3000,
        mode: "server",
      };
    }

    if (pkg.dependencies?.express) {
      return {
        type: "node-api",
        command: "[ -d node_modules ] || npm install && npm start",
        port: 8000,
        mode: "server",
      };
    }

    if (pkg.scripts?.dev) {
      return {
        type: "node-dev",
        command: "[ -d node_modules ] || npm install && npm run dev",
        port: 3000,
        mode: "server",
      };
    }
  }

  /* ================= C++ PROJECT ================= */
  if (files.some(f => f.endsWith(".cpp"))) {
    return {
      type: "cpp",
      command: "g++ *.cpp -o app && ./app",
      mode: "single",
    };
  }

  /* ================= C PROJECT ================= */
  if (files.some(f => f.endsWith(".c"))) {
    return {
      type: "c",
      command: "gcc *.c -o app && ./app",
      mode: "single",
    };
  }

  return null;
}