# task-tracker

task-tracker is a command-line tool that allows you to manage your tasks with simple commands. 
You can add a new task, change the description, mark them as _in-progress_, _done_, list all tasks from a filter and delete.

task tracker made with [Bun](https://bun.sh). This is a solution for [task tracker roadmap challenges](https://roadmap.sh/projects/task-tracker)


## How to use

```
git clone https://github.com/emanuelgauler/task-tracker-in-bunjs
```
This project was created using `bun init` in bun v1.1.33. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

To install dependencies:

```bash
bun install
bun run setup
```

To deploy help:

```bash
./task-tracker
```
To add a new task
```
./task-tracker add "description of the task"
```
To list all tasks
```
./task-tracker list
```
To change the description
```
./task-tracker update "new description" id
```
To mark as _in-progress_ a task
```
./task-tracker mark-in-progress id
```
To mark as _done_ a task
```
./task-tracker mark-done id
```
To delete a task
```
./task-tracker delete id
```
To list all tasks is in-progress
```
./task-tracker list in-progress
```
To list all tasks is done
```
./task-tracker list done
```