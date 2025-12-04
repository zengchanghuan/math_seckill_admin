<template>
  <div style="padding: 20px;">
    <h2>PDF校验页面（简化版）</h2>

    <!-- 强制显示状态 -->
    <div style="background: #fff3cd; padding: 15px; margin: 10px 0; border-radius: 4px;">
      <strong>数据状态：</strong><br/>
      questions数组长度: {{ questions.length }}<br/>
      数据内容: {{ questions.length > 0 ? '有数据' : '无数据' }}<br/>
      <button @click="loadData" style="margin-top: 10px;">手动加载数据</button>
      <button @click="createData" style="margin-left: 10px;">创建测试数据</button>
    </div>

    <!-- 题目列表 -->
    <div v-if="questions.length > 0" style="background: white; padding: 20px; margin-top: 20px;">
      <h3>题目列表（共{{ questions.length }}道）：</h3>

      <div v-for="(q, idx) in questions" :key="idx" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0;">
        <p><strong>题号：{{ q.questionNumber }}</strong></p>
        <p>内容：{{ q.rawText }}</p>
        <p>答案：{{ q.answer }}</p>
        <p>类型：{{ q.type }}</p>
      </div>
    </div>

    <div v-else style="background: #f0f0f0; padding: 40px; text-align: center; margin-top: 20px;">
      <p>没有数据</p>
      <button @click="createData">创建测试数据</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const questions = ref<any[]>([])

const loadData = () => {
  const saved = sessionStorage.getItem('pdfQuestions')
  console.log('sessionStorage数据:', saved)

  if (saved) {
    questions.value = JSON.parse(saved)
    console.log('加载成功:', questions.value.length)
  } else {
    console.log('无数据')
  }
}

const createData = () => {
  const testData = [
    {
      questionNumber: 1,
      rawText: '测试题目1：sin(30°) = ?',
      answer: 'A',
      type: 'choice'
    },
    {
      questionNumber: 2,
      rawText: '测试题目2：cos(45°) = ?',
      answer: 'B',
      type: 'choice'
    }
  ]

  sessionStorage.setItem('pdfQuestions', JSON.stringify(testData))
  questions.value = testData

  console.log('测试数据已创建:', testData.length)
  alert('测试数据已创建！')
}

// 自动加载
loadData()
</script>

