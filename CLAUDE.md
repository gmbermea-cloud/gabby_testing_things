# CLAUDE.md

This file provides guidance to AI assistants (Claude and others) working in this repository.

## Repository Overview

**Name**: gabby_testing_things
**Owner**: gmbermea-cloud
**Status**: Freshly initialized — no source code, dependencies, or tooling yet.

This is a blank-slate repository. There is currently no application code, build system, test framework, or CI/CD configuration. The only file present at initialization is `README.md`.

## Current Structure

```
gabby_testing_things/
└── README.md       # Project heading only
```

## Development Conventions

Since no language or framework has been chosen yet, the following general conventions apply until a stack is established:

### Git Workflow
- Default development branch: `master`
- Feature and AI-assistant branches follow the pattern: `claude/<task-id>`
- Write clear, descriptive commit messages (imperative mood: "Add feature X", not "Added feature X")
- Keep commits focused — one logical change per commit

### Adding New Code
When introducing a language or framework for the first time:
1. Add an appropriate dependency file (`package.json`, `requirements.txt`, `Cargo.toml`, etc.)
2. Add a `.gitignore` suited to the chosen stack
3. Update this `CLAUDE.md` with the chosen stack, build commands, test commands, and conventions
4. Update `README.md` with setup and usage instructions

### File Organization
Follow standard conventions for whichever language/framework is adopted:
- Source code in `src/` or a language-conventional directory
- Tests alongside source or in a top-level `tests/` directory
- Configuration files at the repository root

## Commands

No build, test, or run commands are defined yet. Update this section when a stack is chosen.

| Task | Command |
|------|---------|
| Build | _TBD_ |
| Test | _TBD_ |
| Lint | _TBD_ |
| Run  | _TBD_ |

## Key Notes for AI Assistants

- This repository is a clean starting point. Do not assume any framework or library is available.
- When asked to implement something, first establish the appropriate toolchain before writing application code.
- Always read existing files before editing them.
- Prefer editing existing files over creating new ones when both approaches work equally well.
- Do not add unnecessary boilerplate, comments, or abstractions beyond what is explicitly requested.
- Keep solutions minimal and focused on the task at hand.

## Updating This File

This `CLAUDE.md` should be updated whenever:
- A language or framework is chosen
- Build/test/lint commands are established
- New architectural decisions or conventions are made
- The project structure changes significantly
