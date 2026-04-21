export default {
  data() {
    return {
      message: 'Merhaba Dünya!'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message.split('').reverse().join('')
    },
    notify() {
      alert('Yönlendirme engellendi.')
    }
  }
}
