<script setup>
import {RouterLink, useRoute, useRouter} from 'vue-router'
import { storeToRefs } from 'pinia'
import {ref, reactive, watch} from 'vue'
import { useTodoStore } from '../stores/todolist'
import loading from '../components/loading.vue'

const route = useRoute()
const router = useRouter()
const todoStore = useTodoStore()

const { idParam, mode } = storeToRefs(todoStore)


const goHome = () => {
  isLoading.value = true
  mode.value = 'viewAll'
  idParam.value = -1
  isLoading.value = false
}

const isEdit = ref(true)
const isLoading = ref(false)

const newTodo = reactive({
    nameTodo: '',
    statusTodo: 'Pending'
})
const editTodo = reactive({
    nameTodo: '',
    statusTodo: ''
})

const changeDoneStatus = async (event, todoId) => {
  try {
    if (event.target.checked) {
      isLoading.value = true
      await todoStore.todoListEditStatus('Done',todoId)
      await todoStore.todoListAll()
      isLoading.value = false
    } else {
      isLoading.value = true
      await todoStore.todoListEditStatus('Doing',todoId)
      await todoStore.todoListAll()
      isLoading.value = false
    }
  } catch (error) {
    console.log('error', error)
  }
}


watch(
  () => route.params.id,
  async (id) => {
    try {
      if (id) {
        isLoading.value = true  

        idParam.value = Number(route.params.id)
        await todoStore.todoListItem(idParam.value)
        console.log('yes');
        isLoading.value = false  
        
    } else {
        isLoading.value = true  
        await todoStore.todoListAll()
        isLoading.value = false  
    }
    console.log(id);
    console.log(mode.value);
    
    } catch (err) {
      console.log(err)
    }
  },
  { immediate: true }
)

watch (() => editTodo.nameTodo, (newTodo, oldTodo) => {
  if(oldTodo) {
    isEdit.value = false
  }
})

watch (() => editTodo.statusTodo, (newTodo, oldTodo) => {
  if(oldTodo) {
    isEdit.value = false
  }
})

const viewItem = (todoId) => {
  isLoading.value = true  
  mode.value = 'viewItem'
  router.push({
    name: 'todo-item',
    params: { id: todoId }
  })
  isLoading.value = false
}


const addNew = async () => {
  try {

  isLoading.value = true
  await todoStore.todoListAdd(newTodo)
  console.log(newTodo)
  newTodo.nameTodo = ''
  isLoading.value = false
  } catch (err) {
    console.log(err);
  }
}

const editItem = (todo) => {
  isLoading.value = true
  idParam.value = Number(todo.id)
  mode.value = 'viewEdit'
  editTodo.nameTodo = todo.name
  editTodo.statusTodo = todo.status
  isLoading.value = false
  
}
const saveItem = async (todo) => {
try{
  isLoading.value = true
  idParam.value = Number(todo.id)
  const editPack = {
    name : editTodo.nameTodo,
    statut : editTodo.statusTodo
  }
   await todoStore.todoListEdit(editTodo, idParam.value)
  idParam.value = ''
  mode.value = 'viewAll'
  await todoStore.todoListAll()
  isLoading.value = false

} catch (err) {
  console.log(err);
}

}

const deleteItem = async (todo) => {
  isLoading.value = true
  idParam.value = Number(todo.id)
  mode.value = `Deleting .... Item : ${todo.id}`
  await todoStore.todoListDel(idParam.value)
  idParam.value = -1
  await todoStore.todoListAll()
    mode.value = 'viewAll'
  isLoading.value = false
}

</script>

<template>
  
  <div class="flex flex-row m-8 gap-2">
      <input class=" basis-95/100 input" type="text" v-model="newTodo.nameTodo">
      <button class="basis-5/100 btn btn-secondary" @click="addNew()">ADD</button>
  </div>

    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
    <loading></loading>
    </div>

  <div  class="flex mx-10" 
  v-for="todo in todoStore.todoList" 
  :key="todo.id">

      <div  v-if="(!(idParam == Number(todo.id)))" class="flex">
      <input type="checkbox" :checked="todo.status === 'Done'" class="checkbox" @change="changeDoneStatus($event, todo.id)">
        <div 
        :class="todo.status === 'Done' ? 'line-through text-left mx-2 w-5xl' : 'text-left mx-2 w-5xl'">
        {{ todo.name }}
        </div> 
      </div>

      <div  v-if="((idParam == Number(todo.id))) && (mode == 'viewItem')" class="flex">
      <input type="checkbox" :checked="todo.status === 'Done'" class="checkbox" @change="changeDoneStatus($event, todo.id)">
        <div 
        :class="todo.status === 'Done' ? 'line-through text-left mx-2 w-5xl' : 'text-left mx-2 w-5xl'">
        {{ todo.name }}
        </div> 
      </div>

      <div v-if="(idParam == Number(todo.id)) && (mode == 'viewEdit')" class="flex items-center">
        <div class="flex-col justify-between h-15">
          <select v-model="editTodo.statusTodo" class="text-left mx-2 w-12">
            <option
              v-for="status in todoStore.statusGang" :key="status"
              :value="status">
              {{ status }}
            </option>
            </select>

            <input 
            :class="todo.status === 'Done' ? 'input text-left mx-2 w-5xl h-full' : 'input text-left mx-2 w-5xl h-full'"
             type="text" v-model="editTodo.nameTodo">
        </div>
      </div>
          
        <div class="flex" v-if="!(mode == 'viewItem')">
          <button v-if="!(idParam == Number(todo.id))" class="btn btn-square btn-ghost" @click="viewItem(todo.id) ">
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z"/>
            </svg>
          </button>

          <button v-if="!(idParam == Number(todo.id))" class="btn btn-square btn-ghost" @click="editItem(todo) ">
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z"/></svg>
          </button>
          <div class="absolute flex-row" :disabled="!isEdit">
            <button class="m-2 btn btn-square btn-ghost w-6"  
            v-if="(idParam == Number(todo.id)) && (mode == 'viewEdit')" @click="saveItem(todo) ">
              <svg class="w-full h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/>
              </svg>
            </button>
            <button class="m-2 btn btn-square btn-ghost w-6" 
            v-if="(idParam == Number(todo.id)) && (mode == 'viewEdit')" @click="goHome() ">
              <svg class="w-full h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/>
              </svg>
            </button>
          </div>
          <button v-if="!(idParam == Number(todo.id))" class="btn btn-square btn-ghost" @click="deleteItem(todo) ">
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>
          </button>
        </div>
    </div>
    

</template>

