import { ref } from 'vue'
import TodoItem from './TodoItem.vue'

export default {
  components: {
    TodoItem
  },
  setup() {
    const groceryList = ref([
      { id: 0, text: 'Sebzeler' },
      { id: 1, text: 'Peynir' },
      { id: 2, text: 'İnsanların yemesi gereken diğer her şey' }
    ])

    return {
      groceryList
    }
  }
}
