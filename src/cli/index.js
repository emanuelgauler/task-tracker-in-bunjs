import { argv } from 'bun'
import { log, error } from 'console'
import { add_task_with, get_all_tasks, mark_task_as } from '../core'

function success(...args) {
    log('\x1b[32m%s\x1b[0m',...args)
}

const commands = [{
    name: 'add'
    , description: 'Add a task with a description, and return its ID'
    , handler: async (...params) => {
        try {
            const [ description ] = params
            const { id } = await add_task_with(description)
            success(`>> adding task: ${description} with ID ${id}`)
        } catch (err) {
            error( err )
        }
    }
}, {
    name: 'list'
    , description: 'List all tasks'
    , handler: async (...params) => {
        try {
            const tasks = await get_all_tasks(params)
            if( 0 < tasks.length )
                tasks.forEach(task => log(`>> ${task.id}: ${task.description}`))
            else
                log("No tasks found")
        } catch (err) {
            error(err)
        }
    }
}, {
    name: 'mark-in-progress'
    , description: 'Mark a task as in-progress by its ID'
    , handler: async (...params) => {
        try {
            const [ task_id ] = params.flat()
            await mark_task_as('in-progress', task_id)
        } catch (err) {
            error("TASKS CLI: ", err)
        }
    }
}]

const command = argv[2] || "list"

try {
    commands
        .find(({ name }) => name === command)
        .handler(argv.splice(3))
} catch (err) {
    error(">> command not found")
}