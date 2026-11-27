/** @type {import('pnpm').Hooks} */
// TypeScript 7 has no JS compiler API yet: route typescript-eslint through the
// TS 6 compatibility package while the root typescript package supplies TS 7.
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (
        pkg.name === "typescript-eslint" ||
        (typeof pkg.name === "string" && pkg.name.startsWith("@typescript-eslint/")) ||
        pkg.name === "ts-api-utils"
      ) {
        if (pkg.peerDependencies?.typescript) {
          delete pkg.peerDependencies.typescript;
        }

        pkg.dependencies = {
          ...pkg.dependencies,
          typescript: "npm:@typescript/typescript6@6.0.2",
        };
      }

      return pkg;
    },
  },
};
