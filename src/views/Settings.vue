<template>
  <div class="settings-page page-container">
    <el-row :gutter="20">
      <!-- 系统配置 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>⚙️ 系统配置</span>
          </template>
          <el-form label-width="120px">
            <el-form-item label="后端地址">
              <el-input v-model="config.backendUrl" />
            </el-form-item>
            <el-form-item label="请求超时">
              <el-input-number v-model="config.timeout" :min="1000" :max="60000" :step="1000" />
              <span style="margin-left: 10px;">毫秒</span>
            </el-form-item>
            <el-form-item label="每页显示">
              <el-input-number v-model="config.pageSize" :min="10" :max="100" :step="10" />
              <span style="margin-left: 10px;">条</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveConfig">保存配置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 数据管理 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>💾 数据管理</span>
          </template>
          <el-space direction="vertical" style="width: 100%;" :size="15">
            <el-button style="width: 100%;" @click="exportQuestions">
              <el-icon><Download /></el-icon>
              导出题库（JSON）
            </el-button>
            <el-upload
              action="#"
              :auto-upload="false"
              :on-change="handleImport"
              :show-file-list="false"
            >
              <el-button style="width: 100%;">
                <el-icon><Upload /></el-icon>
                导入题库（JSON）
              </el-button>
            </el-upload>
            <el-divider />
            <el-button style="width: 100%;" type="warning" @click="clearCache">
              <el-icon><Delete /></el-icon>
              清除缓存
            </el-button>
            <el-button style="width: 100%;" type="danger" @click="confirmReset">
              <el-icon><Warning /></el-icon>
              重置所有数据
            </el-button>
          </el-space>
        </el-card>
      </el-col>
    </el-row>

    <!-- 版本信息 -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <span>ℹ️ 版本信息</span>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="前端版本">
          {{ frontendVersion }}
        </el-descriptions-item>
        <el-descriptions-item label="后端版本">
          {{ backendVersion }}
        </el-descriptions-item>
        <el-descriptions-item label="题库版本">
          {{ questionVersion }}
        </el-descriptions-item>
        <el-descriptions-item label="讲解版本">
          {{ tutorialVersion }}
        </el-descriptions-item>
        <el-descriptions-item label="最后更新">
          {{ lastUpdated }}
        </el-descriptions-item>
        <el-descriptions-item label="运行状态">
          <el-tag type="success">正常</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- API文档链接 -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <span>📖 快捷链接</span>
      </template>
      <el-space wrap>
        <el-button @click="openLink('http://localhost:8000/docs')">
          API文档 (Swagger)
        </el-button>
        <el-button @click="openLink('http://localhost:8000/')">
          后端首页
        </el-button>
        <el-button @click="openLink('https://github.com/zengchanghuan/math_seckill')">
          GitHub仓库
        </el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Upload, Delete, Warning } from '@element-plus/icons-vue'
import { configAPI, questionAPI, tutorialAPI } from '../api'

const config = ref({
  backendUrl: 'http://localhost:8000',
  timeout: 10000,
  pageSize: 20
})

const frontendVersion = ref('1.0.0')
const backendVersion = ref('2.0.0')
const questionVersion = ref('1.0.0')
const tutorialVersion = ref('2.0.0')
const lastUpdated = ref('')

// 加载版本信息
const loadVersionInfo = async () => {
  try {
    const versionData = await configAPI.getVersion()
    backendVersion.value = versionData.version || '2.0.0'

    const tutorialData = await tutorialAPI.getAll()
    tutorialVersion.value = tutorialData.version || '2.0.0'
    lastUpdated.value = tutorialData.lastUpdated || new Date().toLocaleDateString()
  } catch (error) {
    console.error('加载版本信息失败:', error)
  }
}

// 保存配置
const saveConfig = () => {
  localStorage.setItem('adminConfig', JSON.stringify(config.value))
  ElMessage.success('配置已保存')
}

// 导出题库
const exportQuestions = async () => {
  try {
    // 这里需要一个获取所有题目的API
    ElMessage.info('导出功能需要后端提供完整题库下载接口')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 导入题库
const handleImport = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      ElMessage.success(`准备导入 ${data.length} 道题目`)
      // 这里需要调用后端批量创建API
    } catch (error) {
      ElMessage.error('文件格式错误')
    }
  }
  reader.readAsText(file.raw)
}

// 清除缓存
const clearCache = () => {
  localStorage.clear()
  ElMessage.success('缓存已清除')
}

// 重置数据
const confirmReset = () => {
  ElMessageBox.confirm(
    '这将删除所有数据，确定要重置吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.warning('重置功能需要后端支持')
  }).catch(() => {
    ElMessage.info('已取消')
  })
}

// 打开链接
const openLink = (url: string) => {
  window.open(url, '_blank')
}

onMounted(() => {
  // 加载保存的配置
  const saved = localStorage.getItem('adminConfig')
  if (saved) {
    config.value = JSON.parse(saved)
  }
  loadVersionInfo()
})
</script>

<style scoped>
.settings-page {
  width: 100%;
}
</style>
