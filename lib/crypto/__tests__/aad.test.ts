import { describe, it, expect } from "vitest";
import { buildContentAAD, buildMappingAAD } from "../aad";

describe("buildContentAAD", () => {
  const validInput = {
    tenantId: "tenant-1",
    objectId: "obj-123",
    mimeType: "application/pdf",
    contentSizeBytes: 1024,
  };

  it("produces correct pipe-delimited format", () => {
    const aad = buildContentAAD(validInput);
    const str = new TextDecoder().decode(aad);
    expect(str).toBe("v1|content|tenant-1|obj-123|application/pdf|1024");
  });

  it("is deterministic (same input → identical bytes)", () => {
    const a = buildContentAAD(validInput);
    const b = buildContentAAD(validInput);
    expect(a).toEqual(b);
  });

  it("floors contentSizeBytes to integer", () => {
    const aad = buildContentAAD({ ...validInput, contentSizeBytes: 1024.7 });
    const str = new TextDecoder().decode(aad);
    expect(str).toContain("|1024");
    expect(str).not.toContain("1024.7");
  });

  it("rejects empty tenantId", () => {
    expect(() =>
      buildContentAAD({ ...validInput, tenantId: "" }),
    ).toThrow();
  });

  it("rejects empty objectId", () => {
    expect(() =>
      buildContentAAD({ ...validInput, objectId: "" }),
    ).toThrow();
  });

  it("rejects empty mimeType", () => {
    expect(() =>
      buildContentAAD({ ...validInput, mimeType: "" }),
    ).toThrow();
  });

  it("rejects pipe character in values", () => {
    expect(() =>
      buildContentAAD({ ...validInput, tenantId: "tenant|evil" }),
    ).toThrow(/pipe/i);
  });

  it("rejects negative contentSizeBytes", () => {
    expect(() =>
      buildContentAAD({ ...validInput, contentSizeBytes: -1 }),
    ).toThrow();
  });

  it("rejects NaN contentSizeBytes", () => {
    expect(() =>
      buildContentAAD({ ...validInput, contentSizeBytes: NaN }),
    ).toThrow();
  });

  it("rejects Infinity contentSizeBytes", () => {
    expect(() =>
      buildContentAAD({ ...validInput, contentSizeBytes: Infinity }),
    ).toThrow();
  });

  it("accepts zero contentSizeBytes", () => {
    const aad = buildContentAAD({ ...validInput, contentSizeBytes: 0 });
    const str = new TextDecoder().decode(aad);
    expect(str).toContain("|0");
  });
});

describe("buildMappingAAD", () => {
  const validInput = {
    tenantId: "tenant-1",
    userId: "user-abc",
    mappingVersion: 3,
  };

  it("produces correct pipe-delimited format", () => {
    const aad = buildMappingAAD(validInput);
    const str = new TextDecoder().decode(aad);
    expect(str).toBe("v1|mapping|tenant-1|user-abc|3");
  });

  it("is deterministic", () => {
    const a = buildMappingAAD(validInput);
    const b = buildMappingAAD(validInput);
    expect(a).toEqual(b);
  });

  it("floors mappingVersion to integer", () => {
    const aad = buildMappingAAD({ ...validInput, mappingVersion: 3.9 });
    const str = new TextDecoder().decode(aad);
    expect(str).toContain("|3");
    expect(str).not.toContain("3.9");
  });

  it("rejects empty tenantId", () => {
    expect(() =>
      buildMappingAAD({ ...validInput, tenantId: "" }),
    ).toThrow();
  });

  it("rejects empty userId", () => {
    expect(() =>
      buildMappingAAD({ ...validInput, userId: "" }),
    ).toThrow();
  });

  it("rejects pipe in userId", () => {
    expect(() =>
      buildMappingAAD({ ...validInput, userId: "user|id" }),
    ).toThrow(/pipe/i);
  });

  it("rejects negative mappingVersion", () => {
    expect(() =>
      buildMappingAAD({ ...validInput, mappingVersion: -1 }),
    ).toThrow();
  });
});
