import { argv, color } from 'bun'
import { log, error } from 'console'
import { add_task_with, delete_task_with_id, get_all_tasks, mark_task_as, update_task_with } from '../core'

function success(...args) {
   log('\x1b[37;42m%s\x1b[0m',...args)
}

const commands = [{
   name: 'add'
   , args: "<description>"
   , description: 'Add a task with a description, and return its ID'
   , handler: async (...params) => {
      try {
	 const [ description ] = params.flat()
	 const { id } = await add_task_with(description)
	 success(`>> adding task: ${description} with ID ${id}`)
      } catch (err) {
	 const { message } = err
	 error( ">>", message )
      }
   }
}, {
   name: 'list'
   , description: 'List all tasks from filter, default all'
   , args: '[done | in-progress | todo | all]'
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
   , args: '<ID>'
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
   , args: '<ID>'
   , handler: async (...params) => {
      try {
	 const [ task_id ] = params.flat()
	 await mark_task_as('done', task_id)
      } catch (err) {
	 error("TASKS CLI: ", err)
      }
   }
}, {
   name: 'update'
   , description: 'Update a task by its ID with a new description'
   , args: '<new description> <ID>'
   , handler: async (...params) => {
      try {
	 const [ description, task_id ] = params.flat()
	 await update_task_with(description, task_id.toUpperCase())
      } catch (err) {
	 error("TASKS CLI: ", err)
      }
   }
}, {
   name: 'delete'
   , args: '<ID>'
   , description: 'Delete a task by its ID'
   , handler: async (...params) => {
      try {
	 const [ task_id ] = params.flat()
	 await delete_task_with_id( task_id )
      } catch (err) {
	 error("TASKS CLI: ", err)
      }
   }
}, {
   name: 'help'
   , args: '[command]'
   , description: 'Show help message'
   , handler: (params) => {
      const [ command ] = params.flat()
      if( command ) {
	 const { description, args } = commands.find(({ name }) => command == name )
	 log("task-tracker: Usage:")
	 log(command, args,"\t\t", description )
      } else {
	 log("Available commands:")
	 commands.forEach(({ name, args, description }) => log(`  ${name} ${args}\t\t\t\t ${description}`))
      }
   }
}]

const command = argv[2] || "help"

try {
   commands
      .find(({ name }) => name === command)
      .handler(argv.splice(3))
} catch (err) {
   error(">> command not found")
   error(err)
}
