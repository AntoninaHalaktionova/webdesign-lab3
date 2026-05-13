<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div v-if="loading" class="text-center text-gray-500">Завантаження опитування...</div>
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
      <div v-else-if="success" class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Дякуємо!</h2>
          <p class="text-gray-600 mb-6">Ваші відповіді успішно збережено.</p>
          <router-link to="/" class="text-indigo-600 hover:text-indigo-800 font-medium text-sm">&larr; Повернутися на головну</router-link>
      </div>
      <div v-else class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 class="text-3xl font-extrabold text-gray-900 mb-2">{{ survey.title }}</h1>
          <p class="text-gray-600 mb-8 pb-4 border-b border-gray-200">{{ survey.description }}</p>
          
          <form @submit.prevent="handleSubmit" class="space-y-8">
              <div v-for="(question, index) in survey.questions" :key="question.id" class="mb-6">
                  <label class="block text-base font-medium text-gray-800 mb-2">
                      {{ index + 1 }}. {{ question.text }}
                  </label>
                  
                  <input v-if="question.type === 'text'" type="text" v-model="answers[question.id]" required class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                  
                  <textarea v-if="question.type === 'textarea'" v-model="answers[question.id]" rows="4" required class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"></textarea>

                  <div v-if="question.type === 'radio'" class="space-y-2 mt-3">
                      <div v-for="(opt, optIndex) in question.options" :key="optIndex" class="flex items-center">
                          <input :id="'q' + question.id + 'opt' + optIndex" type="radio" :value="opt" v-model="answers[question.id]" required class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                          <label :for="'q' + question.id + 'opt' + optIndex" class="ml-3 block text-sm font-medium text-gray-700">
                              {{ opt }}
                          </label>
                      </div>
                  </div>
              </div>

              <div class="pt-5 border-t border-gray-200">
                  <div class="flex justify-end">
                      <button type="submit" :disabled="submitting" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                          {{ submitting ? 'Відправка...' : 'Відправити відповіді' }}
                      </button>
                  </div>
              </div>
          </form>
      </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSurveyById, submitAnswers } from '../services/api'

export default {
    setup() {
        const route = useRoute()
        const survey = ref(null)
        const answers = ref({})
        const loading = ref(true)
        const submitting = ref(false)
        const error = ref('')
        const success = ref(false)

        onMounted(async () => {
            const surveyId = route.params.id
            try {
                survey.value = await getSurveyById(surveyId)
                if (survey.value && survey.value.questions) {
                    survey.value.questions.forEach(q => {
                        answers.value[q.id] = ''
                    })
                }
            } catch (e) {
                error.value = 'Не вдалося завантажити опитування.'
            } finally {
                loading.value = false
            }
        })

        const handleSubmit = async () => {
            submitting.value = true
            error.value = ''
            
            const formattedAnswers = Object.entries(answers.value).map(([questionId, text]) => ({
                question_id: parseInt(questionId),
                text
            }))

            try {
                await submitAnswers(formattedAnswers)
                success.value = true
            } catch (e) {
                error.value = e.message || 'Помилка при відправці.'
            } finally {
                submitting.value = false
            }
        }

        return { survey, answers, loading, submitting, error, success, handleSubmit }
    }
}
</script>
