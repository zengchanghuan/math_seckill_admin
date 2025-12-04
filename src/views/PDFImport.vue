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

    <!-- 快速指南 -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <span>📖 使用指南</span>
      </template>

      <el-timeline>
        <el-timeline-item timestamp="步骤 1" placement="top">
          <h4>准备PDF文件</h4>
          <p>确保PDF清晰，题号格式规范（1. 2. 3.或(1) (2) (3)）</p>
        </el-timeline-item>
        <el-timeline-item timestamp="步骤 2" placement="top">
          <h4>上传并处理</h4>
          <p>上传PDF后，系统自动进行页面提取、OCR识别、题目切分</p>
        </el-timeline-item>
        <el-timeline-item timestamp="步骤 3" placement="top">
          <h4>人工校验</h4>
          <p>左右对比界面，修正OCR错误，添加LaTeX公式，设置知识点标签</p>
        </el-timeline-item>
        <el-timeline-item timestamp="步骤 4" placement="top">
          <h4>保存入库</h4>
          <p>校验完成的题目自动保存到题库</p>
        </el-timeline-item>
      </el-timeline>

      <el-alert type="warning" :closable="false" style="margin-top: 15px;">
        <template #title>
          ⚠️ 注意事项
        </template>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>数学公式需要人工转换为LaTeX格式</li>
          <li>图表会单独保存为图片文件</li>
          <li>建议先用简单PDF测试流程</li>
        </ul>
      </el-alert>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, View } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { pdfAPI } from '../api'

const router = useRouter()

const uploadRef = ref()
const processing = ref(false)
const currentStep = ref(0)
const progress = ref(0)
const progressText = ref('')
const result = ref<any>(null)

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
    const taskId = uploadResult.taskId

    progress.value = 25
    currentStep.value = 2
    progressText.value = '正在提取PDF页面...'

    // 步骤2：处理PDF（提取、OCR、切分）
    const processResult = await pdfAPI.process(taskId)

    progress.value = 50
    currentStep.value = 3
    progressText.value = '正在进行OCR识别...'

    await delay(1000)

    progress.value = 75
    currentStep.value = 4
    progressText.value = '正在切分题目...'

    // 获取处理后的题目
    const questionsResult = await pdfAPI.getQuestions(taskId)

    progress.value = 100

    // 保存结果（用于校验页面）
    sessionStorage.setItem('pdfTaskId', taskId)
    sessionStorage.setItem('pdfQuestions', JSON.stringify(questionsResult.questions || []))

    // 完成
    result.value = {
      taskId: taskId,
      fileName: file.name,
      pageCount: processResult.pageCount || 0,
      questionCount: questionsResult.questions?.length || 0
    }

    ElMessage.success('PDF处理完成！可以开始校验了')

  } catch (error: any) {
    ElMessage.error(error.message || '处理失败，请检查后端服务是否运行')
    console.error('PDF处理错误:', error)
  } finally {
    processing.value = false
  }
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
  router.push('/pdf-review')
}

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
</script>

<style scoped>
.pdf-import-page {
  max-width: 1000px;
  margin: 0 auto;
}

:deep(.el-upload-dragger) {
  padding: 60px 20px;
}

.el-icon--upload {
  font-size: 67px;
  color: #409eff;
  margin-bottom: 16px;
}
</style>

