# ✅ To-do List API 

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/12147807-2387c863-8f9d-4f44-86b7-dd7c72a35d24?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D12147807-2387c863-8f9d-4f44-86b7-dd7c72a35d24%26entityType%3Dcollection%26workspaceId%3Df035b87a-c729-40bf-a4b2-0b01c9c7fc62)

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

## Deployment:

To start the server, run:

```bash
docker compose up --build -d
```

Optionally, to seed the database, run:

```bash
docker compose run app npx sequelize db:seed:all
```
