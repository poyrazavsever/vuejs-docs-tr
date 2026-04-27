---
outline: deep
---

# Performans {#performance}

## Genel Bakış {#overview}

Vue, çoğu yaygın kullanım senaryosunda manuel optimizasyona gerek kalmadan yüksek performans sunacak şekilde tasarlanmıştır. Ancak her zaman ek ince ayar gerektiren zorlu senaryolar vardır. Bu bölümde, bir Vue uygulamasında performans söz konusu olduğunda nelere dikkat etmeniz gerektiğini ele alacağız.

Öncelikle, web performansının iki temel boyutunu ele alalım:

- **Sayfa Yükleme Performansı**: Uygulamanın ilk ziyarette ne kadar hızlı içerik gösterdiği ve etkileşime hazır hâle geldiği. Bu genellikle [Largest Contentful Paint (LCP)](https://web.dev/lcp/) ve [Interaction to Next Paint](https://web.dev/articles/inp) gibi Web Vitals metrikleri kullanılarak ölçülür.

- **Güncelleme Performansı**: Uygulamanın kullanıcı girdisine ne kadar hızlı yanıt verdiği. Örneğin, kullanıcı bir arama kutusuna yazdığında bir listenin ne kadar hızlı güncellendiği veya bir Tek Sayfalık Uygulamada (SPA) kullanıcı bir gezinme bağlantısına tıkladığında sayfanın ne kadar hızlı geçiş yaptığı.

İkisini de en üst düzeye çıkarmak ideal olsa da, farklı ön yüz mimarileri bu boyutlarda istenen performansa ulaşmanın ne kadar kolay olduğunu etkiler. Ayrıca, geliştirdiğiniz uygulamanın türü performans açısından neye öncelik vermeniz gerektiğini büyük ölçüde belirler. Bu nedenle, en iyi performansı sağlamanın ilk adımı, geliştirdiğiniz uygulama türü için doğru mimariyi seçmektir:

- Vue'yu farklı şekillerde nasıl kullanabileceğinizi görmek için [Vue'yu Kullanma Yolları](/guide/extras/ways-of-using-vue) sayfasına bakın.

