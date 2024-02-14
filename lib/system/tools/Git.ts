import {
  FsCommand,
  FsCommandExecuteOptions,
  InheritedFsCommandOptions,
} from "./FsCommand.ts";

export class Git extends FsCommand {
  constructor(options: InheritedFsCommandOptions = {}) {
    super({
      command: "git",
      ...options,
    });
  }

  /**
   * Git status
   *
   * @link https://git-scm.com/docs/git-status
   */
  async status(args: string[] = [], options?: FsCommandExecuteOptions) {
    const res = await this.execute(["status", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git status (sync)
   *
   * @link https://git-scm.com/docs/git-status
   */
  statusSync(args: string[], options?: FsCommandExecuteOptions) {
    const res = this.executeSync(["status", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git add
   *
   * @link https://git-scm.com/docs/git-add
   */
  async add(args: string[], options?: FsCommandExecuteOptions) {
    const res = await this.execute(["add", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git add (sync)
   *
   * @link https://git-scm.com/docs/git-add
   */
  addSync(args: string[], options?: FsCommandExecuteOptions) {
    const res = this.executeSync(["add", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git commit
   *
   * @link https://git-scm.com/docs/git-commit
   */
  async commit(args: string[], options?: FsCommandExecuteOptions) {
    const res = await this.execute(["commit", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git commit (sync)
   *
   * @link https://git-scm.com/docs/git-commit
   */
  commitSync(args: string[], options?: FsCommandExecuteOptions) {
    const res = this.executeSync(["commit", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git log
   *
   * @link https://git-scm.com/docs/git-log
   */
  async log(args: string[], options?: FsCommandExecuteOptions) {
    const res = await this.execute(["log", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git log (sync)
   *
   * @link https://git-scm.com/docs/git-log
   */
  logSync(args: string[], options?: FsCommandExecuteOptions) {
    const res = this.executeSync(["log", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git push
   *
   * @link https://git-scm.com/docs/git-push
   */
  async push(args: string[], options?: FsCommandExecuteOptions) {
    const res = await this.execute(["push", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git push (sync)
   *
   * @link https://git-scm.com/docs/git-push
   */
  pushSync(args: string[], options?: FsCommandExecuteOptions) {
    const res = this.executeSync(["push", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git fetch
   *
   * @link https://git-scm.com/docs/git-fetch
   */
  async fetch(args: string[], options?: FsCommandExecuteOptions) {
    const res = await this.execute(["fetch", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git fetch (sync)
   *
   * @link https://git-scm.com/docs/git-fetch
   */
  fetchSync(args: string[], options?: FsCommandExecuteOptions) {
    const res = this.executeSync(["fetch", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git pull
   *
   * @link https://git-scm.com/docs/git-pull
   */
  async pull(args: string[], options?: FsCommandExecuteOptions) {
    const res = await this.execute(["pull", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git pull (sync)
   *
   * @link https://git-scm.com/docs/git-pull
   */
  pullSync(args: string[], options?: FsCommandExecuteOptions) {
    const res = this.executeSync(["pull", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git clone
   *
   * @link https://git-scm.com/docs/git-clone
   */
  async clone(args: string[], options?: FsCommandExecuteOptions) {
    const res = await this.execute(["clone", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git clone (sync)
   *
   * @link https://git-scm.com/docs/git-clone
   */
  cloneSync(args: string[], options?: FsCommandExecuteOptions) {
    const res = this.executeSync(["clone", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git reset
   *
   * @link https://git-scm.com/docs/git-reset
   */
  async reset(args: string[], options?: FsCommandExecuteOptions) {
    const res = await this.execute(["reset", ...args], options);
    return res.getDecodedStdout();
  }

  /**
   * Git reset (sync)
   *
   * @link https://git-scm.com/docs/git-reset
   */
  resetSync(args: string[], options?: FsCommandExecuteOptions) {
    const res = this.executeSync(["reset", ...args], options);
    return res.getDecodedStdout();
  }
}
