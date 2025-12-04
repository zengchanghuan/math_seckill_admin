<template>
  <div class="pdf-import-page">
    <el-card>
      <template #header>
        <span>📄 PDF真题导入</span>
      </template>

      <!-- 上传区域 -->
      <el-upload
        ref="uploadRef"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :limit="1"
        accept=".pdf"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将PDF文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持PDF格式，建议文件大小不超过50MB
          </div>
        </template>
      </el-upload>

      <!-- 处理进度 -->
      <el-card v-if="processing" style="margin-top: 20px;" shadow="never">
        <el-steps :active="currentStep" align-center>
          <el-step title="上传PDF" icon="Upload" />
          <el-step title="页面提取" icon="Document" />
          <el-step title="OCR识别" icon="View" />
          <el-step title="题目切分" icon="Operation" />
        </el-steps>

        <div style="margin-top: 20px; text-align: center;">
          <el-progress
            :percentage="progress"
            :status="progress === 100 ? 'success' : undefined"
          />
          <p style="margin-top: 10px; color: #606266;">
            {{ progressText }}
          </p>
        </div>
      </el-card>

      <!-- 处理结果 -->
      <el-card v-if="result" style="margin-top: 20px;">
        <template #header>
          <span>📊 处理结果</span>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="PDF文件">
            {{ result.fileName }}
          </el-descriptions-item>
          <el-descriptions-item label="总页数">
            {{ result.pageCount }}
          </el-descriptions-item>
          <el-descriptions-item label="提取题目">
            {{ result.questionCount }}
          </el-descriptions-item>
          <el-descriptions-item label="处理状态">
            <el-tag type="success">完成</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div style="margin-top: 20px; text-align: center;">
          <el-button type="primary" size="large" @click="startReview">
            <el-icon><View /></el-icon>
            开始校验题目
          </el-button>
        </div>
      </el-card>
    </el-card>

    <!-- 快速操作和帮助 -->
    <el-card style="margin-top: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <el-button type="info" @click="createMockData">
          <el-icon><MagicStick /></el-icon>
          创建测试数据（体验校验流程）
        </el-button>

        <el-button @click="helpDialogVisible = true">
          <el-icon><QuestionFilled /></el-icon>
          查看使用指南
        </el-button>
      </div>
    </el-card>

    <!-- 使用指南对话框 -->
    <el-dialog
      v-model="helpDialogVisible"
      title="📖 PDF真题录入使用指南"
      width="700px"
    >
      <el-steps :active="4" direction="vertical">
        <el-step title="准备PDF文件">
          <template #description>
            确保PDF清晰，题号格式规范（1. 2. 3. 或 (1) (2) (3)）
          </template>
        </el-step>
        <el-step title="上传并处理">
          <template #description>
            拖拽或点击上传PDF，系统自动进行页面提取、OCR识别、题目切分（约5-10分钟）
          </template>
        </el-step>
        <el-step title="人工校验">
          <template #description>
            左右对比界面，修正OCR错误，添加LaTeX公式，设置知识点标签（约2-3分钟/题）
          </template>
        </el-step>
        <el-step title="保存入库">
          <template #description>
            校验完成的题目自动保存到题库，可在"题目管理"中查看
          </template>
        </el-step>
      </el-steps>

      <el-alert type="warning" :closable="false" style="margin-top: 20px;">
        <template #title>
          ⚠️ 注意事项
        </template>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>数学公式需要人工转换为LaTeX格式（如：\sin(30^\circ) = \frac{1}{2}）</li>
          <li>图表会单独保存为图片文件</li>
          <li>建议先用"创建测试数据"体验流程</li>
          <li>支持的题号格式：1. 2. 3. 或 (1) (2) (3)</li>
        </ul>
      </el-alert>

      <el-alert type="success" :closable="false" style="margin-top: 15px;">
        <template #title>
          💡 效率提升
        </template>
        <p>传统手工录入：10-15分钟/题</p>
        <p>使用本系统：2-3分钟/题</p>
        <p><strong>效率提升：5-7倍！</strong></p>
      </el-alert>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, View, MagicStick, QuestionFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { pdfAPI } from '../api'

const router = useRouter()

const uploadRef = ref()
const processing = ref(false)
const currentStep = ref(0)
const progress = ref(0)
const progressText = ref('')
const result = ref<any>(null)
const helpDialogVisible = ref(false)

const handleFileChange = (file: any) => {
  console.log('选择文件:', file.name)
  ElMessage.info('准备处理PDF...')
  // 开始处理
  processFile(file.raw)
}

