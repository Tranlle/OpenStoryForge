# Welcome Page Design

## Scope

Add a new welcome page to the Electron desktop frontend in `web/desktop` without removing, replacing, or weakening any existing `home` page behavior.

This work introduces a separate route-level entry for project-first task creation while preserving the existing `home` page as a fully functional project workspace and conversation entry.

## Approved Direction

Use independent route pages powered by `react-router-dom` with shared application state.

The application should open on `/welcome` by default. The new welcome page becomes a separate top-level entry focused on project selection, project creation, and task kickoff. The existing `/home` page remains intact and continues to support its current new-conversation and conversation workflows.

## Product Semantics

The welcome page and the home page are not variants of the same screen. They are two different entry points with different user intent:

- `Welcome page`
  - project-first entry
  - user can select or create a project
  - folder is optional context, not a required identity field
  - sending a message creates a task node and then navigates into the `home` workspace
- `Home page`
  - workspace-first entry
  - all existing behavior remains available
  - creating a new conversation continues to mean creating a new task under the current project
  - this flow does not become responsible for creating or binding projects

## Design Constraints

- Use `react-router-dom` for route handling. Do not implement a custom routing layer.
- Do not remove any current `home` page features.
- Do not collapse the welcome page into the existing `home` page welcome state.
- Keep shared application data in a common state layer that both `/welcome` and `/home` consume.
- Model projects and tasks separately. A project is not equivalent to a folder.
- A project may exist without a folder.
- A task may carry folder context independent of project existence.
- Folder switching inside project conversations remains conceptually valid and must not be blocked by the new design.

## Route Structure

- `/welcome`
  - default application entry
  - renders the new welcome page
- `/home`
  - renders the existing home workspace
  - can show the existing new-conversation state and existing conversation content state

Optional later expansion can add route params or search params for deep-linking, but this request only requires two top-level routes plus shared selection state.

## Shared State Model

The current mock state is conversation-centric. The welcome page requires a project-first model. The shared application state should be reshaped to support both flows.

Recommended entities:

### Project

- `id`
- `name`
- `updatedAt`
- `linkedFolders: string[]`
- `tokenUsage`
- optional derived metadata used by the welcome page

### Task

- `id`
- `projectId`
- `title`
- `status`
- `modifiedAt`
- `folderContext`
- `messages`
- current model/preset/reasoning configuration

### View Selection State

- `currentProjectId`
- `currentTaskId`
- route location handled by React Router

This shared state can still live in local frontend state for now, but it should be organized so that later backend integration can swap in async actions without rewriting page-level semantics.

## Welcome Page Information Architecture

The welcome page uses a two-column structure similar to the current home page shell:

- left navigation menu
- right content area

### Welcome Page Left Navigation

The left menu contains only:

- `快速开始`
- `项目清单`
- `Token 用量`
- `项目树`
- `设置`

This menu is specific to `/welcome` and does not redefine or delete the `home` page navigation.

### Welcome Page Right Content Panels

#### 快速开始

Purpose:

- let users choose or create a project
- optionally specify folder context
- submit a first message
- create a task node
- navigate to `/home`

This panel should visually align with the existing composer pattern from `home`, but it has distinct submission semantics.

#### 项目清单

Purpose:

- show project-first browsing
- display project groups as primary rows
- allow expanding a project to reveal task nodes
- clicking a task node navigates to `/home` and opens that task

#### Token 用量

Purpose:

- show both global token totals and per-project aggregation
- use mock data for now
- reserve a shape that can be replaced by backend metrics later

#### 项目树

Purpose:

- show the five most recently modified projects
- collapsed by default
- clicking a project only expands or collapses it
- clicking a task node navigates to `/home`

#### 设置

Purpose:

- provide a welcome-page settings surface with explicit scaffold content, such as theme and workspace preferences cards
- can reuse existing styling patterns

## Quick Start Interaction Design

### Composer Behavior

The welcome page quick-start composer can reuse the current UI primitives for:

- prompt input
- model selection
- preset selection
- reasoning level selection
- send action

It must add project-aware behavior before send.

### Project Input

The project control should be a combo-box style input:

- searchable/selectable against existing projects
- editable for new project names
- capable of representing either:
  - an existing selected project
  - a new typed project name

### Folder Behavior

Folder is optional.

The user is not forced to bind a project to a folder before creating a task. A task may be created with:

- project only
- project plus folder context
- newly typed project plus optional folder context

Folder and project should therefore be treated as related but independent inputs.

### Send Flow

On welcome-page send:

1. Resolve project intent.
2. If the project name matches an existing project, bind to it.
3. If the project does not exist, create it in the frontend mock state and reserve a backend action for later real creation.
4. Create a new task node under that project.
5. Preserve selected folder as task context if present.
6. Navigate to `/home`.
7. Open the created task in the home workspace.

## Folder Dialog Design

The current folder dialog is shared UI that should be expanded rather than duplicated.

Add a `项目` input to the folder-selection experience with context-sensitive behavior:

- in `home`
  - display project information as read-only
  - keep current home semantics unchanged
- in `welcome` quick start
  - project field is editable and selectable
  - supports both choosing an existing project and typing a new one

This keeps one visual dialog contract while allowing page-specific behavior.

Because project and folder are not strictly coupled, the dialog should not imply that folder selection is mandatory for project creation.

## Home Page Preservation Rules

This request adds a page. It does not retire or simplify the current home page.

Implementation must preserve:

- the current `home` route content structure
- current new-conversation flow
- current conversation content flow
- current project/task workspace visuals unless explicitly changed later
- any current folder-switching concepts in the home workspace

If shared state extraction is needed, it should be done as a non-destructive refactor that reproduces current home behavior exactly.

## Technical Plan Boundaries

Expected frontend changes:

- install and wire `react-router-dom` into the renderer app
- add a route-aware app entry
- add a shared application state layer for projects and tasks
- add a dedicated welcome-page feature area
- adapt current mock data from conversation-only to project-plus-task shape
- extend shared composer/folder dialog primitives

Reserved action boundaries for later backend integration:

- `findProjects`
- `createProject`
- `createTask`
- `openTask`

These can remain mock implementations for now, but page logic should call them through clear boundaries instead of hard-coding all behavior in UI components.

## Error Handling Expectations

- empty prompt should not submit
- quick start should require a project selection or typed project name before submit
- invalid or empty new project names should show inline validation
- folder input may remain empty without blocking project or task creation
- duplicate project name input should bind to the existing project instead of silently creating a second visually identical project in mock state

## Mock Data Requirements

This version should support both of these at the same time:

- a realistic frontend-only mock flow that users can interact with immediately
- clear future replacement points for backend persistence

Mock data should therefore include:

- multiple projects
- per-project tasks
- recent update ordering
- mock token usage totals and per-project summaries

## Verification

- app opens to `/welcome`
- `/home` remains reachable and functionally unchanged
- sending from welcome quick start creates a task and navigates to `/home`
- clicking a task in welcome-page project list opens that task in `/home`
- clicking a task in welcome-page project tree opens that task in `/home`
- project tree shows at most five recent projects and starts collapsed
- home-page new conversation still creates a task within the current project context
- existing home UI behavior is preserved after shared-state refactor
