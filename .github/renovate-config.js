/** @type {import('renovate').GlobalConfig} */
module.exports = {
  branchPrefix: "renovate/",
  onboarding: false,
  requireConfig: "optional",
  repositories: [process.env.RENOVATE_REPOSITORIES ?? process.env.GITHUB_REPOSITORY],
};
