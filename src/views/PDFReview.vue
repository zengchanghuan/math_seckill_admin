<template>
  <div class="pdf-review-page">
    <!-- 调试信息（详细） -->
    <el-alert type="warning" :closable="false" style="margin-bottom: 10px;">
      <strong>调试信息：</strong><br/>
      questions数组: {{ questions.length }} 项<br/>
      totalQuestions计算值: {{ totalQuestions }}<br/>
      currentIndex: {{ currentIndex }}<br/>
      是否显示内容: {{ totalQuestions > 0 ? '是' : '否' }}<br/>
      <div v-if="questions.length > 0" style="margin-top: 5px;">
        第一题预览: {{ questions[0]?.questionNumber }}. {{ questions[0]?.rawText?.substring(0, 30) }}...
      </div>
    </el-alert>

    <!-- 进度指示 -->
    <el-card class="progress-card" v-if="totalQuestions > 0">
      <el-alert type="success" :closable="false">
        <template #title>
          ✅ 已加载 {{ totalQuestions }} 道待校验题目
        </template>
      </el-alert>
      <div class="review-progress" style="margin-top: 15px;">
        <span>校验进度：{{ currentIndex + 1 }} / {{ totalQuestions }}</span>
        <el-progress
          :percentage="reviewPercentage"
          :stroke-width="20"
          :text-inside="true"
        />
      </div>
    </el-card>

    <!-- 左右对比区域 -->
    <template v-if="totalQuestions > 0">
      <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 左侧：原始图片 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>📷 原始PDF图片</span>
              <div>
                <el-button :icon="ZoomIn" circle size="small" @click="zoomIn" />
                <el-button :icon="ZoomOut" circle size="small" @click="zoomOut" />
              </div>
            </div>
          </template>
          <div class="image-container">
            <img
              :src="currentImage"
              :style="{ transform: `scale(${zoom})` }"
              class="pdf-image"
            />
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：编辑表单 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>✏️ 题目编辑</span>
          </template>

          <el-form v-if="currentQuestion" :model="currentQuestion" label-width="100px">
            <el-form-item label="题号">
              <el-tag>第 {{ currentQuestion.questionNumber }} 题</el-tag>
            </el-form-item>

            <el-form-item label="题目内容">
              <el-input
                v-model="currentQuestion.rawText"
                type="textarea"
                :rows="4"
                placeholder="修正OCR识别的文本"
              />
            </el-form-item>

            <el-form-item label="公式" v-if="currentQuestion.hasFormula">
              <div class="latex-editor">
                <el-input
                  v-model="latexCode"
                  type="textarea"
                  :rows="2"
                  placeholder="输入LaTeX公式，如: \sin(30^\circ) = \frac{1}{2}"
                />
                <div class="latex-preview">
                  <strong>预览：</strong>
                  <MathFormula v-if="latexCode" :formula="latexCode" />
                </div>
                <div class="latex-buttons">
                  <el-button size="small" @click="insertSymbol('\\frac{}{}')">分数</el-button>
                  <el-button size="small" @click="insertSymbol('\\sqrt{}')">根号</el-button>
                  <el-button size="small" @click="insertSymbol('\\sin')">sin</el-button>
                  <el-button size="small" @click="insertSymbol('\\cos')">cos</el-button>
                  <el-button size="small" @click="insertSymbol('\\pi')">π</el-button>
                  <el-button size="small" @click="insertSymbol('^{}')">上标</el-button>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="选项" v-if="currentQuestion.options && currentQuestion.options.length > 0">
              <div v-for="(option, idx) in currentQuestion.options" :key="idx" class="option-editor">
                <span class="option-label">{{ option.letter }}.</span>
                <el-input v-model="option.content" />
              </div>
            </el-form-item>

            <el-form-item label="标准答案">
              <el-input v-model="currentQuestion.answer" placeholder="如：A 或 LaTeX公式" />
            </el-form-item>

            <el-form-item label="题目类型">
              <el-select v-model="currentQuestion.type">
                <el-option label="选择题" value="choice" />
                <el-option label="填空题" value="fill" />
                <el-option label="解答题" value="solution" />
              </el-select>
            </el-form-item>

            <el-form-item label="难度">
              <el-radio-group v-model="currentQuestion.difficulty">
                <el-radio label="L1">简单</el-radio>
                <el-radio label="L2">中等</el-radio>
                <el-radio label="L3">困难</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="知识点">
              <el-select
                v-model="currentQuestion.knowledgePoints"
                multiple
                placeholder="选择知识点标签"
                style="width: 100%;"
              >
                <el-option label="三角函数" value="三角函数" />
                <el-option label="三角恒等式" value="三角恒等式" />
                <el-option label="三角方程" value="三角方程" />
                <el-option label="诱导公式" value="诱导公式" />
                <el-option label="和差公式" value="和差公式" />
                <el-option label="倍角公式" value="倍角公式" />
                <el-option label="代数运算" value="代数运算" />
                <el-option label="方程求解" value="方程求解" />
                <el-option label="几何证明" value="几何证明" />
              </el-select>
            </el-form-item>

            <el-form-item label="题目解析">
              <el-input
                v-model="currentQuestion.solution"
                type="textarea"
                :rows="3"
                placeholder="详细解答过程"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      </el-row>

      <!-- 底部操作栏 -->
      <el-card style="margin-top: 20px;">
        <div class="action-bar">
          <el-button
            :disabled="currentIndex === 0"
            @click="previousQuestion"
          >
            <el-icon><ArrowLeft /></el-icon>
            上一题
          </el-button>

          <el-space>
            <el-button type="warning" @click="skipQuestion">
              跳过此题
            </el-button>
            <el-button type="success" @click="saveQuestion">
              <el-icon><Check /></el-icon>
              保存此题
            </el-button>
          </el-space>

          <el-button
            type="primary"
            :disabled="currentIndex >= totalQuestions - 1"
            @click="nextQuestion"
          >
            下一题
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </el-card>
    </template>

    <!-- 空状态 -->
    <template v-else>
      <el-card style="margin-top: 20px;">
        <el-empty description="没有待校验的题目">
          <el-space>
            <el-button type="success" @click="createTestDataHere">
              <el-icon><MagicStick /></el-icon>
              创建测试数据
            </el-button>
            <el-button type="primary" @click="router.push('/pdf-import')">
              返回PDF导入
            </el-button>
          </el-space>
        </el-empty>
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  UploadFilled,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  ArrowRight,
  Check,
  View,
  MagicStick
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import MathFormula from '../components/MathFormula.vue'
import { pdfAPI } from '../api'

