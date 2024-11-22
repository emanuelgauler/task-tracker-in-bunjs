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
```

To deploy help:

```bash
bun src/cli/index.js
```
To add a new task
```
bun src/cli/index.js add "description of the task"
```
To list all tasks
```
bun src/cli/index.js list
```
To change the description
```
bun src/cli/index.js update "new description" id
```
To mark as _in-progress_ a task
```
bun src/cli/index.js mark-in-progress id
```
To mark as _done_ a task
```
bun src/cli/index.js mark-done id
```
To delete a task
```
bun src/cli/index.js delete id
```
To list all tasks is in-progress
```
bun src/cli/index.js list in-progress
```
To list all tasks is done
```
bun src/cli/index.js list done
```