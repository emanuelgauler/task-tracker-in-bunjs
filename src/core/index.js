import { file, write } from "bun"
import { join } from 'path'
import { error, log } from 'console'

const TASKS_PATH = join(process.cwd(), "tasks.json") // Replace with your actual path to your tasks file

class TaskGateway {
    static tasks_file = file(TASKS_PATH, { type: 'application/json' })
    static async init() {
        // Connect to your database here
        // Return an instance of your TaskGateway class
        const exists = await this.tasks_file.exists()
        if( exists ) {
            const content = await this.tasks_file.json()
            return new TaskGateway(content)
        } else {
            const content = []
            await write(this.tasks_file, JSON.stringify(content))
            return new TaskGateway(content)
        }
    }

    constructor(tasks) {
        this.tasks = tasks || []
    }

    find_by(id) {
        return this.tasks.find( e => e.id == id )
    }

    async find_from(filter) {
        // Implementation here
        // This function should connect to your database, fetch tasks that match the given filter, and return them
        return this.tasks.filter(task => task.status.includes(filter))
    }

    async insert( task ) {
        this.tasks.push( task )
        await write( TaskGateway.tasks_file, JSON.stringify(this.tasks))
    }

    async mark( status, id ) {
        const task = this.tasks.find( e => e.id == id )
        if( task ) {
            task.status = status
            task.updated_at = new Date()
            await write( TaskGateway.tasks_file, JSON.stringify(this.tasks))
        } else {
            throw new Error("task not found", { cause: "TaskNotFound" })
        }
    }
}
const gateway = await TaskGateway.init()

function id_generator() {
    return Math.floor(Math.random() * 10 ** 7)
        .toString(36)
        .padStart(5, "0")
        .toUpperCase()
}

export async function get_all_tasks(...params) {
    // Implementation here
    // This function should connect to your database, fetch all tasks, and return them
    const [ filter ] = params
    return await gateway.find_from( filter )
}

export async function add_task_with( description ) {
    // Implementation here
    // This function should connect to your database, add a new task with the given description, and return the new task's ID
    const today = new Date()
    const new_task = {
        id: id_generator()
        , description
        , status: "todo"
        , created_at: today
        , updated_at: today
    }
    gateway.insert( new_task )
    return new_task
}

export async function mark_task_as(status, id) {
    try {
        const gateway = await TaskGateway.init()
        await gateway.mark( status, id.toUpperCase() )
    } catch (err) {
        error("[TASKS SERVICE] >>", err)
    }
}