const router = useRouter()

// 上传相关
const uploadRef = ref()
const processing = ref(false)
const currentStep = ref(0)
const progress = ref(0)
const progressText = ref('')
const result = ref<any>(null)

// 校验相关
const questions = ref<any[]>([])
const currentIndex = ref(0)
const zoom = ref(1)

// 强制响应式
const totalQuestions = computed(() => {
  const count = questions.value?.length || 0
  console.log('[计算] totalQuestions:', count)
  return count
})
const reviewPercentage = computed(() => {
  if (totalQuestions.value === 0) return 0
  return Math.round((currentIndex.value / totalQuestions.value) * 100)
})

const currentQuestion = computed(() => {
  return questions.value[currentIndex.value] || null
})

const currentImage = computed(() => {
  return currentQuestion.value?.imageUrl || '/placeholder.png'
})

const latexCode = ref('')

// 文件处理
const loadReviewData = () => {
  // 从localStorage加载PDF处理结果
  const data = localStorage.getItem('pdfReviewData')
  if (data) {
    try {
      const reviewData = JSON.parse(data)
      questions.value = reviewData.questions || []

      // 为每个题目初始化必要字段
      questions.value.forEach(q => {
        if (!q.type) q.type = 'choice'
        if (!q.difficulty) q.difficulty = 'L1'
        if (!q.knowledgePoints) q.knowledgePoints = []
        if (!q.answer) q.answer = ''
        if (!q.solution) q.solution = ''

        // 构建图片URL
        if (q.imagePath) {
          const imageName = q.imagePath.split('/').pop()
          q.imageUrl = `http://localhost:8000/api/pdf/image/${imageName}`
        }
      })

      ElMessage.success(`加载了${questions.value.length}道待校验题目`)
    } catch (error) {
      ElMessage.error('加载数据失败')
      console.error(error)
    }
  } else {
    ElMessage.warning('没有待校验的题目，请先上传PDF')
    router.push('/pdf-import')
  }
}

// 校验操作
const previousQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextQuestion = () => {
  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value++
  }
}

const skipQuestion = () => {
  ElMessage.warning('已跳过此题')
  nextQuestion()
}

