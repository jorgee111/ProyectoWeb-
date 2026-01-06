```mermaid
erDiagram
    USERS {
        int id PK
        string username
        string password
        string role
    }

    LINES {
        int id PK
        string name
        string zone
        string status
        int occupation
        int temperature
        string motor_status
    }

    VEHICLES {
        int id PK
        int line_id FK
        string code
        string driver_name
        string status
        float latitude
        float longitude
        int current_occupancy
        int max_occupancy
    }

    INCIDENTS {
        int id PK
        int user_id FK
        int line_id FK
        string type
        string description
        string priority
        string status
        date date
    }

    USERS ||--o{ INCIDENTS : reports
    LINES ||--o{ INCIDENTS : has
    LINES ||--o{ VEHICLES : contains
