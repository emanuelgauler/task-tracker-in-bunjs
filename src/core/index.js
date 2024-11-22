import { file, write } from "bun"
import { join } from 'path'
import { log } from 'console'

const TASKS_PATH = join(process.cwd(), "tasks.json") // Replace with your actual path to your tasks file

class TaskGateway {
    static async init() {
        // Connect to your database here
        // Return an instance of your TaskGateway class
        const tasks_file = file(TASKS_PATH, { type: 'application/json' })
        const exists = await tasks_file.exists()
        if( exists ) {
            const content = await tasks_file.json()
            return new TaskGateway(content)
        } else {
            const content = []
            await write(tasks_file, JSON.stringify(content))
            return new TaskGateway(content)
        }
    }

    constructor(tasks) {
        this.tasks = tasks || []
    }

    async find_from(filter) {
        // Implementation here
        // This function should connect to your database, fetch tasks that match the given filter, and return them
        return this.tasks.filter(task => task.status.includes(filter))
    }
}
const gateway = await TaskGateway.init()

export async function get_all_tasks(...params) {
    // Implementation here
    // This function should connect to your database, fetch all tasks, and return them
    const [ filter ] = params
    return await gateway.find_from( filter )
}
