
# PUSH - Global Skate Network

AI-powered mobile application for skateboarders and downhill longboarders.

## 📂 Folder Structure

The project follows a **Feature-Based Architecture** to ensure scalability and maintainability.

| Directory | Purpose |
|-----------|---------|
| `core/` | Global singletons, configuration, constants, and analytics. |
| `components/` | Shared, dumb UI components (Buttons, Modals, Layouts). |
| `features/` | **Business Logic Pods**. Everything related to a domain (e.g., Spots, Crew). |
| `services/` | External API wrappers (Gemini AI, Backend Mock, Maps). |
| `store/` | Global State Management (Zustand). |
| `utils/` | Helper functions (Audio, Haptics, Formatters). |
| `views/` | Page-level components that compose features. |
| `types.ts` | Shared type definitions and contracts. |

## 🔐 Architecture Rules (Locking Scalability)

Think of this as guardrails, not bureaucracy.

### 🔑 CORE PRINCIPLE (Memorize This)

Code is allowed to know **"downwards"**, never "sideways" or "upwards".

```text
UI (Views/Components)
  ↓
Hooks (Interactors)
  ↓
Features (Domain Logic)
  ↓
Services (API/Backend)
  ↓
Core / External (Constants/Libs)
```

### 1️⃣ Folder Responsibility Rules (Hard Rules)

#### ✅ `features/` (Owns Business Logic)
*   **Allowed**: Feature-specific UI, Feature hooks, Feature services, Feature types.
*   **Forbidden**: Importing from other features’ internals, Global config mutations.
*   **Rule**: If removing this folder breaks **ONLY** one domain → it’s correct.

#### ✅ `components/` (Pure UI Only)
*   **Allowed**: Props, Styling, Animation, Reusable UI patterns.
*   **Forbidden**: API calls, Store access, Feature logic.
*   **Rule**: Components must be copy-pasteable into another app (Zero business logic).

#### ✅ `services/` (External Communication Only)
*   **Allowed**: API calls, Storage, Network logic, Data transformation.
*   **Forbidden**: JSX, UI imports, Feature imports.
*   **Rule**: Services should not know **why** data is used, only how to get it.

#### ✅ `store/` (State Containers Only)
*   **Allowed**: State, Actions, Selectors.
*   **Forbidden**: API calls (optional exception via services), UI logic.
*   **Rule**: One store slice = one domain.

#### ✅ `hooks/` (Glue Layer)
*   **Allowed**: Orchestration, Combining store + service + feature logic.
*   **Forbidden**: JSX, API logic directly.
*   **Rule**: Hooks explain **how** things work together.

#### ✅ `core/` (Cross-cutting, Boring, Stable)
*   **Allowed**: Constants, Config, Permissions, Analytics, Environment logic.
*   **Forbidden**: Feature-specific logic.
*   **Rule**: If this changes often, it doesn’t belong in core.

### 2️⃣ Dependency Rules (This Prevents Refactor Hell)

#### ✅ Allowed imports
*   `features` → `services`
*   `features` → `core`
*   `hooks` → `features`
*   `views` → `features`
*   `components` → **nothing** (except `core`)

#### ❌ Forbidden imports
*   `services` → `features`
*   `features` → `features` (directly - use the store or core for communication)
*   `components` → `services`
*   `core` → `features`

**Rule**: If you need to share logic → move it to `core/`.

### 3️⃣ Feature Isolation Rule (VERY Important)

**Rule**: Each feature must be **removable**.

Example:
*   Delete `features/game`
*   App still works without crashes (minus that specific feature)

**If deleting a feature breaks the whole app:**
❌ Feature is leaking responsibility.

### 4️⃣ “No Logic in Views” Rule

**Rule**: Views are ONLY for **Layout**, **Composition**, and **Navigation**.

**Bad**:
`useEffect(() => fetchSpots(), [])` inside a View.

**Good**:
`<SpotsMap />`
`<SpotList />`

**All logic belongs in**:
*   Feature hooks
*   Stores
*   Services

### 5️⃣ File Naming Rules (Reduce Cognitive Load)

**Rule**: Use boring, predictable names.

*   `*.service.ts` → External data / API calls.
*   `*.store.ts` → State management.
*   `use*.ts` → Custom hooks.
*   `*.types.ts` → Type definitions.
*   `index.ts` → Public API (Barrier file).

**If a file name doesn’t explain itself → rename it.**

### 6️⃣ Public API Rule (Barrier Files)

**Rule**: Every feature exposes **only** what’s allowed via its `index.ts`.

**Structure Example**:
```text
features/spots/
  ├── index.ts          <-- The Barrier
  ├── SpotCard.tsx
  ├── useSpots.ts
  └── spots.service.ts
```

**index.ts content**:
```typescript
export { SpotCard } from './SpotCard';
export { useSpots } from './useSpots';
```

**Import Rule**:
Other features must import **ONLY** from the barrier:
*   ✅ `import { SpotCard } from '@/features/spots'`
*   ❌ `import { SpotCard } from '@/features/spots/components/SpotCard'`

**Why**: This decouples internal structure from external usage, preventing massive refactors later.

### 7️⃣ Refactor Safety Check (The Pre-Merge Ritual)

**Before merging any big change, ask:**

1.  **Did I add logic to UI?** (If yes → Move to Hook)
2.  **Did I import across features?** (If yes → Use Barrier File or Move to Core)
3.  **Did I add API logic outside services?** (If yes → Move to Service)
4.  **Could this feature be removed safely?** (If no → Decouple it)

**If any answer is "Yes" (to the bad things) → FIX before merging.**

## 🏗️ Feature Architecture

Each folder in `features/` (e.g., `features/spots/`) must be self-contained:

- `index.ts`: **The Barrier File**. Only export what is necessary for other parts of the app.
- `api.ts`: API calls specific to this feature.
- `hooks/`: React hooks containing state and logic.
- `components/`: Feature-specific UI components.

**Rule**: Never import from inside a feature folder (e.g., `features/spots/components/InternalCard`). Always import from the barrier: `import { SpotCard } from '@/features/spots'`.

## 🚀 How to Add a New Feature

1.  **Create the Directory**: `features/your-feature-name/`
2.  **Add the Barrier**: Create `index.ts`.
3.  **Build Logic**: Add `hooks/useYourFeature.ts`.
4.  **Build UI**: Add `components/`.
5.  **Expose**: Export public hooks and components in `index.ts`.
6.  **Integrate**: Add the view to `views/` and route in `App.tsx`.

## 🛠️ Development Rules

1.  **Absolute Imports**: Always use `@/` for imports to avoid `../../../hell`.
    *   ✅ `import { useUser } from '@/store'`
    *   ❌ `import { useUser } from '../../../store'`
2.  **Logic Separation**: UI components should be "dumb". Logic goes in custom hooks.
3.  **Performance**: Use `memo` for list items (like Spot Cards) and keep global state selectors specific.
