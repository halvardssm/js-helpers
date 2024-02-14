import { PartialBy } from "../../default/mod.ts";

export type AbstractFsCommandOptions = Omit<Deno.CommandOptions, "args"> & {
  shouldThrowOnFailure?: boolean;
  command: string | URL;
};

export type InheritedFsCommandOptions = PartialBy<
  AbstractFsCommandOptions,
  "command"
>;

export type FsCommandExecuteOptions = PartialBy<
  AbstractFsCommandOptions,
  "command"
>;

export abstract class AbstractFsCommand {
  command: string | URL;
  protected _shouldThrowOnFailure?: boolean;

  constructor(options: AbstractFsCommandOptions) {
    this.command = options.command;
    this._shouldThrowOnFailure = options.shouldThrowOnFailure;
  }

  protected shouldThrowOnFailure(options?: FsCommandExecuteOptions): boolean {
    return Boolean(
      typeof options?.shouldThrowOnFailure === "boolean"
        ? options.shouldThrowOnFailure
        : this._shouldThrowOnFailure,
    );
  }

  getCommandInstance(args: string[], options: FsCommandExecuteOptions = {}) {
    const { command, ...rest } = options;

    return new Deno.Command(command ?? this.command, {
      args: args,
      ...rest,
    });
  }

  async execute(args: string[], options?: FsCommandExecuteOptions) {
    const command = this.getCommandInstance(args, options);

    const output = new FsCommandOutput(await command.output());

    if (this.shouldThrowOnFailure(options)) {
      FsCommandError.assertSuccess(output);
    }

    return output;
  }

  executeSync(args: string[], options?: FsCommandExecuteOptions) {
    const command = this.getCommandInstance(args, options);
    const output = new FsCommandOutput(command.outputSync());

    if (this.shouldThrowOnFailure(options)) {
      FsCommandError.assertSuccess(output);
    }

    return output;
  }

  protected getVerifyCommandInstance(options: FsCommandExecuteOptions = {}) {
    const { command, ...rest } = options;
    return this.getCommandInstance([
      "-v",
      command?.toString() || this.command.toString(),
    ], {
      ...rest,
      command: "command",
    });
  }

  async verifyCommand(options?: FsCommandExecuteOptions) {
    const commandInstance = this.getVerifyCommandInstance(options);
    const output = new FsCommandOutput(await commandInstance.output());

    if (this.shouldThrowOnFailure(options)) {
      FsCommandError.assertSuccess(output);
    }

    return output;
  }

  verifyCommandSync(options?: FsCommandExecuteOptions) {
    const commandInstance = this.getVerifyCommandInstance(options);
    const output = new FsCommandOutput(commandInstance.outputSync());

    if (this.shouldThrowOnFailure(options)) {
      FsCommandError.assertSuccess(output);
    }

    return output;
  }
}

export class FsCommandOutput implements Deno.CommandOutput {
  readonly output: Deno.CommandOutput;
  protected textDecoder = new TextDecoder();

  constructor(output: Deno.CommandOutput) {
    this.output = output;
  }

  get stdout(): Uint8Array {
    return this.output.stdout;
  }
  get stderr(): Uint8Array {
    return this.output.stderr;
  }
  get success(): boolean {
    return this.output.success;
  }
  get code(): number {
    return this.output.code;
  }
  get signal(): Deno.Signal | null {
    return this.output.signal;
  }

  getDecodedStdout() {
    return this.textDecoder.decode(this.output.stdout).trim();
  }

  getDecodedStderr() {
    return this.textDecoder.decode(this.output.stderr).trim();
  }
}

export class FsCommandError extends Error implements Deno.CommandOutput {
  readonly output: Deno.CommandOutput;
  protected textDecoder = new TextDecoder();

  constructor(output: Deno.CommandOutput) {
    super(`Command failed with code ${output.code}`);
    this.output = output;
  }

  get stdout(): Uint8Array {
    return this.output.stdout;
  }
  get stderr(): Uint8Array {
    return this.output.stderr;
  }
  get success(): boolean {
    return this.output.success;
  }
  get code(): number {
    return this.output.code;
  }
  get signal(): Deno.Signal | null {
    return this.output.signal;
  }

  getDecodedStdout() {
    return this.textDecoder.decode(this.output.stdout).trim();
  }

  getDecodedStderr() {
    return this.textDecoder.decode(this.output.stderr).trim();
  }

  static assertSuccess(output: FsCommandOutput) {
    if (!output.success) {
      throw new FsCommandError(output);
    }
  }
}
