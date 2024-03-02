import { PartialBy } from "../../default/mod.ts";

export type DenoCommandOptionsWithoutArgs = Omit<Deno.CommandOptions, "args">;

export type FsCommandOptions = DenoCommandOptionsWithoutArgs & {
  shouldThrowOnFailure?: boolean;
  command: string | URL;
};

export type InheritedFsCommandOptions = PartialBy<
  FsCommandOptions,
  "command"
>;

export type FsCommandExecuteOptions = PartialBy<
  FsCommandOptions,
  "command"
>;

export class FsCommand {
  command: string | URL;
  options: DenoCommandOptionsWithoutArgs;
  protected _shouldThrowOnFailure?: boolean;

  constructor(options: FsCommandOptions) {
    const { command, shouldThrowOnFailure, ...rest } = options;
    this.command = command;
    this._shouldThrowOnFailure = shouldThrowOnFailure;
    this.options = rest;
  }

  protected shouldThrowOnFailure(options?: FsCommandExecuteOptions): boolean {
    return Boolean(
      typeof options?.shouldThrowOnFailure === "boolean"
        ? options.shouldThrowOnFailure
        : this._shouldThrowOnFailure,
    );
  }

  getCommandInstance(
    args: string[],
    options: FsCommandExecuteOptions = {},
  ): Deno.Command {
    const { command, ...rest } = options;

    return new Deno.Command(command ?? this.command, {
      ...this.options,
      ...rest,
      args: args,
    });
  }

  async execute(
    args: string[],
    options?: FsCommandExecuteOptions,
  ): Promise<FsCommandOutput> {
    const command = this.getCommandInstance(args, options);

    const output = new FsCommandOutput(await command.output());

    if (this.shouldThrowOnFailure(options)) {
      FsCommandError.assertSuccess(output);
    }

    return output;
  }

  executeSync(
    args: string[],
    options?: FsCommandExecuteOptions,
  ): FsCommandOutput {
    const command = this.getCommandInstance(args, options);
    const output = new FsCommandOutput(command.outputSync());

    if (this.shouldThrowOnFailure(options)) {
      FsCommandError.assertSuccess(output);
    }

    return output;
  }

  protected getVerifyCommandInstance(
    options: FsCommandExecuteOptions = {},
  ): Deno.Command {
    const { command, ...rest } = options;
    return this.getCommandInstance([
      "-v",
      command?.toString() || this.command.toString(),
    ], {
      ...rest,
      command: "command",
    });
  }

  async verifyCommand(
    options?: FsCommandExecuteOptions,
  ): Promise<FsCommandOutput> {
    const commandInstance = this.getVerifyCommandInstance(options);
    const output = new FsCommandOutput(await commandInstance.output());

    if (this.shouldThrowOnFailure(options)) {
      FsCommandError.assertSuccess(output);
    }

    return output;
  }

  verifyCommandSync(options?: FsCommandExecuteOptions): FsCommandOutput {
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
  protected textDecoder: TextDecoder = new TextDecoder();

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

  getDecodedStdout(): string {
    return this.textDecoder.decode(this.output.stdout).trim();
  }

  getDecodedStderr(): string {
    return this.textDecoder.decode(this.output.stderr).trim();
  }
}

export class FsCommandError extends Error implements Deno.CommandOutput {
  readonly output: Deno.CommandOutput;
  protected textDecoder: TextDecoder = new TextDecoder();

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

  getDecodedStdout(): string {
    return this.textDecoder.decode(this.output.stdout).trim();
  }

  getDecodedStderr(): string {
    return this.textDecoder.decode(this.output.stderr).trim();
  }

  static assertSuccess(output: FsCommandOutput): void {
    if (!output.success) {
      throw new FsCommandError(output);
    }
  }
}
