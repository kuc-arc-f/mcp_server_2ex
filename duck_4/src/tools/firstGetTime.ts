import { generateText, tool } from "ai";
import { z } from "zod";
import dayjs  from 'dayjs';

export const firstGetTime = tool({
  description: "現在の 時間を返す。",
  parameters: z.object({
  }),
  execute: async () => {
    const tm = dayjs().format('HH:mm:ss')
    return tm;
  },
});
