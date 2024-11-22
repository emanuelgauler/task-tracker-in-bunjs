import { file, write } from "bun";
import { join } from "path/posix";
import { error } from 'console'

const TASKS_PATH = join(process.cwd(), "tasks.json"); // Replace with your actual path to your tasks file

export class TaskGateway {
    static tasks_file = file(TASKS_PATH, { type: 'application/json' });
    static async init() {
        // Connect to your database here
        // Return an instance of your TaskGateway class
        const exists = await this.tasks_file.exists();
        if (exists) {
            const content = await this.tasks_file.json();
            return new TaskGateway(content);
        } else {
            const content = [];
            await write(this.tasks_file, JSON.stringify(content));
            return new TaskGateway(content);
        }
    }

    constructor(tasks) {
        this.tasks = tasks || [];
    }

    find_by(id) {
        return this.tasks.find(e => e.id == id);
    }

    async find_from(filter) {
        // Implementation here
        // This function should connect to your database, fetch tasks that match the given filter, and return them
        return this.tasks.filter(task => task.status.includes(filter));
    }

    async insert(task) {
        this.tasks.push(task);
        await write(TaskGateway.tasks_file, JSON.stringify(this.tasks));
    }

    async mark(status, id) {
        const task = this.tasks.find(e => e.id == id);
        if (task) {
            task.status = status;
            task.updated_at = new Date();
            await write(TaskGateway.tasks_file, JSON.stringify(this.tasks));
        } else {
            throw new Error("task not found", { cause: "TaskNotFound" });
        }
    }

    async change_description_to( id, description ) {
        const task = this.tasks.find(e => e.id == id)
        if (task) {
            task.description = description
            task.updated_at = new Date()
            await write(TaskGateway.tasks_file, JSON.stringify(this.tasks))
        } else {
            error("[GATEWAY]", task)
            throw new Error("task not found", { cause: "TaskNotFound" })
        }
    }
}
