<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 class="text-3xl font-extrabold text-gray-900 mb-6">Створити нове опитування</h1>
          
          <form @submit.prevent="handleCreateSurvey" class="space-y-8">
              <div v-if="error" class="bg-red-50 text-red-500 p-3 rounded text-sm">{{ error }}</div>
              
              <div class="space-y-4">
                  <div>
                      <label for="title" class="block text-sm font-medium text-gray-700">Назва опитування</label>
                      <input type="text" id="title" v-model="survey.title" required class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                  </div>
                  <div>
                      <label for="description" class="block text-sm font-medium text-gray-700">Опис</label>
                      <textarea id="description" v-model="survey.description" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"></textarea>
                  </div>
              </div>

              <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Запитання</h3>
                  
                  <div v-for="(question, index) in survey.questions" :key="index" class="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                      <div class="flex justify-between mb-2">
                          <span class="font-medium text-gray-700">Запитання {{ index + 1 }}</span>
                          <button type="button" @click="removeQuestion(index)" class="text-red-600 hover:text-red-800 text-sm font-medium">Видалити</button>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label class="block text-xs text-gray-500 mb-1">Текст запитання</label>
                              <input type="text" v-model="question.text" required class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                          </div>
                          <div>
                              <label class="block text-xs text-gray-500 mb-1">Тип відповіді</label>
                              <select v-model="question.type" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border bg-white">
                                  <option value="textarea">Текст</option>
                                  <option value="radio">Один з варіантів</option>
                              </select>
                          </div>
                      </div>
                      
                      <div v-if="question.type === 'radio'" class="mt-4 pl-4 border-l-2 border-indigo-200">
                          <label class="block text-xs font-medium text-gray-700 mb-2">Варіанти відповідей:</label>
                          <div v-for="(opt, optIndex) in question.options" :key="optIndex" class="flex items-center mb-2">
                              <input type="text" v-model="question.options[optIndex]" placeholder="Варіант відповіді" required class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-1.5 border mr-2">
                              <button type="button" @click="removeOption(index, optIndex)" class="text-red-500 hover:text-red-700 font-bold px-2">&times;</button>
                          </div>
                          <button type="button" @click="addOption(index)" class="text-xs text-indigo-600 hover:text-indigo-800 mt-1">+ Додати варіант</button>
                      </div>
                  </div>
                  
                  <button type="button" @click="addQuestion" class="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      + Додати запитання
                  </button>
              </div>

              <div class="pt-5 border-t border-gray-200">
                  <div class="flex justify-end">
                      <button type="submit" :disabled="loading" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                          {{ loading ? 'Створення...' : 'Створити опитування' }}
                      </button>
                  </div>
              </div>
          </form>
      </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createSurvey } from '../services/api'

export default {
    setup() {
        const survey = ref({
            title: '',
            description: '',
            questions: [{ text: '', type: 'text', options: [] }]
        })
        const loading = ref(false)
        const error = ref('')
        const router = useRouter()

        const addQuestion = () => {
            survey.value.questions.push({ text: '', type: 'text', options: [] })
        }

        const removeQuestion = (index) => {
            survey.value.questions.splice(index, 1)
        }

        const addOption = (qIndex) => {
            if (!survey.value.questions[qIndex].options) {
                survey.value.questions[qIndex].options = [];
            }
            survey.value.questions[qIndex].options.push('');
        }

        const removeOption = (qIndex, optIndex) => {
            survey.value.questions[qIndex].options.splice(optIndex, 1);
        }

        const handleCreateSurvey = async () => {
            if (survey.value.questions.length === 0) {
                error.value = 'Додайте хоча б одне запитання.'
                return
            }

            loading.value = true
            error.value = ''
            try {
                await createSurvey({
                    title: survey.value.title,
                    description: survey.value.description,
                    questions: survey.value.questions
                })
                router.push('/')
            } catch (e) {
                error.value = e.message
            } finally {
                loading.value = false
            }
        }

        return { survey, loading, error, addQuestion, removeQuestion, addOption, removeOption, handleCreateSurvey }
    }
}
</script>
