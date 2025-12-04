<template>
  <div class="students-page">
    <!-- 学生选择 -->
    <el-card>
      <el-form :inline="true">
        <el-form-item label="学生ID">
          <el-input
            v-model="studentId"
            placeholder="输入学生ID"
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadStudentData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 学生画像 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card v-loading="loading">
          <template #header>
            <span>👤 学生画像</span>
          </template>
          <el-descriptions v-if="profile" :column="1" border>
            <el-descriptions-item label="学生ID">
              {{ profile.studentId }}
            </el-descriptions-item>
            <el-descriptions-item label="总答题数">
              {{ profile.totalAnswered }}
            </el-descriptions-item>
            <el-descriptions-item label="正确率">
              <el-progress 
                :percentage="profile.overallAccuracy * 100" 
                :color="getAccuracyColor(profile.overallAccuracy)"
              />
            </el-descriptions-item>
            <el-descriptions-item label="平均用时">
              {{ profile.avgTimeSeconds?.toFixed(1) }} 秒
            </el-descriptions-item>
            <el-descriptions-item label="学习偏好">
              <el-tag 
                v-for="topic in profile.preferredTopics" 
                :key="topic"
                style="margin-right: 5px;"
              >
                {{ topic }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <el-empty v-else description="暂无数据" />
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card v-loading="loading">
          <template #header>
            <span>📊 知识点掌握度</span>
          </template>
          <div v-if="profile && profile.knowledgeMastery">
            <div 
              v-for="(score, topic) in profile.knowledgeMastery" 
              :key="topic"
              class="mastery-item"
            >
              <span class="mastery-label">{{ topic }}</span>
              <el-progress 
                :percentage="score * 100" 
                :color="getMasteryColor(score)"
              />
            </div>
          </div>
          <el-empty v-else description="暂无数据" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 答题记录 -->
    <el-card style="margin-top: 20px;" v-loading="loading">
      <template #header>
        <span>📝 答题记录（最近{{ answerRecords.length }}条）</span>
      </template>
      
      <el-table :data="answerRecords" stripe>
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="questionId" label="题目ID" width="150" />
        <el-table-column label="题目" min-width="200">
          <template #default="{ row }">
            <div v-if="row.questionContent">
              <MathFormula 
                v-if="hasLatex(row.questionContent)" 
                :formula="extractLatex(row.questionContent)" 
              />
              <span v-else>{{ row.questionContent }}</span>
            </div>
            <span v-else class="text-muted">{{ row.questionId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否正确" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.isCorrect" type="success">✓ 正确</el-tag>
            <el-tag v-else type="danger">✗ 错误</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="timeSpent" label="用时(秒)" width="100">
          <template #default="{ row }">
            {{ row.timeSpent?.toFixed(1) }}
          </template>
        </el-table-column>
        <el-table-column prop="timestamp" label="答题时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.timestamp) }}
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="answerRecords.length === 0" description="暂无答题记录" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { studentAPI } from '../api'
import MathFormula from '../components/MathFormula.vue'

const studentId = ref('student_001')
const loading = ref(false)
const profile = ref<any>(null)
const answerRecords = ref<any[]>([])

// 加载学生数据
const loadStudentData = async () => {
  if (!studentId.value) {
    ElMessage.warning('请输入学生ID')
    return
  }

  loading.value = true
  try {
    // 加载学生画像
    const profileData = await studentAPI.getProfile(studentId.value)
    profile.value = profileData

    // 加载答题记录
    const records = await studentAPI.getAnswers(studentId.value)
    answerRecords.value = records || []

    ElMessage.success('数据加载成功')
  } catch (error) {
    ElMessage.error('加载失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 工具函数
const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 0.8) return '#67c23a'
  if (accuracy >= 0.6) return '#e6a23c'
  return '#f56c6c'
}

const getMasteryColor = (score: number) => {
  if (score >= 0.8) return '#67c23a'
  if (score >= 0.5) return '#e6a23c'
  return '#f56c6c'
}

const formatTime = (timestamp: string) => {
  if (!timestamp) return '-'
  return new Date(timestamp).toLocaleString('zh-CN')
}

const hasLatex = (text: string) => {
  return text && text.includes('$')
}

const extractLatex = (text: string) => {
  if (!text) return ''
  const match = text.match(/\$(.*?)\$/)
  return match ? match[1] : text
}
</script>

<style scoped>
.students-page {
  width: 100%;
}

.mastery-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.mastery-label {
  min-width: 100px;
  margin-right: 15px;
}

.text-muted {
  color: #909399;
}
</style>
