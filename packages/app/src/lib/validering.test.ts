import { describe, expect, it } from "vitest";
import { allBelongToJob, ids, isUploadThingUrl } from "./validering";

describe("allBelongToJob (ägarskap för underrader)", () => {
  const befintliga = [{ id: "a" }, { id: "b" }];

  it("nya rader utan id och egna id:n godkänns", () => {
    expect(allBelongToJob([{ id: "a" }, {}], befintliga)).toBe(true);
  });

  it("id från ett annat jobb nekas", () => {
    expect(allBelongToJob([{ id: "a" }, { id: "annans" }], befintliga)).toBe(
      false,
    );
  });

  it("ids hoppar över rader utan id", () => {
    expect(ids([{ id: "a" }, {}, { id: "c" }])).toEqual(["a", "c"]);
  });
});

describe("isUploadThingUrl", () => {
  it("godkänner UploadThing-URL som matchar nyckeln", () => {
    expect(
      isUploadThingUrl({ url: "https://abc.ufs.sh/f/nyckel1", key: "nyckel1" }),
    ).toBe(true);
    expect(
      isUploadThingUrl({ url: "https://utfs.io/f/nyckel1", key: "nyckel1" }),
    ).toBe(true);
  });

  it("nekar andra värdar, http och fel nyckel", () => {
    expect(
      isUploadThingUrl({ url: "https://evil.se/f/nyckel1", key: "nyckel1" }),
    ).toBe(false);
    expect(
      isUploadThingUrl({ url: "http://abc.ufs.sh/f/nyckel1", key: "nyckel1" }),
    ).toBe(false);
    expect(
      isUploadThingUrl({ url: "https://abc.ufs.sh/f/annan", key: "nyckel1" }),
    ).toBe(false);
    expect(isUploadThingUrl({ url: "inte en url", key: "x" })).toBe(false);
    expect(isUploadThingUrl({ url: "https://abc.ufs.sh/f/", key: "" })).toBe(
      false,
    );
  });
});
