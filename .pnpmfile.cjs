/** @type {import('pnpm').Hooks} */
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
