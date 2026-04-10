import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: { event: "app/hello.world" } },
  async ({ event }) => {
    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are and expert next.j developer. You write readble, maintainable code. You write simpel Next.js & React snippets.",
      model: gemini({ model: "gemini-2.5-flash" }),
    });
    const { output } = await codeAgent.run(
      `Write the followin snippet ${event.data.value}`,
    );
    console.log(output);

    return { output};
  },
);
