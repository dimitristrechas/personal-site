---
title: My Visual Studio Code Configuration
date: 11/7/2020
---

## My Visual Studio Code Configuration

### Extensions

- Bracket Pair Colorizer
- Debugger for Chrome
- ES7 React/Redux/GraphQL/React-Native snippets
- ESLint
- GitLens
- Monokai Pro
- npm Intellisense
- Path Intellisense
- Prettier - Code formatter
- Todo+
- Version Lens
- laravel-blade
- vscode-icons

### settings.json

```json
{
  // Editor
  "git.ignoreMissingGitWarning": true,
  "editor.fontFamily": "Hack, Fira Code",
  "editor.fontLigatures": false,
  "editor.showFoldingControls": "always",
  "editor.fontSize": 12,
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.renderControlCharacters": false,
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "none",
  "editor.suggestSelection": "first",
  "breadcrumbs.enabled": true,
  "window.title": "${folderName}${separator}${activeFolderShort}${separator}${activeEditorShort}$",
  "window.zoomLevel": 0,
  "workbench.sideBar.location": "left",
  "workbench.colorTheme": "Monokai Classic",
  "workbench.startupEditor": "none",
  "workbench.tips.enabled": false,
  "workbench.activityBar.visible": true,
  "explorer.confirmDelete": false,
  "window.restoreWindows": "all",
  "workbench.iconTheme": "vscode-icons",
  "files.associations": { ".blade.php": "html", "*.sass": "scss" },
  // Emmet
  "emmet.includeLanguages": {
    "blade": "html"
  },
  // Terminal
  "terminal.integrated.fontSize": 10,
  "terminal.integrated.shell.windows": "cmd.exe",
  "terminal.integrated.shellArgs.windows": [
    "/k",
    "C:\\cmder\\vendor\\init.bat"
  ],
  // ESLint & Prettier
  "editor.formatOnSave": true,
  "eslint.alwaysShowStatus": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "prettier.disableLanguages": ["php"],
  "prettier.singleQuote": false,
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // Git lens
  "gitlens.hovers.enabled": false,
  "gitlens.views.lineHistory.enabled": false,
  "gitlens.views.repositories.location": "gitlens",
  "gitlens.views.fileHistory.location": "gitlens",
  "gitlens.views.lineHistory.location": "gitlens",
  "gitlens.views.compare.location": "gitlens",
  "gitlens.views.search.location": "gitlens",
  // todo
  "todo.timekeeping.created.enabled": true,
  "todo.statistics.project.enabled": false,
  // unsorted
  "javascript.updateImportsOnFileMove.enabled": "always",
  "explorer.confirmDragAndDrop": false,
  "diffEditor.ignoreTrimWhitespace": false,
  "vsicons.dontShowNewVersionMessage": true,
  "versionlens.suggestions.showOnStartup": true
}
```
