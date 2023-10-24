import fs from "fs/promises";

export async function loadFromFile(fileName: string) {
  const file = await fs.readFile(fileName, { encoding: "utf8" });

  return file.split("\n").filter(Boolean).map((item) => item.trim());
}
