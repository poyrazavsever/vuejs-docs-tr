# Vue Uygulaması Oluşturmak{#creating-a-vue-application}

## Uygulama Örneği {#the-application-instance}

Her Vue uygulaması, [`createApp`](/api/application#createapp) fonksiyonu ile yeni bir **uygulama örneği** oluşturularak başlar:

```js
import { createApp } from 'vue'

const app = createApp({
  /* kök bileşen seçenekleri */
})
```

## Kök Bileşen {#the-root-component}

`createApp` fonksiyonuna verdiğimiz nesne, aslında bir bileşendir. Her uygulama, alt bileşenler içerebilen bir "kök bileşen" gerektirir.

Eğer tek Dosyalı Bileşenler kullanıyorsanız, kök bileşeni genellikle başka bir dosyadan içeri aktarırız:

```js
import { createApp } from 'vue'
// Tek dosyalı bir bileşenden kök App bileşenini içe aktarın.
import App from './App.vue'

const app = createApp(App)
```

Bu rehberdeki birçok örnek yalnızca tek bir bileşene ihtiyaç duysa da, gerçek uygulamaların çoğu iç içe geçmiş, yeniden kullanılabilir bileşenlerden oluşan bir ağaç şeklinde düzenlenir. Örneğin, bir Todo uygulamasının bileşen ağacı şöyle görünebilir:

```
App (kök bileşen)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

Rehberin sonraki bölümlerinde, birden fazla bileşeni birlikte nasıl tanımlayıp bir araya getireceğimizi ele alacağız. Fakat ondan önce, tek bir bileşenin içinde neler olduğuna odaklanmamız gerekiyor.

## Uygulamayı Bağlamak {#mounting-the-app}

Bir uygulama örneği, `.mount()` yöntemi çağrılana kadar hiçbir şey render etmez. Bu yöntem, gerçek bir DOM elemanı ya da bir seçici dizesi olabilen bir "kapsayıcı" argümanı bekler:

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

Uygulamanın kök bileşeninin içeriği, kapsayıcı elemanın içinde render edilir. Kapsayıcı elemanın kendisi uygulamanın bir parçası sayılmaz.

`.mount()` yöntemi, uygulama yapılandırmalarının ve varlık kayıtlarının tamamı bittikten sonra çağrılmalıdır. Ayrıca döndürdüğü değerin, varlık kayıt yöntemlerinden farklı olarak uygulama örneği değil, kök bileşen örneği olduğunu unutmamanızda fayda var.

### In-DOM Kök Bileşen Şablonu {#in-dom-root-component-template}

Kök bileşen için şablon genellikle bileşenin kendisinin bir parçasıdır. Ancak şablonu doğrudan bağlama kapsayıcısının içine yazarak ayrı şekilde vermek de mümkündür:

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```

Kök bileşende zaten bir `template` seçeneği yoksa Vue, kapsayıcının `innerHTML` içeriğini otomatik olarak şablon olarak kullanır.

In-DOM şablonları genellikle [Vue'yu bir build adımı olmadan kullanan](/guide/quick-start.html#using-vue-from-cdn) uygulamalarda tercih edilir. Sunucu taraflı framework'lerle birlikte de kullanılabilir. Bu durumda kök şablon, sunucu tarafından dinamik olarak üretilebilir.

## Uygulama Yapılandırmaları {#app-configurations}

Uygulama örneği, uygulama düzeyindeki bazı seçenekleri yapılandırmamıza olanak tanıyan bir `.config` nesnesi sunar. Örneğin, tüm alt bileşenlerdeki hataları yakalayan uygulama düzeyinde bir hata işleyici tanımlayabilirsiniz:

```js
app.config.errorHandler = (err) => {
  /* hatayı işle */
}
```

Uygulama örneği, kapsamındaki varlıkları kaydetmek için bazı yöntemler de sağlıyor. Örneğin bir bileşeni kaydetmek için:

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

Bu sayede `TodoDeleteButton`, uygulamanın her yerinde kullanılabilir hale gelir. Rehberin sonraki bölümlerinde bileşenler ve diğer varlık türleri için kayıt işlemini ele alacağız. Uygulama örneği API'lerinin tam listesini [API referansında](/api/application) da inceleyebilirsiniz.

Bağlama işleminden önce tüm yapılandırmaları tamamladığınızdan emin olun!

## Birden Fazla Uygulama Örneği {#multiple-application-instances}

Aynı sayfada tek bir uygulama örneğiyle sınırlı değilsiniz. `createApp` API'si, aynı sayfada birden fazla Vue uygulamasının birlikte var olmasına izin verir. Her birinin yapılandırma ve global varlıklar için kendi kapsamı bulunur:

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

Vue'yu sunucu tarafından render edilmiş HTML'yi zenginleştirmek için kullanıyor ve yalnızca büyük bir sayfanın belirli bölümlerini Vue ile yönetmek istiyorsanız, tüm sayfaya tek bir Vue uygulama örneği bağlamaktan kaçının. Bunun yerine birden fazla küçük uygulama örneği oluşturun ve her birini sorumlu olduğu elemana bağlayın.