- Jason Miller, web uygulamalarının türlerini ve her birinin ideal uygulanışı / sunumunu [Application Holotypes](https://jasonformat.com/application-holotypes/) yazısında ele alır.

## Profilleme Seçenekleri {#profiling-options}

Performansı iyileştirmek için öncelikle onu nasıl ölçeceğimizi bilmemiz gerekir. Bu konuda yardımcı olabilecek birçok iyi araç vardır:

Üretim dağıtımlarının yükleme performansını profillemek için:

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

Yerel geliştirme sırasında performansı profillemek için:

- [Chrome DevTools Performance Panel](https://developer.chrome.com/docs/devtools/evaluate-performance/)
  - [`app.config.performance`](/api/application#app-config-performance), Chrome DevTools'un performans zaman çizelgesinde Vue'ya özgü performans işaretleyicilerini etkinleştirir.
- [Vue DevTools Eklentisi](/guide/scaling-up/tooling#browser-devtools) de bir performans profilleme özelliği sunar.

## Sayfa Yükleme Optimizasyonları {#page-load-optimizations}

Sayfa yükleme performansını optimize etmenin framework'ten bağımsız birçok yönü vardır — kapsamlı bir genel bakış için [web.dev rehberine](https://web.dev/fast/) göz atabilirsiniz. Burada öncelikle Vue'ya özgü tekniklere odaklanacağız.

### Doğru Mimariyi Seçmek {#choosing-the-right-architecture}

Kullanım senaryonuz sayfa yükleme performansına duyarlıysa, uygulamayı tamamen istemci tarafında çalışan bir SPA olarak dağıtmaktan kaçının. Sunucunuzun, kullanıcıların görmek istediği içeriği içeren HTML'i doğrudan göndermesi gerekir. Tamamen istemci tarafında gerçekleştirilen render işlemi, içeriğe ulaşma süresini (time-to-content) olumsuz etkiler. Bu durum, [Sunucu Tarafında Render (SSR)](/guide/extras/ways-of-using-vue#fullstack-ssr) veya [Statik Site Üretimi (SSG)](/guide/extras/ways-of-using-vue#jamstack-ssg) ile iyileştirilebilir. Vue ile SSR kullanımını öğrenmek için [SSR rehberine](/guide/scaling-up/ssr) bakın. Uygulamanızın yoğun etkileşim gereksinimleri yoksa, geleneksel bir backend sunucusu ile HTML'i render edip, ardından istemci tarafında Vue ile zenginleştirme yaklaşımını da tercih edebilirsiniz.

Ana uygulamanız bir SPA olmak zorundaysa ama pazarlama sayfaları da içeriyorsa (açılış, hakkımızda, blog), bunları ayrı dağıtın! Pazarlama sayfalarınız ideal olarak SSG kullanılarak minimum JS içeren statik HTML olarak dağıtılmalıdır.

### Paket Boyutu ve Tree-shaking {#bundle-size-and-tree-shaking}

Sayfa yükleme performansını iyileştirmenin en etkili yollarından biri daha küçük JavaScript paketleri yayınlamaktır. Vue kullanırken paket boyutunu azaltmanın birkaç yolu:

- Mümkünse bir derleme adımı (build step) kullanın.

  - Vue'nun API'lerinin çoğu, modern bir derleme aracıyla paketlendiğinde ["tree-shakable"dır](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking). Örneğin, yerleşik `<Transition>` bileşenini kullanmıyorsanız nihai üretim paketine dahil edilmez. Tree-shaking, kaynak kodunuzdaki kullanılmayan diğer modülleri de kaldırabilir.

  - Bir derleme adımı kullanıldığında şablonlar önceden derlenir, böylece Vue derleyicisini tarayıcıya göndermeye gerek kalmaz. Bu, min+gzipped olarak **14kb** JavaScript tasarrufu sağlar ve çalışma zamanı derleme maliyetini ortadan kaldırır.

- Yeni bağımlılıklar eklerken boyuta dikkat edin! Gerçek uygulamalarda şişkin paketler çoğunlukla farkında olmadan ağır bağımlılıklar eklemekten kaynaklanır.

  - Bir derleme adımı kullanıyorsanız ES modül formatları sunan ve tree-shaking ile uyumlu bağımlılıkları tercih edin. Örneğin `lodash` yerine `lodash-es` kullanın.

  - Bir bağımlılığın boyutunu kontrol edin ve sağladığı işlevselliğin buna değip değmediğini değerlendirin. Bağımlılık tree-shaking ile uyumluysa gerçek boyut artışı, ondan içe aktardığınız API'lere bağlı olacaktır. Hızlı kontroller için [bundlejs.com](https://bundlejs.com/) gibi araçlar kullanılabilir ama en doğru ölçümü her zaman kendi derleme kurulumunuzla yaparsınız.

- Vue'yu öncelikle aşamalı geliştirme (progressive enhancement) için kullanıyor ve bir derleme adımından kaçınmayı tercih ediyorsanız, bunun yerine [petite-vue](https://github.com/vuejs/petite-vue)'yu (yalnızca **6kb**) kullanmayı düşünebilirsiniz.

### Kod Bölme {#code-splitting}

Kod bölme, bir derleme aracının uygulama paketini birden fazla küçük parçaya (chunk) bölmesidir; bu parçalar daha sonra talep üzerine ya da paralel olarak yüklenebilir. Doğru kod bölmesiyle sayfa yüklemesinde gereken özellikler hemen indirilebilir; ek parçalar ise yalnızca gerektiğinde tembel yükleme (lazy loading) ile yüklenerek performansı artırır.

Rollup (Vite'ın temel aldığı) veya webpack gibi paketleyiciler, ESM dinamik içe aktarım söz dizimini algılayarak otomatik olarak bölünmüş parçalar oluşturabilir:

```js
// lazy.js ve bağımlılıkları ayrı bir parçaya (chunk) ayrılır
// ve yalnızca `loadLazy()` çağrıldığında yüklenir.
function loadLazy() {
  return import('./lazy.js')
}
```

Tembel yükleme, ilk sayfa yüklemesinden hemen sonra ihtiyaç duyulmayan özellikler için en uygun yöntemdir. Vue uygulamalarında, bu yöntem Vue'nun [Asenkron Bileşen](/guide/components/async) özelliğiyle birlikte kullanılarak bileşen ağaçları için bölünmüş parçalar oluşturulabilir:

```js
import { defineAsyncComponent } from 'vue'

// Foo.vue ve bağımlılıkları için ayrı bir parça oluşturulur.
// asenkron bileşen sayfada render edildiğinde
// yalnızca o anda talep üzerine indirilir.
const Foo = defineAsyncComponent(() => import('./Foo.vue'))
```

Vue Router kullanan uygulamalarda, rota bileşenleri için tembel yüklemenin kullanılması şiddetle önerilir. Vue Router'ın `defineAsyncComponent`'ten ayrı, tembel yüklemeye yönelik açık desteği vardır. Ayrıntılar için [Tembel Yüklenen Rotalar](https://router.vuejs.org/guide/advanced/lazy-loading.html) sayfasına bakın.

## Güncelleme Optimizasyonları {#update-optimizations}

### Props Kararlılığı {#props-stability}

Vue'da bir alt bileşen, aldığı props'lardan en az biri değiştiğinde güncellenir. Aşağıdaki örneği inceleyelim:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active-id="activeId" />
```

`<ListItem>` bileşeninin içinde, o anda aktif olan öğenin kendisi olup olmadığını belirlemek için `id` ve `activeId` props'larını kullanır. Bu çalışır ama sorun şudur: `activeId` her değiştiğinde listedeki **her** `<ListItem>` güncellenmek zorunda kalır!

İdeal olarak yalnızca aktif durumu değişen öğeler güncellenmelidir. Bunu, aktif durum hesaplamasını üst bileşene taşıyıp `<ListItem>`'ın doğrudan bir `active` prop'u kabul etmesini sağlayarak başarabiliriz:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active="item.id === activeId" />
```

Artık çoğu bileşen için `active` prop'u, `activeId` değiştiğinde aynı kalır; bu yüzden güncellenmelerine gerek kalmaz. Genel olarak amaç, alt bileşenlere geçirilen props'ları olabildiğince kararlı tutmaktır.

### `v-once` {#v-once}

`v-once`, çalışma zamanı verisine dayanan ama hiçbir zaman güncellenmesi gerekmeyen içeriği render etmek için kullanılabilen yerleşik bir yönergedir. Üzerinde kullanıldığı tüm alt ağaç, gelecek tüm güncellemelerde atlanır. Ayrıntılar için [API referansına](/api/built-in-directives#v-once) bakın.

### `v-memo` {#v-memo}

`v-memo`, büyük alt ağaçların veya `v-for` listelerinin güncellenmesini koşullu olarak atlamak için kullanılabilen yerleşik bir yönergedir. Ayrıntılar için [API referansına](/api/built-in-directives#v-memo) bakın.

### Computed Kararlılığı {#computed-stability}

Vue 3.4 ve sonrasında, bir computed property yalnızca hesaplanan değeri bir öncekinden farklı olduğunda etki tetikler. Örneğin aşağıdaki `isEven` computed'ı yalnızca döndürülen değer `true`'dan `false`'a (veya tersine) değiştiğinde etki tetikler:

```js
const count = ref(0)
const isEven = computed(() => count.value % 2 === 0)

watchEffect(() => console.log(isEven.value)) // true

// computed değeri `true` kaldığı için yeni log tetiklemez
count.value = 2
count.value = 4
```

Bu, gereksiz etki tetiklemelerini azaltır ama ne yazık ki computed her hesaplamada yeni bir nesne oluşturuyorsa çalışmaz:

```js
const computedObj = computed(() => {
  return {
    isEven: count.value % 2 === 0
  }
})
```

Her seferinde yeni bir nesne oluşturulduğu için, yeni değer teknik olarak her zaman eski değerden farklıdır. `isEven` özelliği aynı kalsa bile, Vue eski ve yeni değerin derin karşılaştırmasını yapmadan bunu bilemez. Böyle bir karşılaştırma maliyetli olabilir ve büyük ihtimalle buna değmez.

Bunun yerine, yeni değeri eski değerle elle karşılaştırarak ve hiçbir şeyin değişmediğinden eminsek koşullu olarak eski değeri döndürerek bunu optimize edebiliriz:

```js
const computedObj = computed((oldValue) => {
  const newValue = {
    isEven: count.value % 2 === 0
  }
  if (oldValue && oldValue.isEven === newValue.isEven) {
    return oldValue
  }
  return newValue
})
```

[Playground'da deneyin](https://play.vuejs.org/#eNqVVMtu2zAQ/JUFgSZK4UpuczMkow/40AJ9IC3aQ9mDIlG2EokUyKVt1PC/d0lKtoEminMQQC1nZ4c7S+7Yu66L11awGUtNoesOwQi03ZzLuu2URtiBFtUECtV2FkU5gU2OxWpRVaJA2EOlVQuXxHDJJZeFkgYJayVC5hKj6dUxLnzSjZXmV40rZfFrh3Vb/82xVrLH//5DCQNNKPkweNiNVFP+zBsrIJvDjksgGrRahjVAbRZrIWdBVLz2yBfwBrIsg6mD7LncPyryfIVnywupUmz68HOEEqqCI+XFBQzrOKR79MDdx66GCn1jhpQDZx8f0oZ+nBgdRVcH/aMuBt1xZ80qGvGvh/X6nlXwnGpPl6qsLLxTtitzFFTNl0oSN/79AKOCHHQuS5pw4XorbXsr9ImHZN7nHFdx1SilI78MeOJ7Ca+nbvgd+GgomQOv6CNjSQqXaRJuHd03+kHRdg3JoT+A3a7XsfcmpbcWkQS/LZq6uM84C8o5m4fFuOg0CemeOXXX2w2E6ylsgj2gTgeYio/f1l5UEqj+Z3yC7lGuNDlpApswNNTrql7Gd0ZJeqW8TZw5t+tGaMdDXnA2G4acs7xp1OaTj6G2YjLEi5Uo7h+I35mti3H2TQsj9Jp6etjDXC8Fhu3F9y9iS+vDZqtK2xB6ZPNGGNVYpzHA3ltZkuwTnFf70b+1tVz+MIstCmmGQzmh/p56PGf00H4YOfpR7nV8PTxubP8P2GAP9Q==)

Karşılaştırıp eski değeri döndürmeden önce her zaman tam hesaplamayı yapmanız gerektiğini unutmayın; böylece her çalıştırmada aynı bağımlılıklar toplanabilir.

## Genel Optimizasyonlar {#general-optimizations}

> Aşağıdaki ipuçları hem sayfa yükleme hem de güncelleme performansını etkiler.

### Büyük Listeleri Sanallaştırma {#virtualize-large-lists}

Tüm ön yüz uygulamalarında en yaygın performans sorunlarından biri büyük listelerin render edilmesidir. Bir framework ne kadar performanslı olursa olsun, binlerce öğe içeren bir listeyi render etmek, tarayıcının işlemesi gereken DOM düğümlerinin yüksek sayısı nedeniyle **yavaş olacaktır**.

Ancak tüm bu düğümleri en başta render etmek zorunda değiliz. Çoğu durumda kullanıcının ekran boyutu büyük listemizin yalnızca küçük bir alt kümesini gösterebilir. **Liste sanallaştırması (list virtualization)** ile performansı önemli ölçüde artırabiliriz; bu teknik, büyük bir listede yalnızca o anda görünüm alanında veya ona yakın olan öğeleri render etmektir.

Liste sanallaştırmasını uygulamak kolay değildir; neyse ki doğrudan kullanabileceğiniz mevcut topluluk kütüphaneleri vardır:

- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
- [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)
- [vueuc/VVirtualList](https://github.com/07akioni/vueuc)

### Büyük Değişmez Yapılar için Tepkisellik Ek Yükünü Azaltma {#reduce-reactivity-overhead-for-large-immutable-structures}

Vue'nun tepkisellik sistemi varsayılan olarak derindir. Bu durum durum yönetimini sezgisel kılarken, veri boyutu büyük olduğunda belirli bir ek yük oluşturur; çünkü her özellik erişimi, bağımlılık izleme yapan proxy tuzaklarını tetikler. Bu genellikle, tek bir render'ın 100.000'den fazla özelliğe erişmesi gereken derin iç içe nesneler içeren büyük dizilerle uğraşırken fark edilir; dolayısıyla yalnızca çok özel kullanım senaryolarını etkilemelidir.

Vue, [`shallowRef()`](/api/reactivity-advanced#shallowref) ve [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) kullanarak derin tepkisellikten çıkış yapmak için bir kaçış kapısı sunar. Sığ API'ler yalnızca kök düzeyde tepkisel olan bir durum oluşturur ve tüm iç içe nesneleri olduğu gibi sunar. Bu, iç içe özellik erişimini hızlı tutar; karşılığında ise artık tüm iç içe nesneleri değişmez (immutable) olarak ele almamız gerekir ve güncellemeler yalnızca kök durumun değiştirilmesiyle tetiklenebilir:

```js
const shallowArray = shallowRef([
  /* derin nesnelerden oluşan büyük liste */
])

// bu güncelleme tetiklemez...
shallowArray.value.push(newObject)
// bu tetikler:
shallowArray.value = [...shallowArray.value, newObject]

// bu güncelleme tetiklemez...
shallowArray.value[0].foo = 1
// bu tetikler:
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

### Gereksiz Bileşen Soyutlamalarından Kaçının {#avoid-unnecessary-component-abstractions}

Bazen daha iyi soyutlama veya kod organizasyonu için [render etmeyen bileşenler (renderless components)](/guide/components/slots#renderless-components) veya yüksek dereceli bileşenler (yani diğer bileşenleri ek props ile render eden bileşenler) oluşturabiliriz. Bunda yanlış bir şey yok; ancak bileşen örneklerinin düz DOM düğümlerinden çok daha maliyetli olduğunu ve soyutlama desenleri nedeniyle bunlardan çok fazlasını oluşturmanın performans maliyetine yol açacağını unutmayın.

Yalnızca birkaç örneği azaltmanın belirgin bir etkisi olmayacağını unutmayın; bu nedenle bileşen uygulamada yalnızca birkaç kez render ediliyorsa endişelenmeyin. Bu optimizasyonu değerlendirmek için en uygun senaryo yine büyük listelerdir. Her öğe bileşeninin birçok alt bileşen içerdiği 100 öğelik bir liste düşünün. Burada gereksiz bir bileşen soyutlamasını kaldırmak yüzlerce bileşen örneğinin azalmasına yol açabilir.

