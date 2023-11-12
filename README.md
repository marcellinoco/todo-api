# ✅ To-do List API

Open source backend API implementation for a to-do list application with Express and MySQL.

## Features:

This backend API has some built-in features such as:
- Authentication and authorization
- Collaborative list for multiple users

## Entity Relationship Diagram (ERD):

```mermaid
erDiagram
    USER ||--o{ USER_TODO : "has"
    USER_TODO ||--o{ TODO_LIST : "can access"
    TODO_LIST ||--o{ TODO_ITEM : "contains"

    USER {
        int id PK "Unique identifier"
        string username "User's username"
        string password "User's password hash"
        string email "User's email"
    }

    TODO_LIST {
        int id PK "Unique identifier"
        string title "List title"
        string description "List description"
        int owner_id FK "References USER.id"
    }

    TODO_ITEM {
        int id PK "Unique identifier"
        string content "Todo content"
        bool is_completed "Completion status"
        datetime due_date "Due date"
        int list_id FK "References TODO_LIST.id"
    }

    USER_TODO {
        int user_id FK "References USER.id"
        int list_id FK "References TODO_LIST.id"
        string access_type "Access type (e.g., 'edit', 'view')"
    }
```

