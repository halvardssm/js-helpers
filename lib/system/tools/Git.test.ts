import {
  assert,
  assertEquals,
  assertInstanceOf,
  assertThrows,
  describe,
  it,
} from "../../deps_dev.ts";
import { Git } from "./Git.ts";

describe("Git tests", () => {
  it("constructor", async () => {
    const git = new Git();
    assertInstanceOf(git, Git);
    assertEquals(git.command, "git");
    const res = await git.verifyCommand();
    assert(
      res.success,
      `Git command not found (code: '${res.code}'): ${res.getDecodedStderr()}`,
    );
  });

  it("status command", async () => {
    const git = new Git();
    const res = await git.status();
  });
});
