CREATE TABLE to_do (
  "id" serial PRIMARY KEY,
  "task" TEXT NOT NULL,
  "task_due_date" DATE,
  "task_completed" BOOLEAN DEFAULT FALSE
);

INSERT INTO to_do (task, task_due_date, task_completed)
VALUES 
('Create To Do Table', '08/06/2024', 'N')