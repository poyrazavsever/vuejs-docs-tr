import { ref } from 'vue'
import TreeItem from './TreeItem.vue'

export default {
  components: {
    TreeItem
  },
  setup() {
    const treeData = ref({
      name: 'Benim Ağacım',
      children: [
        { name: 'merhaba' },
        { name: 'dünya' },
        {
          name: 'alt klasör',
          children: [
            {
              name: 'alt klasör',
              children: [{ name: 'merhaba' }, { name: 'dünya' }]
            },
            { name: 'merhaba' },
            { name: 'dünya' },
            {
              name: 'alt klasör',
              children: [{ name: 'merhaba' }, { name: 'dünya' }]
            }
          ]
        }
      ]
    })

    return {
      treeData
    }
  }
}
