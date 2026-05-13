<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-6 border-b pb-4">
              <h1 class="text-3xl font-extrabold text-gray-900">Результати опитування</h1>
              <router-link to="/profile" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">&larr; Назад до профілю</router-link>
          </div>
          
          <div v-if="loading" class="text-center text-gray-500 py-8">Завантаження результатів...</div>
          <div v-else-if="error" class="text-center text-red-500 py-8">{{ error }}</div>
          <div v-else>
              <h2 class="text-xl font-bold text-gray-800 mb-2">{{ survey.title }}</h2>
              <p class="text-gray-600 mb-8">{{ survey.description }}</p>
              
              <div v-if="survey.results && survey.results.length > 0" class="space-y-8">
                  <div v-for="(question, index) in survey.results" :key="question.id" class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 class="font-medium text-gray-900 mb-4">{{ index + 1 }}. {{ question.text }}</h3>
                      
                      <div v-if="question.answers.length === 0" class="text-sm text-gray-500 italic">
                          Ще немає відповідей.
                      </div>
                      <div v-else>
                          <ul v-if="question.type === 'radio'" class="space-y-2">
                              <li v-for="(count, opt) in getAggregatedAnswers(question.answers)" :key="opt" class="flex justify-between items-center text-sm bg-white p-2 rounded border border-gray-100">
                                  <span class="text-gray-700">{{ opt }}</span>
                                  <span class="font-bold text-indigo-600">{{ count }} відп.</span>
                              </li>
                          </ul>
                          <ul v-else class="space-y-2 max-h-60 overflow-y-auto">
                              <li v-for="(answer, aIdx) in question.answers" :key="aIdx" class="text-sm text-gray-700 bg-white p-3 rounded border border-gray-100">
                                  {{ answer }}
                              </li>
                          </ul>
                          <p class="text-xs text-gray-500 mt-3 text-right">Всього відповідей: {{ question.answers.length }}</p>
                      </div>
                  </div>
              </div>
              <div v-else class="text-center text-gray-500 py-8">
                  У цьому опитуванні ще немає запитань або відповідей.
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSurveyResults } from '../services/api'

export default {
    setup() {
        const route = useRoute()
        const survey = ref(null)
        const loading = ref(true)
        const error = ref('')

        onMounted(async () => {
            const surveyId = route.params.id
            try {
                survey.value = await getSurveyResults(surveyId)
            } catch (e) {
                error.value = 'Не вдалося завантажити результати.'
            } finally {
                loading.value = false
            }
        })

        const getAggregatedAnswers = (answers) => {
            const counts = {}
            answers.forEach(a => {
                counts[a] = (counts[a] || 0) + 1
            })
            return counts
        }

        return { survey, loading, error, getAggregatedAnswers }
    }
}
</script>
