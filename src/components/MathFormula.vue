<template>
  <div ref="formulaRef" class="math-formula"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import katex from 'katex'

interface Props {
  formula: string
  displayMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  displayMode: false
})

const formulaRef = ref<HTMLElement>()

const renderFormula = () => {
  if (!formulaRef.value || !props.formula) return

  try {
    katex.render(props.formula, formulaRef.value, {
      displayMode: props.displayMode,
      throwOnError: false
    })
  } catch (error) {
    console.error('LaTeX渲染错误:', error)
    if (formulaRef.value) {
      formulaRef.value.textContent = props.formula
    }
  }
}

watch(() => props.formula, renderFormula)

onMounted(renderFormula)
</script>

<style scoped>
.math-formula {
  display: inline-block;
  max-width: 100%;
  overflow-x: auto;
}
</style>