const processFile = async (file: File) => {
  processing.value = true
  currentStep.value = 0
  progress.value = 0
  result.value = null

  try {
    // 步骤1：上传PDF
    currentStep.value = 1
    progressText.value = '正在上传PDF文件...'
    progress.value = 10

    const uploadResult = await pdfAPI.upload(file)
    console.log('上传结果:', uploadResult)
    const taskId = uploadResult.taskId

    progress.value = 25
    currentStep.value = 2
    progressText.value = '正在提取PDF页面...'

    // 步骤2：处理PDF（提取、OCR、切分）
    const processResult = await pdfAPI.process(taskId)
    console.log('处理结果:', processResult)

    progress.value = 50
    currentStep.value = 3
    progressText.value = '正在进行OCR识别...'

    await delay(1000)

    progress.value = 75
    currentStep.value = 4
    progressText.value = '正在切分题目...'

    // 获取处理后的题目
    const questionsResult = await pdfAPI.getQuestions(taskId)
    console.log('题目结果:', questionsResult)
    console.log('题目数量:', questionsResult.questions?.length)

    progress.value = 100

    // 保存结果（用于校验页面）
    const questionsData = questionsResult.questions || []
    sessionStorage.setItem('pdfTaskId', taskId)
    sessionStorage.setItem('pdfQuestions', JSON.stringify(questionsData))
    console.log('已保存到sessionStorage，题目数:', questionsData.length)

    // 完成
    const questionCount = questionsData.length

    result.value = {
      taskId: taskId,
      fileName: file.name,
      pageCount: processResult.pageCount || 0,
      questionCount: questionCount
    }

    if (questionCount > 0) {
      ElMessage.success(`PDF处理完成！识别到 ${questionCount} 道题目，可以开始校验了`)
    } else {
      ElMessage.warning('PDF处理完成，但未识别到题目，可能需要调整PDF格式')
    }

  } catch (error: any) {
    console.error('PDF处理完整错误:', error)
    console.error('错误详情:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })

    ElMessage.error(`处理失败: ${error.response?.data?.detail || error.message || '未知错误'}`)
  } finally {
    processing.value = false
  }
}

// 测试功能：创建模拟数据
const createMockData = () => {
  console.log('[创建测试数据] 开始')

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

  const jsonString = JSON.stringify(mockQuestions)
  console.log('[创建测试数据] 题目数量:', mockQuestions.length)
  console.log('[创建测试数据] JSON长度:', jsonString.length)

  // 保存到sessionStorage
  sessionStorage.setItem('pdfTaskId', 'mock_' + Date.now())
  sessionStorage.setItem('pdfQuestions', jsonString)

  // 验证保存
  const saved = sessionStorage.getItem('pdfQuestions')
  console.log('[创建测试数据] 保存验证:', saved ? '成功' : '失败')
  console.log('[创建测试数据] 保存的数据长度:', saved?.length)

  result.value = {
    taskId: 'mock',
    fileName: '测试数据.pdf',
    pageCount: 1,
    questionCount: mockQuestions.length
  }

  ElMessage.success('已创建测试数据，点击"开始校验题目"按钮')
}

const simulateProgress = (start: number, end: number, duration: number) => {
  return new Promise(resolve => {
    const steps = 20
    const stepValue = (end - start) / steps
    const stepDuration = duration / steps

    let current = start
    const interval = setInterval(() => {
      current += stepValue
      progress.value = Math.min(current, end)

      if (current >= end) {
        clearInterval(interval)
        resolve(true)
      }
    }, stepDuration)
  })
}

const startReview = () => {
  console.log('[跳转] 开始跳转到校验页面')
  console.log('[跳转] 当前路由:', router.currentRoute.value.path)

  // 验证数据
  const data = sessionStorage.getItem('pdfQuestions')
  console.log('[跳转] sessionStorage数据长度:', data?.length)

  if (!data) {
    ElMessage.warning('没有数据，请先创建测试数据或上传PDF')
    return
  }

  // 跳转
  router.push('/pdf-review').then(() => {
    console.log('[跳转] 跳转成功')
  }).catch(err => {
    console.error('[跳转] 跳转失败:', err)
  })
}

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
</script>

<style scoped>
.pdf-import-page {
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
  overflow: hidden;
}

:deep(.el-upload-dragger) {
  padding: 40px 20px;
}

.el-icon--upload {
  font-size: 50px;
  color: #409eff;
  margin-bottom: 12px;
}

/* 压缩使用指南高度 */
:deep(.el-timeline-item__content) {
  padding-bottom: 10px;
}

:deep(.el-card) {
  margin-bottom: 15px;
}
</style>

