import TreeItem from './TreeItem.vue'

const treeData = {
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
}

export default {
  components: {
    TreeItem
  },
  data() {
    return {
      treeData
    }
  }
}
