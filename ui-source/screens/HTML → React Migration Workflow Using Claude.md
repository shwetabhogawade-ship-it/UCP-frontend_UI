

# **HTML → React Migration Workflow Using Claude**

## **1\. Prepare the Input Before Giving It to Claude**

Organize the source UI properly before prompting.

### **Recommended Folder Structure**

```
/ui-source
  /screens
    dashboard.html
    users.html
    settings.html

  /styles
    app.css
    theme.css

  /assets
    images/
    icons/

  /js
    legacy.js
```

### **Extract These Things First**

| Artifact | Why |
| :---- | :---- |
| HTML pages | Component identification |
| CSS files | Styling migration |
| JS behavior | Event/state handling |
| Images/icons | Asset migration |
| Figma references (optional) | Design validation |

---

# **2\. Decide the Target React Architecture**

Before asking Claude to generate code, define the architecture.

## **Recommended Stack**

| Layer | Recommendation |
| :---- | :---- |
| Framework | React \+ Vite |
| Language | TypeScript |
| Styling | Tailwind or CSS Modules |
| State | Zustand / Redux Toolkit |
| Routing | React Router |
| Forms | React Hook Form |
| API | Axios / React Query |
| UI System | shadcn/ui or Material UI |

---

# 

# 

# 

# **3\. Ask Claude to First Analyze — NOT Generate**

Do not immediately ask for React code.

First ask Claude to analyze the HTML.

## **Prompt**

```
Analyze this HTML application and provide:

1. Component hierarchy
2. Reusable component candidates
3. Routing structure
4. State management needs
5. Form handling strategy
6. API integration points
7. Responsive layout observations
8. Suggested React folder structure
9. Technical debt/issues in existing HTML
10. Migration risks

Do not generate code yet.
```

This step dramatically improves output quality.

# 

# 

# 

# **4\. Define Migration Rules for Claude**

Claude performs much better with strict rules.

Use instructions like:

```
You are a senior React architect.

Convert the provided HTML into a production-grade React application.

Rules:
1. Use functional components only
2. Use TypeScript
3. Create reusable components
4. Remove duplicated markup
5. Use React Router for navigation
6. Preserve responsive behavior
7. Use semantic HTML
8. Replace jQuery/dom manipulation with React state
9. Separate presentation and business logic
10. Create clean folder structure
11. Use Tailwind CSS
12. Follow accessibility best practices
13. Componentize repeated cards/tables/modals/forms
14. Generate API service layer separately
15. Avoid inline styles
```

---

**5\. Ask Claude to Create the React Architecture**

After analysis:

## **Prompt**

```
Generate the React application architecture.

Include:
- Folder structure
- Routing structure
- Shared components
- Layout system
- Theme structure
- State management approach
- API layer structure
- Reusable hooks
- Error boundary strategy
- Loading strategy
- Authentication handling
- Environment configuration

Use React + TypeScript + Vite + Tailwind.
```

---

# **6\. Convert Screen-by-Screen (Very Important)**

Do NOT migrate the entire app in one prompt.

Use one screen at a time.

## **Good Approach**

```
Convert dashboard.html into:

1. Reusable React components
2. TypeScript interfaces
3. Tailwind styling
4. Hooks for interactions
5. Responsive layouts
6. Clean JSX
7. Separate API calls
8. Accessible components

Output:
- Component files
- CSS/Tailwind classes
- Types
- Hooks
- Services
```

---

# **7\. Force Component Decomposition**

Claude sometimes creates huge files.

Add constraints:

```
Rules:
- No component > 250 lines
- Extract reusable table component
- Extract modal component
- Extract form fields
- Extract layout wrapper
- Extract navigation sidebar
- Extract chart wrappers
```

---

# **8\. Migrate Legacy JavaScript Properly**

If HTML uses jQuery or vanilla JS:

## **Ask Claude**

```
Convert this DOM manipulation logic into React patterns.

Replace:
- querySelector
- addEventListener
- jQuery
- manual DOM updates

Use:
- useState
- useEffect
- useMemo
- controlled components
- refs only where necessary
```

---

# **9\. Ask Claude to Generate Enterprise Structure**

## **Example Prompt**

