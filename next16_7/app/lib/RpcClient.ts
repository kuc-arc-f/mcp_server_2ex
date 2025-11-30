// app/lib/RpcClient.ts
import { spawn } from "child_process";

class RpcClient {
  constructor(command: any) {
    /* @ts-ignore */
    this.proc = spawn(command);
    /* @ts-ignore */
    this.idCounter = 1;
    /* @ts-ignore */
    this.pending = new Map();

    /* @ts-ignore */
    this.proc.stdout.setEncoding("utf8");
    /* @ts-ignore */
    this.proc.stdout.on("data", (data) => this._handleData(data));
    /* @ts-ignore */
    this.proc.stderr.on("data", (err) => console.error("MCP stderr:", err.toString()));
    /* @ts-ignore */
    this.proc.on("exit", (code) => console.log(`MCP server exited (${code})`));
  }

  _handleData(data: any) {
    // 複数行対応
    /* @ts-ignore */
    data.split("\n").forEach((line) => {
      if (!line.trim()) return;
      try {
        const msg = JSON.parse(line);
       /* @ts-ignore */
        if (msg.id && this.pending.has(msg.id)) {
          /* @ts-ignore */
          const { resolve } = this.pending.get(msg.id);
          /* @ts-ignore */
          this.pending.delete(msg.id);
          resolve(msg.result);
        }
      } catch (e) {
        //console.error("JSON parse error:", e, line);
      }
    });
  }

  call(method: any, params = {}) {
    /* @ts-ignore */
    const id = this.idCounter++;
    const payload = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    };

    return new Promise((resolve, reject) => {
      /* @ts-ignore */
      this.pending.set(id, { resolve, reject });
      /* @ts-ignore */
      this.proc.stdin.write(JSON.stringify(payload) + "\n");
    });
  }

  close() {
    /* @ts-ignore */
    this.proc.kill();
  }
}
export default RpcClient;