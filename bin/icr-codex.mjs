#!/usr/bin/env node
import { main } from "../dist/cli.js";
main(["codex", ...process.argv.slice(2)]);