```
Refactor generated code into enterprise-grade architecture.

Requirements:
- Feature-based folders
- Shared UI library
- Reusable hooks
- API abstraction
- Constants/config separation
- Error boundaries
- Suspense/lazy loading
- Proper typing
- Barrel exports
- Environment separation
```

---

# **10\. Add Validation and Quality Gates**

After generation:

## **Ask Claude**

```
Review this React code for:

1. Anti-patterns
2. Performance issues
3. Accessibility problems
4. Re-render risks
5. Type safety issues
6. Component coupling
7. Reusability improvements
8. Security concerns
9. Responsive issues
10. Production readiness
```

---

# **11\. Recommended React Project Structure**

```
src/
 ├── app/
 ├── routes/
 ├── layouts/
 ├── features/
 │    ├── dashboard/
 │    ├── users/
 │    └── settings/
 ├── components/
 │    ├── ui/
 │    ├── forms/
 │    ├── tables/
 │    └── charts/
 ├── hooks/
 ├── services/
 ├── store/
 ├── utils/
 ├── types/
 ├── assets/
 ├── styles/
 └── constants/
```

---

# **12\. Best Prompt Pattern (Highly Effective)**

Use this pattern repeatedly.

```
Context:
You are modernizing a legacy HTML application into React.

Task:
Convert the attached HTML screen into production-grade React.

Technical Stack:
- React
- TypeScript
- Vite
- Tailwind
- React Router
- React Hook Form

Requirements:
- Componentize aggressively
- Create reusable components
- Preserve exact UI behavior
- Improve accessibility
- Optimize rendering
- Avoid duplication
- Enterprise-grade architecture

Output Format:
1. Folder structure
2. Component breakdown
3. Type definitions
4. React components
5. Hooks
6. API services
7. Styling
8. Migration notes
```

---

# **13\. What NOT To Do**

## **Avoid**

### **❌ Huge Single Prompt**

```
Convert this entire 40-page app
```

### **❌ No Architecture Guidance**

Claude will produce messy code.

### **❌ No Tech Stack Constraints**

Results become inconsistent.

### **❌ No Reusability Rules**

You get duplicate components.

### **❌ No File Limits**

Claude generates giant components.

---

# **14\. Best Overall Migration Strategy**

## **Recommended Execution Order**

| Phase | Activity |
| ----- | ----- |
| 1 | Analyze HTML |
| 2 | Define architecture |
| 3 | Create React shell |
| 4 | Build layout system |
| 5 | Build reusable components |
| 6 | Migrate pages one by one |
| 7 | Add API integration |
| 8 | Add state management |
| 9 | Add validation/testing |
| 10 | Optimize/performance review |

---

# **15\. Combine Claude \+ Other AI Tools**

Recommended combination:

| Task | Tool |
| ----- | ----- |
| UI decomposition | [Claude by Anthropic](https://claude.ai/?utm_source=chatgpt.com) |
| React generation | [OpenAI Codex CLI](https://github.com/openai/codex?utm_source=chatgpt.com) |
| Figma extraction | [Figma Dev Mode](https://www.figma.com/dev-mode/?utm_source=chatgpt.com) |
| Code review | [GitHub Copilot](https://github.com/features/copilot?utm_source=chatgpt.com) |
| Refactoring | [Cursor IDE](https://cursor.com/?utm_source=chatgpt.com) |
| Testing | [Playwright](https://playwright.dev/?utm_source=chatgpt.com) |

---

# **16\. Production-Grade Enhancements**

After migration, ask Claude to additionally generate:

* Storybook stories  
* Unit tests  
* Playwright tests  
* Accessibility audit  
* Dark mode support  
* Design token system  
* Responsive breakpoints  
* Skeleton loaders  
* Error handling  
* Retry logic  
* API interceptors  
* Auth guards  
* RBAC structure

---

# **17\. Ideal Final Outcome**

You should end with:

✅ Clean React architecture  
✅ Reusable component system  
✅ Modern state management  
✅ Responsive UI  
✅ Maintainable codebase  
✅ Production-ready frontend  
✅ Reduced duplication  
✅ Better performance than legacy HTML  
✅ Easier future enhancements

