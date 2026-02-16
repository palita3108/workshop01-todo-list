<script setup>
import {useRoute, useRouter} from 'vue-router'
import {ref, reactive, watch, onMounted} from 'vue'
import { useTodoStore } from '../stores/todolist'

const route = useRoute()
const router = useRouter()
const todoStore = useTodoStore()

const mode = ref('')

const newTodo = reactive({
    nameTodo: '',
    statusTodo: ''
})

const idParam = ref(-1)


onMounted( async () => {
    idParam.value = Number(route.params.id)
    // await todoStore.todoListEdit(newTodo,idParam.value)
    await todoStore.todoListAll()
    console.log(todoStore.todoList);
    }
)

// watch(() => )



</script>

<template>

    <div class="space">
        <input type="text" v-model="newTodo.nameTodo">
        <button @click="addNew()">Add list</button>
    </div>

    <ul >
        <li v-for="todo in todoStore.todoList" :key="todo.id">
            <span>item {{ todo.id }} :</span><br>
            <span v-if="!(idParam == Number(todo.id))">{{ todo.name }}</span> 
            <input v-if="idParam == Number(todo.id)" type="text" :value="todo.name">
            <br>
            <div class="space">
              <button v-if="mode == 'viewAll'" @click="viewItem(todo.id) ">
                      view
              </button>
              <button v-if="mode == 'viewAll'" @click="editItem(todo.id) ">
                      edit
              </button>
              <button v-if="mode == 'viewAll'" @click="viewItem(todo.id) ">
                      delete
              </button>
              <button v-if="idParam == Number(todo.id)" @click="viewItem(todo.id) ">
                      save
              </button>
            </div>
        </li>
    </ul>
   
    

</template>
