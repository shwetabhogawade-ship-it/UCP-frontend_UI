# Incremental HTML → React Update Workflow

## Purpose

This workflow is used when:

* A React project already exists
* The React project was generated from an older HTML version
* A newer HTML version is now available
* Only the incremental differences should be applied

The goal is to synchronize the existing React implementation with the newer HTML version while preserving architecture and avoiding unnecessary rewrites.

---

# Supported Version Naming

The workflow must support ANY version progression.

Examples:

* dashboard_v1.html → dashboard_v2.html
* dashboard_v2.html → dashboard_v3.html
* dashboard_v3.html → dashboard_v4.html
* users_old.html → users_new.html
* settings_previous.html → settings_latest.html

Rules:

* Older file = currently implemented version
* Newer file = target version to match

Do NOT assume versions are always v1 and v2.

---

# Core Objective

The React implementation already exists.

DO NOT regenerate the full page/application.

ONLY implement the incremental differences between the older and newer HTML versions.

The final React implementation should match the newer HTML version while preserving the existing React architecture.

---

# Required Workflow

## Step 1 — Analyze Differences

Before generating code:

1. Compare older and newer HTML files
2. Detect all UI and behavior differences
3. Categorize differences into:

   * Added elements/components
   * Removed elements/components
   * Modified layouts
   * Styling/class changes
   * Text/content updates
   * Interaction/behavior updates
   * Responsive behavior updates

Do NOT generate React code during this step.

---

# Step 2 — Map Changes to Existing React Code

Identify:

* Existing React components affected
* Existing hooks/services affected
* Existing styles affected
* Existing routes/layouts affected

Reuse existing components whenever possible.

Avoid duplicate structures.

---

# Step 3 — Apply Incremental Updates Only

Implement ONLY the required changes.

Allowed:

* Small targeted component updates
* Minimal JSX modifications
* Small styling updates
* Incremental logic changes
* Component additions if truly required
* Removal of deprecated UI

Not Allowed:

* Full-page rewrites
* Recreating stable components
* Refactoring unrelated files
* Renaming architecture unnecessarily
* Rebuilding routing/state structure
* Massive formatting-only changes

---

# Critical Rules

## Architecture Preservation

Always preserve:

* Existing folder structure
* Existing component hierarchy
* Existing routing
* Existing state management
* Existing hooks/services
* Existing naming conventions

---

## Minimal Diff Philosophy

Think like:

* Git diff
* Patch update
* Incremental merge

NOT like:

* Full project scaffolding
* Fresh migration
* Complete rewrite

---

## Component Reuse Rules

Before creating new components:

1. Search for reusable existing components
2. Extend existing implementation if possible
3. Avoid duplicate UI abstractions

---

## File Modification Rules

Only modify impacted files.

If a file does not require changes:

* Do NOT regenerate it
* Do NOT rewrite it

---

## Styling Rules

Preserve:

* Existing Tailwind structure
* Existing CSS architecture
* Existing theme system

Only apply style changes required for parity with the newer HTML version.

---

## Logic Migration Rules

If the newer HTML changes interactions:

* Apply minimal logic updates
* Preserve existing hooks/state patterns
* Avoid unnecessary refactors

---

# Output Requirements

Always return:

## 1. Difference Summary

Explain:

* What changed
* What was added
* What was removed
* What was updated

---

## 2. Affected React Files

List ONLY files requiring modification.

---

## 3. Minimal Code Patches

Provide:

* Small targeted changes
* Minimal JSX updates
* Minimal logic updates
* Minimal styling changes

Avoid full-file regeneration unless absolutely necessary.

---

## 4. Dependencies/Assets

Mention:

* New assets
* New icons
* New packages
* New API requirements

ONLY if actually required.

---

# Preferred AI Behavior

The AI should behave like:

* Senior frontend engineer
* Incremental migration specialist
* Git patch generator

NOT like:

* Boilerplate generator
* Full-page converter
* Scaffolding tool

---

# Prompt Usage

Example:

"Compare dashboard_v3.html and dashboard_v4.html and synchronize the existing React implementation with the newer HTML version using the Incremental HTML → React Update Workflow."

---

# Ideal Final Result

The final React codebase should:

* Match the newer HTML version visually and functionally
* Preserve existing React architecture
* Avoid unnecessary rewrites
* Keep diffs minimal
* Remain production-safe
* Remain maintainable
