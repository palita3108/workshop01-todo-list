import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = 'https://69846f83885008c00db12f77.mockapi.io'

export const useTodoStore = defineStore('todostore', () => {
    const todoList = ref([])
    const todoListSelected = ref('')
    const mode = ref('viewAll')
    const idParam = ref(-1)
    const statusGang = ['Pending', 'Done', 'Doing', 'Canceled']



    const todoListAll = async () => {
        try{
        const responsedata = await axios.get(`${BASE_URL}/datatodo`)
        todoList.value = responsedata.data       
        
        } catch(err) {
            console.log(err);
        }
    }
    const todoListItem = async (id) => {
        try{
        const responsedata = await axios.get(`${BASE_URL}/datatodo/${id}`)
        todoList.value = [responsedata.data] 
        
        } catch(err) {
            console.log(err);
        }
    }
    const todoListAdd = async (newTodo) => {
        try{
        const packNewtodo = {
            name: newTodo.nameTodo,
            status: newTodo.statusTodo
        }
        const responsedata = await axios.post(`${BASE_URL}/datatodo`, packNewtodo)
        todoList.value.push(responsedata.data)
        
        } catch(err) {
            console.log(err);
            
        }
    }
    const todoListEdit = async (newTodo, id) => {
        try{
            const packNewtodo = {
            name: newTodo.nameTodo,
            status: newTodo.statusTodo
            }
            const updateScreen = {
            name: newTodo.nameTodo,
            status: newTodo.statusTodo,
            id: Number(id)
            }

            const responsedata = await axios.put(`${BASE_URL}/datatodo/${id}`, packNewtodo)
            
        } catch(err) {
            console.log(err);
            
        }
    }

    const todoListEditStatus = async (newStatus, id) => {
        try{
            const responsedata = await axios.put(`${BASE_URL}/datatodo/${id}`, { status : newStatus })
            console.log('this',responsedata.data);
            
            
        } catch(err) {
            console.log(err);
        }
    }

    const todoListDel = async (id) => {
        try{
        await axios.delete(`${BASE_URL}/datatodo/${id}`)
        const indexRest = Number(id) - 1
        todoList.value.splice(indexRest, 1)
        
        } catch(err) {
            console.log(err);
            
        }
    }

return {todoList, statusGang, mode, idParam, todoListEditStatus, todoListAll, todoListItem , todoListAdd, todoListEdit, todoListDel}

})
