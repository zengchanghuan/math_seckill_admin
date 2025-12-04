<template>
  <div class="feedbacks-page page-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>📬 题目纠错反馈</span>
          <div>
            <el-tag type="danger" size="large">待处理：{{ pendingCount }}</el-tag>
            <el-tag type="success" size="large" style="margin-left: 10px;">总计：{{ totalCount }}</el-tag>
          </div>
        </div>
      </template>

      <!-- 筛选栏 -->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="12">
          <el-radio-group v-model="statusFilter" @change="loadFeedbacks">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="pending">待处理</el-radio-button>
            <el-radio-button label="resolved">已处理</el-radio-button>
            <el-radio-button label="ignored">已忽略</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-button :icon="Refresh" @click="loadFeedbacks">刷新</el-button>
        </el-col>
      </el-row>

      <!-- 反馈列表 -->
      <div v-if="feedbacks.length === 0" style="text-align: center; padding: 40px;">
        <el-empty description="暂无反馈数据">
          <el-button type="primary" @click="loadFeedbacks">刷新数据</el-button>
        </el-empty>
      </div>

      <div v-else>
        <el-card
          v-for="feedback in feedbacks"
          :key="feedback.id"
          shadow="hover"
          style="margin-bottom: 20px;"
          :class="{'feedback-pending': feedback.status === 'pending'}"
        >
          <template #header>
            <div class="feedback-header">
              <div>
                <el-tag :type="getStatusType(feedback.status)">
                  {{ getStatusText(feedback.status) }}
                </el-tag>
                <span style="margin-left: 10px; color: #909399; font-size: 13px;">
                  {{ formatTime(feedback.timestamp) }}
                </span>
              </div>
              <el-space>
                <el-button
                  v-if="feedback.status === 'pending'"
                  type="success"
                  size="small"
                  @click="updateStatus(feedback.id, 'resolved')"
                >
                  <el-icon><Check /></el-icon>
                  标记已处理
                </el-button>
                <el-button
                  v-if="feedback.status === 'pending'"
                  type="warning"
                  size="small"
                  @click="updateStatus(feedback.id, 'ignored')"
                >
                  <el-icon><CloseBold /></el-icon>
                  忽略
                </el-button>
                <el-button
                  v-if="feedback.status !== 'pending'"
                  type="primary"
                  size="small"
                  @click="updateStatus(feedback.id, 'pending')"
                >
                  <el-icon><RefreshLeft /></el-icon>
                  重新处理
                </el-button>
              </el-space>
            </div>
          </template>

          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="题目ID">{{ feedback.questionId }}</el-descriptions-item>
            <el-descriptions-item label="题型">{{ getTypeText(feedback.type) }}</el-descriptions-item>
            <el-descriptions-item label="所属主题">{{ feedback.themeName }}</el-descriptions-item>
            <el-descriptions-item label="所属章节">{{ feedback.chapterName }}</el-descriptions-item>
            <el-descriptions-item label="难度">
              <el-tag size="small">{{ feedback.difficulty }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>

          <el-divider content-position="left">题目内容</el-divider>
          <div class="question-content">
            <MathFormula :formula="feedback.question" />
          </div>

          <div v-if="feedback.options && feedback.options.length > 0">
            <el-divider content-position="left">选项</el-divider>
            <div class="options-list">
              <div v-for="(opt, idx) in feedback.options" :key="idx" class="option-item">
                <el-tag size="small">{{ String.fromCharCode(65 + idx) }}</el-tag>
                <MathFormula :formula="opt" />
              </div>
            </div>
          </div>

          <el-divider content-position="left">答案</el-divider>
          <div class="answer-content">
            <el-tag type="success" size="large">{{ feedback.answer }}</el-tag>
          </div>

          <div v-if="feedback.solution">
            <el-divider content-position="left">解析</el-divider>
            <div class="solution-content">
              <MathFormula :formula="feedback.solution" />
            </div>
          </div>

          <el-divider content-position="left">用户反馈的问题</el-divider>
          <el-alert type="warning" :closable="false">
            <template #title>
              <strong>{{ feedback.description }}</strong>
            </template>
          </el-alert>
        </el-card>
      </div>

      <!-- 分页 -->
      <el-pagination
        v-if="totalCount > pageSize"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalCount"
        layout="total, prev, pager, next, jumper"
        @current-change="loadFeedbacks"
        style="margin-top: 20px; text-align: center;"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Check, CloseBold, RefreshLeft } from '@element-plus/icons-vue'
import MathFormula from '../components/MathFormula.vue'

interface Feedback {
  id: string
  questionId: string
  themeName: string
  chapterName: string
  difficulty: string
  type: string
  question: string
  options?: string[]
  answer: string
  solution?: string
  description: string
  timestamp: string
  status: 'pending' | 'resolved' | 'ignored'
}

const feedbacks = ref<Feedback[]>([])
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const totalCount = computed(() => feedbacks.value.length)
const pendingCount = computed(() => feedbacks.value.filter(f => f.status === 'pending').length)

// 加载反馈数据
const loadFeedbacks = async () => {
  loading.value = true
  try {
    const url = statusFilter.value 
      ? `http://localhost:8000/api/feedbacks?status=${statusFilter.value}`
      : 'http://localhost:8000/api/feedbacks'
    
    const response = await fetch(url)
    const data = await response.json()
    
    feedbacks.value = data.feedbacks || []
    
    ElMessage.success(`加载成功：${feedbacks.value.length} 条反馈`)
  } catch (error: any) {
    ElMessage.error(`加载失败: ${error.message}`)
    console.error('加载反馈失败:', error)
  } finally {
    loading.value = false
  }
}

// 更新反馈状态
const updateStatus = async (feedbackId: string, newStatus: string) => {
  try {
    // 这里简化处理：直接修改本地数据，实际应调用后端API
    const feedback = feedbacks.value.find(f => f.id === feedbackId)
    if (feedback) {
      feedback.status = newStatus as any
      
      ElMessage.success(
        newStatus === 'resolved' ? '已标记为已处理' :
        newStatus === 'ignored' ? '已忽略此反馈' :
        '已重新标记为待处理'
      )
      
      // TODO: 调用后端API更新状态
      // await fetch(`http://localhost:8000/api/feedback/${feedbackId}/status`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status: newStatus })
      // })
    }
  } catch (error: any) {
    ElMessage.error(`操作失败: ${error.message}`)
  }
}

// 格式化时间
const formatTime = (timestamp: string) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN')
}

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'pending': return 'danger'
    case 'resolved': return 'success'
    case 'ignored': return 'info'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '待处理'
    case 'resolved': return '已处理'
    case 'ignored': return '已忽略'
    default: return status
  }
}

// 获取题型文本
const getTypeText = (type: string) => {
  switch (type) {
    case 'choice': return '选择题'
    case 'fill': return '填空题'
    case 'solve': return '解答题'
    default: return type
  }
}

onMounted(() => {
  loadFeedbacks()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feedback-pending {
  border-left: 4px solid #f56c6c;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-content {
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin: 10px 0;
}

.options-list {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
}

.answer-content {
  padding: 10px;
  background-color: #f0f9ff;
  border-radius: 4px;
}

.solution-content {
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>

