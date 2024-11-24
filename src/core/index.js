import { error, log } from 'console'
import { TaskGateway } from "../infra/TaskGateway"


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
   const gateway = await TaskGateway.init()
   return await gateway.find_from( filter )
}

export async function add_task_with( description ) {
   // Implementation here
   // This function should connect to your database, add a new task with the given description, and return the new task's ID
   if( !description ) {
      throw new Error("task description needed", { cause: "NoDescriptionTask" } )
   }
   const today = new Date()
   const new_task = {
      id: id_generator()
      , description
      , status: "todo"
      , created_at: today
      , updated_at: today
   }
   const gateway = await TaskGateway.init()
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

export async function update_task_with(description, id) {
   try {
      const gateway = await TaskGateway.init()
      await gateway.change_description_to( id, description )
   } catch (err) {
      error("[TASKS SERVICE] >>", err)
      throw err
   }
}

export async function delete_task_with_id( id ) {
   try {
      const gateway = await TaskGateway.init()
      await gateway.delete_task( id.toUpperCase() )
   } catch (err) {
      error("[TASKS SERVICE] >>", err)
      throw err
   }
}
