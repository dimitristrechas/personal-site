---
title: VS Code Workspaces
date: 22/10/2020
tags: Other
---

## VS Code Workspaces

VS Code provides two different scopes for settings:

1. **User Settings** - global settings for any VS Code window open
2. **Workspace Settings** - stored inside workspace

Workspace settings _override_ user settings.

A VS Code "workspace" is usually just the root project folder but you can also have more than one root folder in a workspace through Multi-root Workspaces. (Option: Add Folter to Workspace...)

When you save your workspace, it will create a .code-workspace file and the file name will be displayed in the File Explorer.

VS Code workspaces **are particularly useful** when you are working with different stacks/teams.

Lets imagine a senario where you work on a Laravel/React project with one team and a PHP/Angular project with another team.
It makes sense to create a workspace with specific settings for typescript/angular and another for javascript/react. Moreover if you work on a monorepo you may want to disable code formatting for php files (where another team works) and keep it for your frontend needs.
