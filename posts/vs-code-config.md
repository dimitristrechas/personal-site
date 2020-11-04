---
title: My Visual Studio Code Configuration
date: 11/7/2020
tags: Other
---

## My Visual Studio Code Configuration

### Extensions

- Bracket Pair Colorizer 2
- ES7 React/Redux/GraphQL/React-Native snippets
- ESLint
- GitLens
- Monokai Pro
- npm Intellisense
- Path Intellisense
- Prettier - Code formatter
- stylelint
- Tailwind CSS IntelliSense
- Todo+
- Version Lens
- Visual Studio IntelliCode
- vscode-icons

### settings.json

```json
{
  // Editor
  "editor.fontFamily": "Hack, Fira Code",
  "editor.showFoldingControls": "always",
  "editor.fontSize": 12,
  "editor.wordWrap": "on",
  "editor.rulers": [120],
  "editor.renderControlCharacters": false,
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "none",
  "editor.suggestSelection": "first",
  "breadcrumbs.enabled": true,
  "window.title": "${folderName}${separator}${activeFolderShort}${separator}${activeEditorShort}$",
  "window.zoomLevel": 0,
  "workbench.colorTheme": "Monokai",
  "workbench.startupEditor": "none",
  "workbench.tips.enabled": false,
  "workbench.activityBar.visible": true,
  "explorer.confirmDelete": false,
  "explorer.confirmDragAndDrop": false,
  "window.restoreWindows": "all",
  "workbench.iconTheme": "vscode-icons",
  "files.associations": { ".blade.php": "html", "*.sass": "scss" },
  // Emmet
  "emmet.includeLanguages": {
    "blade": "html"
  },
  "emmet.syntaxProfiles": { "javascript": "jsx" },
  // Terminal
  "terminal.integrated.fontSize": 10,
  "terminal.integrated.shell.windows": "cmd.exe",
  "terminal.integrated.shellArgs.windows": ["/k", "C:\\cmder\\vendor\\init.bat"],
  // ESLint, TSLint, stylelint & Prettier
  "stylelint.enable": false,
  "css.validate": false,
  "scss.validate": false,
  "eslint.alwaysShowStatus": true,
  "eslint.debug": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.tslint": true,
    "source.fixAll.stylelint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "prettier.disableLanguages": ["vue"],
  // Git & GitLens
  "git.ignoreMissingGitWarning": true,
  "gitlens.hovers.enabled": false,
  "gitlens.views.lineHistory.enabled": false,
  "gitlens.views.repositories.location": "gitlens",
  "gitlens.views.fileHistory.location": "gitlens",
  "gitlens.views.lineHistory.location": "gitlens",
  "gitlens.views.compare.location": "gitlens",
  "gitlens.views.search.location": "gitlens",
  "diffEditor.ignoreTrimWhitespace": false,
  // todo
  "todo.timekeeping.created.enabled": true,
  "todo.statistics.project.enabled": false,
  // unsorted
  "javascript.updateImportsOnFileMove.enabled": "always",
  "vsicons.dontShowNewVersionMessage": true,
  "versionlens.suggestions.showOnStartup": false
}
```
