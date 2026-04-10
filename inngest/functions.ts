import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { step } from "inngest";
import { getSandbox } from "./utils";
export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: { event: "app/hello.world" } },
  async ({ event }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("viber-nextjs-test-2");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "code-agent",
      system:
        "You are and expert next.j developer. You write readble, maintainable code. You write simpel Next.js & React snippets.",
      model: gemini({ model: "gemini-2.5-flash" }),
    });
    const { output } = await codeAgent.run(
      `Write the followin snippet ${event.data.value}`,
    );

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return { output, sandboxUrl };
  },
);