const saveQuestion = async () => {
  const question = currentQuestion.value
  if (!question) return

  try {
    // 构造题目数据
    const questionData = {
      questionId: `pdf_${Date.now()}_${question.questionNumber}`,
      topic: question.topic || '三角函数',
      difficulty: question.difficulty || 'L1',
      type: question.type || 'choice',
      question: question.rawText,
      answer: question.answer,
      options: question.options?.map((opt: any) => opt.content),
      solution: question.solution,
      tags: question.knowledgePoints || [],
      knowledgePoints: question.knowledgePoints || [],
      abilityTags: ['计算'],
      source: 'pdf_import'
    }

    // 调用API保存
    await pdfAPI.verifyQuestion(questionData)

    ElMessage.success(`题目${question.questionNumber}已保存到题库`)
    nextQuestion()
  } catch (error) {
    ElMessage.error('保存失败')
    console.error(error)
  }
}

// 直接在校验页面创建测试数据
const createTestDataHere = () => {
  const mockQuestions = [
    {
      questionNumber: 1,
      rawText: '计算：$\\sin(30^\\circ) = ?$',
      options: [
        { letter: 'A', content: '$\\frac{1}{2}$' },
        { letter: 'B', content: '$\\frac{\\sqrt{2}}{2}$' },
        { letter: 'C', content: '$\\frac{\\sqrt{3}}{2}$' },
        { letter: 'D', content: '1' }
      ],
      hasFormula: true,
      answer: 'A',
      type: 'choice',
      difficulty: 'L1',
      knowledgePoints: ['三角函数', '特殊值'],
      solution: '$\\sin(30^\\circ) = \\frac{1}{2}$',
      imageUrl: 'https://via.placeholder.com/600x400?text=Question+1',
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
      hasFormula: true,
      answer: 'B',
      type: 'choice',
      difficulty: 'L1',
      knowledgePoints: ['三角函数', '特殊值'],
      solution: '$\\cos(45^\\circ) = \\frac{\\sqrt{2}}{2}$',
      imageUrl: 'https://via.placeholder.com/600x400?text=Question+2',
      topic: '三角函数'
    }
  ]

  // 保存并立即加载
  sessionStorage.setItem('pdfQuestions', JSON.stringify(mockQuestions))
  questions.value = mockQuestions

  console.log('[PDFReview] 测试数据已创建，题目数:', mockQuestions.length)
  ElMessage.success('测试数据已加载！')
}

onMounted(() => {
  console.log('[PDFReview] onMounted开始')

  // 从sessionStorage加载题目数据
  const savedQuestions = sessionStorage.getItem('pdfQuestions')
  console.log('[PDFReview] savedQuestions:', savedQuestions ? '有数据' : '无数据')

  if (savedQuestions && savedQuestions !== 'undefined' && savedQuestions !== 'null') {
    try {
      const parsed = JSON.parse(savedQuestions)
      console.log('[PDFReview] 解析结果:', parsed)

      // 强制更新
      questions.value = []
      setTimeout(() => {
        questions.value = Array.isArray(parsed) ? parsed : []
        console.log('[PDFReview] 题目已设置:', questions.value.length, '道')
        console.log('[PDFReview] 第一题:', questions.value[0])
      }, 50)

    } catch (error) {
      console.error('[PDFReview] 解析失败:', error)
      questions.value = []
    }
  } else {
    console.warn('[PDFReview] sessionStorage中没有有效数据')
    questions.value = []
  }
})

const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.2, 3)
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.2, 0.5)
}

const insertSymbol = (symbol: string) => {
  latexCode.value += symbol
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 页面加载时读取数据
import { onMounted } from 'vue'
onMounted(() => {
  loadReviewData()
})
</script>

<style scoped>
.pdf-review-page {
  width: 100%;
}

.progress-card :deep(.el-card__body) {
  padding: 15px 20px;
}

.review-progress {
  display: flex;
  align-items: center;
  gap: 20px;
}

.review-progress span {
  min-width: 120px;
  font-weight: bold;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-container {
  height: 600px;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #f5f7fa;
  border-radius: 4px;
}

/* 右侧表单区域 - 移除滚动条 */
:deep(.el-form) {
  max-height: none;
  overflow: visible;
}

:deep(.el-card__body) {
  overflow: visible;
}

.pdf-image {
  max-width: 100%;
  transition: transform 0.3s;
  cursor: move;
}

.latex-editor {
  width: 100%;
}

.latex-preview {
  margin: 10px 0;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
  min-height: 50px;
}

.latex-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.option-editor {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.option-label {
  font-weight: bold;
  min-width: 25px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

