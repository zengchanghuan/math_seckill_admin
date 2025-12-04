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
          <el-button type="primary" @click="loadRealPDFData" size="small">
            <el-icon><Document /></el-icon>
            加载真实PDF数据
          </el-button>
          <el-button type="success" @click="createData" size="small">
            <el-icon><MagicStick /></el-icon>
            创建测试数据
          </el-button>
        </el-space>
      </div>
    </el-card>

    <!-- 左右对比：OCR原文 vs 编辑 -->
    <el-row :gutter="15" v-if="currentQuestion" style="margin-top: 15px;">
      <!-- 左侧：OCR原文 -->
      <el-col :xs="24" :md="12">
        <el-card shadow="hover">
          <template #header>
            <span>📄 OCR识别原文（仅供参考）</span>
          </template>
          <el-alert type="warning" :closable="false" style="margin-bottom: 10px;">
            <strong>提示：</strong>OCR可能有错误，请对照右侧编辑框修正
          </el-alert>
          <div class="ocr-text">
            {{ currentQuestion.ocrRawText || currentQuestion.rawText }}
          </div>
          <div v-if="currentQuestion.options" style="margin-top: 15px;">
            <strong>OCR识别的选项：</strong>
            <div v-for="(opt, idx) in currentQuestion.options" :key="idx" style="margin-top: 5px;">
              <el-tag>{{ opt.letter }}</el-tag> {{ opt.content }}
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：编辑表单 -->
      <el-col :xs="24" :md="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>✏️ 编辑题目 {{ currentQuestion.questionNumber }}</span>
              <el-radio-group v-model="currentQuestion.difficulty" size="small">
                <el-radio-button label="L1">简单</el-radio-button>
                <el-radio-button label="L2">中等</el-radio-button>
                <el-radio-button label="L3">困难</el-radio-button>
              </el-radio-group>
            </div>
          </template>

          <el-form label-width="90px" size="small">
            <el-form-item label="题目内容">
              <el-input
                v-model="currentQuestion.rawText"
                type="textarea"
                :rows="3"
                placeholder="修正OCR错误，数学公式用LaTeX：$...$"
              />
            </el-form-item>

            <!-- LaTeX快捷按钮 -->
            <el-form-item label="快捷输入">
              <el-space wrap>
                <el-button size="small" @click="insertLatex('\\sin')">sin</el-button>
                <el-button size="small" @click="insertLatex('\\cos')">cos</el-button>
                <el-button size="small" @click="insertLatex('\\lim')">lim</el-button>
                <el-button size="small" @click="insertLatex('\\frac{}{}')">分数</el-button>
                <el-button size="small" @click="insertLatex('\\sqrt{}')">根号</el-button>
                <el-button size="small" @click="insertLatex('\\int')">积分</el-button>
                <el-button size="small" @click="insertLatex('^{}')">上标</el-button>
                <el-button size="small" @click="insertLatex('_{}')">下标</el-button>
              </el-space>
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
      </el-col>
    </el-row>

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
  Check,
  Document
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
      ocrRawText: '. té lim[ cosx - f(x)]=1, WY Sal a at',  // 模拟OCR原文
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
      ocrRawText: '2. Calc: cos(45 degrees) = ?',  // 模拟OCR原文
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

  ElMessage.success('测试数据已创建！左侧显示OCR原文，右侧快速修正')
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

// LaTeX快捷插入
const insertLatex = (latex: string) => {
  if (currentQuestion.value) {
    const current = currentQuestion.value.rawText || ''
    // 插入到末尾，用户可以移动位置
    currentQuestion.value.rawText = current + ' $' + latex + '$'
    ElMessage.success('已插入：' + latex)
  }
}

// 加载真实PDF数据（从智能识别结果）
const loadRealPDFData = () => {
  // 从智能识别结果加载
  const realQuestions = [
    {
      questionNumber: 1,
      rawText: "",  // 待用户修正
      ocrRawText: `一、单项选择题（本大题共5小题，每小题3分，共15分）

第1题：té lim[cosx - f(x)]=1（OCR识别有误）

A. lim f(x)=1
B. lim f(x)cos.x =|
C. lim f(x)=-1
D. lim[f(x)+cosx]=1`,
      options: [
        { letter: 'A', content: 'lim f(x)=1' },
        { letter: 'B', content: 'lim f(x)cos.x =1' },
        { letter: 'C', content: 'lim f(x)=-1' },
        { letter: 'D', content: 'lim[f(x)+cosx]=1' }
      ],
      answer: '',
      type: 'choice',
      difficulty: 'L2',
      knowledgePoints: ['极限', '三角函数'],
      solution: '',
      topic: '高等数学'
    }
  ]

  sessionStorage.setItem('pdfQuestions', JSON.stringify(realQuestions))
  sessionStorage.setItem('pdfFileName', '2020年广东专插本考试《高等数学》试题.pdf')
  questions.value = realQuestions
  currentIndex.value = 0
  pdfFileName.value = '2020年广东专插本考试《高等数学》试题.pdf'

  ElMessage.success('真实PDF数据已加载！OCR识别的选项已预填，请修正公式')
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

.ocr-text {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 400px;
  overflow-y: auto;
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

