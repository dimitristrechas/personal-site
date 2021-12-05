module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off", // Ignores React must always be in scope error
    "no-var": "warn", // requires const or let instead of var
    "prefer-const": "error", // aims at flagging variables that are declared using let keyword, but never reassigned after the initial assignment.
    "no-console": "off", // disallows calls or assignments to methods of the console object.
    "no-use-before-define": "warn", // warns when it encounters a reference to an identifier that has not yet been declared.
    "react/no-typos": "error", // prevents common typos
    "react/jsx-fragments": ["warn", "syntax"], // enforces <></> except when keys are needed
    "react/prop-types": "off", // validates your prop types regardless of how you define them.
    "react-hooks/rules-of-hooks": "error", // enforces rules of hooks
    "react/jsx-filename-extension": ["warn", { "extensions": [".js", ".jsx"] }], // restrict file extensions that may contain JSX
    "react/boolean-prop-naming": [
      "error",
      { "rule": "^(is|has)[A-Z]([A-Za-z0-9]?)+", "validateNested": true },
    ], //  enforces a consistent naming pattern for props which expect a boolean value
    // "react-hooks/exhaustive-deps": "warn"
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
