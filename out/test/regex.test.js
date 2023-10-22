"use strict";
const enumRegExp = /enum\s+([\w\d_]+)\s*{[^{}]*}/g;
describe("enumRegExp", () => {
    it("should match a single enum block", () => {
        const dartCode = `
        enum MyEnum {
            value1,
            value2,
        }
    `;
        const matches = dartCode.match(enumRegExp);
        if (matches !== null) {
            expect(matches).toHaveLength(1);
            expect(matches[0]).toContain("enum MyEnum");
        }
        else {
            fail("matches should not be null");
        }
    });
    it("should match multiple enum blocks", () => {
        const dartCode = `
      enum EnumA {
        value1,
        value2,
      }

      enum EnumB {
        optionA,
        optionB,
      }
    `;
        const matches = dartCode.match(enumRegExp);
        expect(matches).not.toBeNull();
        expect(matches).toHaveLength(2);
        expect(matches[0]).toContain("enum EnumA");
        expect(matches[1]).toContain("enum EnumB");
    });
    it("should not match incomplete enum blocks", () => {
        const dartCode = `
      enum EnumIncomplete {
        value1,
    `;
        const matches = dartCode.match(enumRegExp);
        expect(matches).toBeNull();
    });
});
describe("check for extension", () => {
    // already exists
    it("should return true if extension already exists for a particular enum", () => {
        const enumName = "Status";
        const invalidEnumName = "MyEnum2"; // Replace with the enum name you want to check for
        const dartCode = `
      enum Status {
        none,
        loading,
        success,
        error,
      }
      
      extension StatusExtension on Status {
        bool get isNone => this == Status.none;
        bool get isLoading => this == Status.loading;
        bool get isSuccess => this == Status.success;
        bool get isError => this == Status.error;
      }
      
  `;
        // Create a regular expression pattern to match the extension on the specified enum
        const extensionRegExp1 = new RegExp(`extension\\s+[^{}]+\\s+on\\s+${enumName}\\s*{`, "s");
        const extensionRegExp2 = new RegExp(`extension\\s+[^{}]+\\s+on\\s+${invalidEnumName}\\s*{`, "s");
        const isExtensionDefined = extensionRegExp1.test(dartCode);
        const isExtensionDefined2 = extensionRegExp2.test(dartCode);
        console.log(`Is there an extension on ${enumName}? ${isExtensionDefined}`);
        console.log(`Is ${enumName} extension defined? ${isExtensionDefined}`);
        expect(isExtensionDefined).toBe(true);
        expect(isExtensionDefined2).toBe(false);
        const match = dartCode.match(extensionRegExp1);
        if (match) {
            // Extract the matched text (the extension block)
            const extensionBlock = match[0];
            // Get the start and end positions of the extension block
            const startPosition = dartCode.indexOf(extensionBlock);
            const endPosition = startPosition + extensionBlock.length;
            // Create a Range using the start and end positions
            // Now, 'range' represents the range of the extension block in the document.
            console.log("Range:", match);
        }
        // Usage:
    });
});
//# sourceMappingURL=regex.test.js.map