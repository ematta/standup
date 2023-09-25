import { exists } from "https://deno.land/std@0.202.0/fs/mod.ts";

const { args } = Deno;

const dir = `${Deno.env.get("HOME")}/.standup/`;
const fileDate = new Date().toISOString().split("T")[0];

if (args.includes("--today")) {
  await read(`${dir}/${fileDate}`);
} else if (args.includes("--yesterday")) {
  await read(`${dir}/${getYesterdaysDate()}`);
} else {
  await write();
}

function getYesterdaysDate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}

async function read(file: string) {
  const decoder = new TextDecoder("utf-8");
  const data = await Deno.readFile(file);
  console.log(decoder.decode(data));
}

async function write() {
  const action = prompt("What did you do today? ");
  const timestamp = Date.now().toString();

  const isReadableDir = await exists(dir, {
    isReadable: true,
    isDirectory: true,
  });

  if (!isReadableDir) {
    Deno.mkdir(dir, { recursive: true });
  }

  await Deno.writeFile(
    `${dir}/${fileDate}`,
    new TextEncoder().encode(
      `${timestamp}: ${action}\n`,
    ),
    {
      append: true,
      create: true,
    },
  );
}
