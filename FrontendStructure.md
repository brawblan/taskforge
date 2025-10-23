```plaintext
apps/web/src/
├── routes/
│ ├── index.tsx → Dashboard / Home
│ ├── projects/
│ │ ├── index.tsx → List Projects
│ │ ├── [projectId].tsx → Project detail (list tasks)
│ │ └── new.tsx → Create project form
│ ├── tasks/
│ │ ├── [taskId].tsx → Task detail page
│ │ └── edit.tsx → Edit task form
├── components/
│ ├── layout/
│ ├── forms/
│ ├── tables/
│ └── modals/
├── hooks/
├── utils/
└── api/
  ├── client.ts (axios or fetch wrapper)
  └── useTasks.ts (TanStack Query hooks)
```
