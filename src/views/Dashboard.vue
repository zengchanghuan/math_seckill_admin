<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <!-- 统计卡片 -->
      <el-col :span="6" v-for="stat in stats" :key="stat.title">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" :color="stat.color">
              <component :is="stat.icon" />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 难度分布 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>题目难度分布</span>
          </template>
          <div ref="difficultyChart" style="height: 300px;"></div>
        </el-card>
      </el-col>

      <!-- 题型分布 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>题目类型分布</span>
          </template>
          <div ref="typeChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近更新 -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <span>系统信息</span>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="后端版本">{{ version }}</el-descriptions-item>
        <el-descriptions-item label="题库版本">{{ tutorialVersion }}</el-descriptions-item>
        <el-descriptions-item label="后端状态">
          <el-tag type="success">运行中</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="最后更新">{{ lastUpdated }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { Document, User, DataAnalysis, Setting } from '@element-plus/icons-vue'
import { questionAPI, configAPI, tutorialAPI } from '../api'

const stats = ref([
  { title: '总题目数', value: 0, icon: Document, color: '#409eff' },
  { title: '学生数', value: 0, icon: User, color: '#67c23a' },
  { title: '答题记录', value: 0, icon: DataAnalysis, color: '#e6a23c' },
  { title: '知识卡片', value: 0, icon: Setting, color: '#f56c6c' }
])

const difficultyChart = ref()
const typeChart = ref()
const version = ref('2.0.0')
const tutorialVersion = ref('1.0.0')
const lastUpdated = ref(new Date().toLocaleDateString())

// 加载数据
const loadData = async () => {
  try {
    // 获取题目统计
    const questionStats = await questionAPI.getStats()
    stats.value[0].value = questionStats.total || 0

    // 初始化图表
    initCharts(questionStats)

    // 获取版本信息
    const versionInfo = await configAPI.getVersion()
    version.value = versionInfo.version || '2.0.0'

    // 获取讲解内容
    const tutorials = await tutorialAPI.getAll()
    tutorialVersion.value = tutorials.version || '1.0.0'
    lastUpdated.value = tutorials.lastUpdated || new Date().toLocaleDateString()

    // 统计知识卡片数
    let cardCount = 0
    if (tutorials.themes) {
      tutorials.themes.forEach((theme: any) => {
        theme.chapters?.forEach((chapter: any) => {
          chapter.sections?.forEach((section: any) => {
            cardCount += section.knowledgeCards?.length || 0
          })
        })
      })
    }
    stats.value[3].value = cardCount

  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 初始化图表
const initCharts = (data: any) => {
  // 难度分布图
  const diffChart = echarts.init(difficultyChart.value)
  diffChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { value: data.difficultyStats?.L1 || 0, name: '简单 (L1)' },
        { value: data.difficultyStats?.L2 || 0, name: '中等 (L2)' },
        { value: data.difficultyStats?.L3 || 0, name: '困难 (L3)' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  })

  // 题型分布图
  const typeChartInstance = echarts.init(typeChart.value)
  typeChartInstance.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['选择题', '填空题', '解答题']
    },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: [
        data.typeStats?.choice || 0,
        data.typeStats?.fill || 0,
        data.typeStats?.solution || 0
      ],
      itemStyle: {
        color: '#409eff'
      }
    }]
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.dashboard {
  width: 100%;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}
</style>

