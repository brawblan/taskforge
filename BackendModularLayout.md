```plaintext
apps/api/src/
├── main.ts
├── app.module.ts
├── modules/
│ ├── users/
│ │ ├── users.module.ts
│ │ ├── users.controller.ts
│ │ ├── users.service.ts
│ │ └── users.entity.ts
│ ├── projects/
│ │ ├── projects.module.ts
│ │ ├── projects.controller.ts
│ │ ├── projects.service.ts
│ │ └── projects.entity.ts
│ ├── tasks/
│ │ ├── tasks.module.ts
│ │ ├── tasks.controller.ts
│ │ ├── tasks.service.ts
│ │ └── tasks.entity.ts
│ └── activity/
│ ├── activity.module.ts
│ ├── activity.controller.ts
│ └── activity.service.ts
├── common/
│ ├── dto/
│ ├── pipes/
│ ├── guards/
│ └── interceptors/
└── prisma/
  ├── prisma.service.ts
  └── prisma.module.ts
```
