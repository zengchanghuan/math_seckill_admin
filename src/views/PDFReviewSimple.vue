<template>
  <div class="pdf-review-simple">
    <!-- PDF文件信息 -->
    <el-alert type="info" :closable="false" style="margin-bottom: 15px;">
      <strong>📄 当前PDF：</strong>{{ pdfFileName }}
    </el-alert>

    <!-- 顶部状态栏 -->
    <el-card class="status-card">
      <div class="status-info">
        <div>
          <el-tag type="success" size="large">题目数量：{{ questions.length }}</el-tag>
          <el-tag type="info" size="large" style="margin-left: 10px;">
            当前：第 {{ currentIndex + 1 }} 题
          </el-tag>
        </div>
        <el-space>
          <el-button @click="loadData" size="small">
            <el-icon><Refresh /></el-icon>
            重新加载
          </el-button>
          <el-button type="success" @click="createData" size="small">
            <el-icon><MagicStick /></el-icon>
            创建测试数据
          </el-button>
        </el-space>
      </div>
    </el-card>

    <!-- 题目内容 -->
    <el-card v-if="currentQuestion" class="question-card" style="margin-top: 15px;">
      <template #header>
        <div class="card-header">
          <span>📝 题目 {{ currentQuestion.questionNumber }}</span>
          <el-radio-group v-model="currentQuestion.difficulty" size="small">
            <el-radio-button label="L1">简单</el-radio-button>
            <el-radio-button label="L2">中等</el-radio-button>
            <el-radio-button label="L3">困难</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <el-form label-width="80px">
        <el-form-item label="题目内容">
          <el-input v-model="currentQuestion.rawText" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item label="选项" v-if="currentQuestion.options">
          <div v-for="(opt, idx) in currentQuestion.options" :key="idx" style="margin-bottom: 10px;">
            <el-input v-model="opt.content">
              <template #prepend>{{ opt.letter }}</template>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item label="标准答案">
          <el-input v-model="currentQuestion.answer" style="width: 200px;" />
        </el-form-item>

        <el-form-item label="题目解析">
          <el-input v-model="currentQuestion.solution" type="textarea" :rows="2" />
        </el-form-item>

        <el-form-item label="知识点">
          <el-tag
            v-for="(tag, idx) in currentQuestion.knowledgePoints"
            :key="idx"
            closable
            @close="currentQuestion.knowledgePoints.splice(idx, 1)"
            style="margin-right: 5px;"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-model="newTag"
            placeholder="输入知识点"
            style="width: 150px; margin-left: 10px;"
            @keyup.enter="addTag"
          >
            <template #append>
              <el-button @click="addTag">添加</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <el-card v-if="questions.length > 0" style="margin-top: 15px;">
      <div class="actions">
        <el-button
          :disabled="currentIndex === 0"
          @click="previousQuestion"
        >
          <el-icon><ArrowLeft /></el-icon>
          上一题
        </el-button>

        <el-space>
          <el-button type="warning" @click="skipQuestion">跳过</el-button>
          <el-button type="success" @click="saveQuestion">
            <el-icon><Check /></el-icon>
            保存到题库
          </el-button>
        </el-space>

        <el-button
          type="primary"
          :disabled="currentIndex >= questions.length - 1"
          @click="nextQuestion"
        >
          下一题
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>

      <el-progress
        :percentage="Math.round(((currentIndex + 1) / questions.length) * 100)"
        style="margin-top: 15px;"
      />
    </el-card>

    <!-- 空状态 -->
    <el-card v-else style="margin-top: 15px;">
      <el-empty description="没有待校验的题目">
        <el-button type="success" @click="createData">
          <el-icon><MagicStick /></el-icon>
          创建测试数据
        </el-button>
      </el-empty>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Refresh,
  MagicStick,
  ArrowLeft,
  ArrowRight,
  Check
} from '@element-plus/icons-vue'
import { pdfAPI } from '../api'

const questions = ref<any[]>([])
const currentIndex = ref(0)
const newTag = ref('')
const pdfFileName = ref('')

const currentQuestion = computed(() => questions.value[currentIndex.value])

const loadData = () => {
  const saved = sessionStorage.getItem('pdfQuestions')
  const fileName = sessionStorage.getItem('pdfFileName') || '未命名.pdf'
  pdfFileName.value = fileName

  console.log('sessionStorage数据:', saved)
  console.log('PDF文件名:', fileName)

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
      rawText: '计算：$\\sin(30^\\circ) = ?$',
      options: [
        { letter: 'A', content: '$\\frac{1}{2}$' },
        { letter: 'B', content: '$\\frac{\\sqrt{2}}{2}$' },
        { letter: 'C', content: '$\\frac{\\sqrt{3}}{2}$' },
        { letter: 'D', content: '1' }
      ],
      answer: 'A',
      type: 'choice',
      difficulty: 'L1',
      knowledgePoints: ['三角函数', '特殊值'],
      solution: '$\\sin(30^\\circ) = \\frac{1}{2}$',
      topic: '三角函数'
    },
    {
      questionNumber: 2,
      rawText: '计算：$\\cos(45^\\circ) = ?$',
      options: [
        { letter: 'A', content: '$\\frac{1}{2}$' },
        { letter: 'B', content: '$\\frac{\\sqrt{2}}{2}$' },
        { letter: 'C', content: '$\\frac{\\sqrt{3}}{2}$' },
        { letter: 'D', content: '1' }
      ],
      answer: 'B',
      type: 'choice',
      difficulty: 'L1',
      knowledgePoints: ['三角函数', '特殊值'],
      solution: '$\\cos(45^\\circ) = \\frac{\\sqrt{2}}{2}$',
      topic: '三角函数'
    }
  ]

  sessionStorage.setItem('pdfQuestions', JSON.stringify(testData))
  sessionStorage.setItem('pdfFileName', '测试数据.pdf')
  questions.value = testData
  currentIndex.value = 0
  pdfFileName.value = '测试数据.pdf'

  ElMessage.success('测试数据已创建！')
}

const previousQuestion = () => {
  if (currentIndex.value > 0) currentIndex.value--
}

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) currentIndex.value++
}

const skipQuestion = () => {
  ElMessage.info('已跳过')
  nextQuestion()
}

const saveQuestion = async () => {
  const q = currentQuestion.value
  if (!q) return

  try {
    await pdfAPI.verifyQuestion({
      questionId: `pdf_${Date.now()}_${q.questionNumber}`,
      topic: q.topic || '三角函数',
      difficulty: q.difficulty || 'L1',
      type: q.type || 'choice',
      question: q.rawText,
      answer: q.answer,
      options: q.options?.map((opt: any) => opt.content),
      solution: q.solution || '',
      tags: q.knowledgePoints || [],
      knowledgePoints: q.knowledgePoints || [],
      abilityTags: ['计算']
    })

    ElMessage.success(`题目${q.questionNumber}已保存！`)
    nextQuestion()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const addTag = () => {
  if (newTag.value && currentQuestion.value) {
    if (!currentQuestion.value.knowledgePoints) {
      currentQuestion.value.knowledgePoints = []
    }
    currentQuestion.value.knowledgePoints.push(newTag.value)
    newTag.value = ''
  }
}

// 自动加载
loadData()
</script>

<style scoped>
.pdf-review-simple {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.status-card :deep(.el-card__body) {
  padding: 15px;
}

.status-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .pdf-review-simple {
    padding: 10px;
  }

  .status-info,
  .card-header,
  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions > * {
    width: 100%;
  }
}
</style>

