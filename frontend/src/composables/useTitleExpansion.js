import { ref, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'

/**
 * Composable для управления раскрытием/сворачиванием обрезанного текста.
 * Автоматически определяет, какие элементы обрезаны (clamped) и позволяет их раскрывать.
 * 
 * @param {import('vue').Ref|import('vue').ComputedRef} itemsRef - реактивный список элементов для отслеживания изменений
 * @returns {Object}
 */
export function useTitleExpansion(itemsRef) {
  const expanded = ref(new Set())
  const clamped = ref({})
  const titleEls = new Map()

  /**
   * Генерирует уникальный ID для элемента
   */
  function idFor(item, idx) {
    return `${idx}-${String(item.title || item.description || item.work_name || '')}`
  }

  /**
   * Регистрирует ref элемента для отслеживания
   */
  function registerTitleRef(el, id) {
    if (el) titleEls.set(id, el)
    else titleEls.delete(id)
  }

  /**
   * Проверяет, раскрыт ли элемент
   */
  function isExpanded(id) {
    return expanded.value.has(id)
  }

  /**
   * Проверяет, обрезан ли текст элемента
   */
  function isClamped(id) {
    return !!(clamped.value && clamped.value[id])
  }

  /**
   * Переключает состояние раскрытия элемента
   */
  function toggleExpand(id) {
    const s = new Set(expanded.value)
    if (s.has(id)) s.delete(id)
    else s.add(id)
    expanded.value = s
  }

  /**
   * Проверяет все зарегистрированные элементы на обрезку текста
   */
  function checkClamped() {
    nextTick(() => {
      const result = {}
      try {
        for (const [id, el] of titleEls.entries()) {
          if (!el) continue
          const tolerance = 2
          const fullH = el.scrollHeight || el.offsetHeight || 0
          const visibleH = el.clientHeight || el.offsetHeight || 0
          result[id] = fullH > (visibleH + tolerance)
        }
      } catch (e) {
        // ignore
      }
      clamped.value = result
    })
  }

  /**
   * Сбрасывает все раскрытые элементы
   */
  function collapseAll() {
    expanded.value = new Set()
  }

  onMounted(() => {
    checkClamped()
    window.addEventListener('resize', checkClamped)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkClamped)
  })

  // Перепроверяем при изменении списка
  if (itemsRef) {
    watch(itemsRef, () => {
      checkClamped()
    })
  }

  return {
    idFor,
    registerTitleRef,
    isExpanded,
    isClamped,
    toggleExpand,
    checkClamped,
    collapseAll
  }
}
