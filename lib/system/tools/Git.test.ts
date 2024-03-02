import { afterAll, afterEach, beforeAll, describe, it } from "@std/testing/bdd";
import {
  assert,
  assertEquals,
  assertInstanceOf,
  assertStringIncludes,
} from "@std/assert";
import { resolve } from "@std/path";
import { emptyDirSync } from "@std/fs";
import { Git } from "./Git.ts";

const TEST_FOLDER_PATH = resolve(Deno.cwd(), ".tests");
const TEST_FILE_PATH = resolve(TEST_FOLDER_PATH, "test.txt");

describe("Git tests", () => {
  beforeAll(() => {
    Deno.mkdirSync(TEST_FOLDER_PATH, { recursive: true });
  });

  afterAll(() => {
    Deno.removeSync(TEST_FOLDER_PATH, { recursive: true });
  });

  afterEach(() => {
    emptyDirSync(TEST_FOLDER_PATH);
  });

  it("command exists", async () => {
    const git = new Git();
    assertInstanceOf(git, Git);
    assertEquals(git.command, "git");
    const res = await git.verifyCommand();
    assert(
      res.success,
      `Git command not found (code: '${res.code}'): ${res.getDecodedStderr()}`,
    );
  });

  it("init & status", async () => {
    const git = new Git();
    const resInit = await git.init([], { cwd: TEST_FOLDER_PATH });
    assertEquals(
      resInit,
      `Initialized empty Git repository in ${TEST_FOLDER_PATH}/.git/`,
    );
    const resStatus = await git.status([], { cwd: TEST_FOLDER_PATH });
    assertEquals(
      resStatus,
      `On branch main\n\nNo commits yet\n\nnothing to commit (create/copy files and use "git add" to track)`,
    );
    const resStatusShort = await git.statusShort([], {
      cwd: TEST_FOLDER_PATH,
    });
    assertEquals(resStatusShort, "");
  });

  it.only("adds a file into the version change", async () => {
    const git = new Git({ cwd: TEST_FOLDER_PATH });
    await git.init();

    const statusPre = await git.statusShort();

    assertEquals(statusPre, "");

    Deno.writeTextFileSync(TEST_FILE_PATH, "hello world");
    await git.add([TEST_FILE_PATH]);

    const statusMid = await git.statusShort();

    assertEquals(statusMid, "A  test.txt");

    const addRes = await git.add([TEST_FILE_PATH]);

    assertEquals(addRes, "");

    const commitRes = await git.commit(["-m", "test commit"]);

    assertStringIncludes(commitRes, "1 file changed, 1 insertion(+)");
  });
});
