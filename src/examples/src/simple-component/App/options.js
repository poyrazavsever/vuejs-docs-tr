import TodoItem from './TodoItem.vue'

export default {
  components: {
    TodoItem
  },
  data() {
    return {
      groceryList: [
        { id: 0, text: 'Sebzeler' },
        { id: 1, text: 'Peynir' },
        { id: 2, text: 'İnsanların yemesi gereken diğer her şey' }
      ]
    }
  }
}
