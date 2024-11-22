import { argv, color } from 'bun'
import { log, error } from 'console'
import { add_task_with, get_all_tasks, mark_task_as } from '../core'

function success(...args) {
    log('\x1b[37;42m%s\x1b[0m',...args)
}


const commands = [{
    name: 'add'
    , description: 'Add a task with a description, and return its ID'
    , handler: async (...params) => {
        try {
            const [ description ] = params.flat()
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
            if (0 < tasks.length)
                tasks.forEach(task => {
                    const line = `>> ${task.id}: ${task.description}` 
                    if( task.status == 'done' )
                        log('\x1b[37;105m%s\x1b[0m', line)
                    else if( task.status == 'in-progress' ) 
                        log('\x1b[37;42m%s\x1b[0m', line )
                    else 
                        log('\x1b[30;43m%s\x1b[0m', line)
                })
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
}, {
    name: 'mark-done'
    , description: 'Mark a task as done by its ID'
    , handler: async (...params) => {
        try {
            const [ task_id ] = params.flat()
            await mark_task_as('done', task_id)
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