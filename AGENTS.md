# AGENTS

## Git Conventions

### Branch Names

Use this format:

`<TYPE>_<detail>`

Allowed branch type prefixes:

- `NEW_`
- `IMP_`
- `FIX_`
- `REF_`

Rules:

- Use `_`, never `-`.
- `detail` must explain the purpose of the branch.
- Keep the name short but descriptive.

Examples:

- `NEW_agent_context_docs`
- `IMP_gurb_join_tracking`
- `FIX_holder_change_skip_step`
- `REF_contract_form_navigation`

### Commit Messages

Use this format:

`<emoji> <stabler>: <message>`

Allowed stablers and emojis:

- `🏗️ build:` Changes that affect how the application is built or its requirements/dependencies for build
- `🔧 ci:` Changes related to CI pipeline configuration or scripts
- `📝 docs:` Documentation changes
- `✨ feat:` New functionality
- `🐛 fix:` Bug fixes
- `⚡️ perf:` Performance improvements
- `♻️ refactor:` Architectural or internal code changes without new functionality or bug fixes
- `🎨 style:` Formatting-only changes
- `✅ test:` Test-only additions or fixes
- `🚧 wip:` Work in progress, not final
- `🌐 i18n:` Translation changes
- `🦖 upgrade dependencies:` Dependency upgrades

Rules:

- Do not use conventional commit syntax like `feat(scope): ...`.
- Start directly with the emoji.
- Use only the allowed stablers listed above.
- Keep the message descriptive and outcome-oriented.

Examples:

- `📝 docs: add modular agent context guides`
- `🐛 fix: ignore local agent artifacts`
- `✨ feat: add gurb join return flow`
- `♻️ refactor: simplify contract step resolution`

## Documentation Maintenance

Update the project context docs proactively when a change makes them stale.

When to update docs automatically:

- A flow changes in a way that affects navigation, branching, submit behavior, or integrations.
- A new branch/workflow/pattern becomes the preferred team approach.
- A route, provider setup, theme split, or external integration changes the mental model of the project.
- Git conventions or team working rules change.

Minimum rule:

- If a code or workflow change would mislead a future agent reading `docs/agents/*`, update the relevant docs in the same branch.

On-demand review rule:

- If the user asks to review documentation, inspect current code and context docs and update any stale sections found.
