<template>
  <div ref="formulaRef" class="math-formula"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

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
    const container = formulaRef.value
    container.innerHTML = ''

    // 处理混合文本和公式
    let text = props.formula
    const parts: Array<{ type: 'text' | 'math', content: string, display?: boolean }> = []

    // 先处理 display mode ($$...$$)，避免和 inline mode 冲突
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, p1) => {
      const index = parts.length
      parts.push({ type: 'math', content: p1.trim(), display: true })
      return `{{MATH_${index}}}`
    })

    // 处理 display mode (\[...\])
    text = text.replace(/\\\[([\s\S]*?)\\\]/g, (match, p1) => {
      const index = parts.length
      parts.push({ type: 'math', content: p1.trim(), display: true })
      return `{{MATH_${index}}}`
    })

    // 处理 inline mode ($...$)
    text = text.replace(/\$([\s\S]*?)\$/g, (match, p1) => {
      const index = parts.length
      parts.push({ type: 'math', content: p1.trim(), display: false })
      return `{{MATH_${index}}}`
    })

    // 处理 inline mode (\(...\))
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, (match, p1) => {
      const index = parts.length
      parts.push({ type: 'math', content: p1.trim(), display: false })
      return `{{MATH_${index}}}`
    })

    // 分割文本并渲染
    const segments = text.split(/(\{\{MATH_\d+\}\})/)

    segments.forEach(segment => {
      const mathMatch = segment.match(/\{\{MATH_(\d+)\}\}/)
      if (mathMatch) {
        const index = parseInt(mathMatch[1])
        const mathPart = parts[index]
        if (mathPart) {
          const span = document.createElement('span')
          span.className = mathPart.display ? 'math-display' : 'math-inline'
          try {
            katex.render(mathPart.content, span, {
              displayMode: mathPart.display || false,
              throwOnError: false,
              strict: false,
              trust: true
            })
          } catch (e) {
            console.warn('KaTeX渲染失败:', mathPart.content, e)
            span.textContent = mathPart.display ? `$$${mathPart.content}$$` : `$${mathPart.content}$`
          }
          container.appendChild(span)
        }
      } else if (segment) {
        // 普通文本，保留换行
        const lines = segment.split('\n')
        lines.forEach((line, i) => {
          if (i > 0) container.appendChild(document.createElement('br'))
          if (line) container.appendChild(document.createTextNode(line))
        })
      }
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

<style>
.math-formula {
  line-height: 1.8;
  max-width: 100%;
}

.math-formula .math-inline {
  display: inline;
  vertical-align: middle;
}

.math-formula .math-display {
  display: block;
  text-align: center;
  margin: 1em 0;
  overflow-x: auto;
}

/* KaTeX 样式调整 */
.math-formula .katex {
  font-size: 1.1em;
}

.math-formula .katex-display {
  margin: 1em 0;
  text-align: center;
}
</style>

