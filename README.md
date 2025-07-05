# GoDaddy Repositories Viewer

A modern React + TypeScript app to browse and sort public repositories from the GoDaddy GitHub organization.

---

## 🚀 Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Start the development server

```sh
npm start
```

or

```sh
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

### 3. Run tests

```sh
npm test
```

or

```sh
npx vitest
```

---

## 🛠️ Libraries & Choices

- **React**: UI library for building interactive interfaces.
- **TypeScript**: Type safety and better developer experience.
- **Vite**: Fast dev server and build tool.
- **React Router DOM**: For client-side routing.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **@testing-library/react** & **Vitest**: For unit and integration testing with a modern, Jest-like API.

**Why these?**
- Vite offers a much faster dev experience than Create React App.
- Tailwind CSS allows for quick, responsive, and consistent styling.
- Vitest is a modern, fast test runner that works seamlessly with Vite and React.

---

## ⏳ Simplifications & Skipped Aspects

- **Authentication**: The app fetches public repositories from the GitHub API without authentication. For production, you may want to handle rate limits and errors more robustly.
- **Search**: The app does not include pagination, search, or filtering for repositories.
- **UI/UX**: The design is intentionally simple and responsive, focusing on functionality over polish. No advanced UI/UX patterns or animations are included.
- **Error Handling**: Error handling is basic and may not cover all edge cases (e.g., network failures, API rate limits).
- **Testing**: Only basic tests are included for demonstration. More comprehensive tests (e.g., error states, edge cases, integration tests) can be added.
- **Accessibility**: Accessibility (a11y) improvements and ARIA attributes are not fully implemented.
- **Performance**: No performance optimizations (e.g., code splitting, memoization beyond basics, Windowed List Rendering (react‑virtual), Asset & CSS Optimization, Infinite Scroll, ) have been applied.
- **State Management**: No external state management library (like Redux or Zustand) is used; state is managed locally in components.

---

## 📁 Project Structure

```
src/
  pages/         # Main page components (Home, RepoDetails)
  __test__/      # Unit/integration tests
  App.tsx        # Main app component
  main.tsx       # Entry point
  index.css      # Tailwind CSS imports
```

---

## 📄 License

MIT
# godaddy-assignment
