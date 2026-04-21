import { ref } from 'vue'

export default {
  setup() {
    const message = ref('Merhaba Dünya!')

    function reverseMessage() {
      // Bir ref'in sahip olduğu değere onun .value
      // özelliği üzerinden erişebilir ya da bunu değiştirebiliriz.
      message.value = message.value.split('').reverse().join('')
    }

    function notify() {
      alert('Yönlendirme engellendi.')
    }

    return {
      message,
      reverseMessage,
      notify
    }
  }
}
