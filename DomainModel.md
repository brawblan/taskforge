```plaintext
User
├─ id
├─ name
├─ email
└─ createdAt

Project
├─ id
├─ name
├─ description
├─ ownerId (FK → User)
└─ createdAt

Task
├─ id
├─ projectId (FK → Project)
├─ title
├─ description
├─ status (enum: 'todo' | 'in_progress' | 'done')
├─ priority (enum: 'low' | 'medium' | 'high')
├─ dueDate
├─ createdAt
└─ updatedAt

ActivityLog
├─ id
├─ taskId (FK → Task)
├─ action (string)
├─ performedBy (FK → User)
├─ createdAt
```
