<template>
  <div class="tutorials-page">
    <!-- 主题和章节选择 -->
    <el-card class="selector-card">
      <el-form :inline="true">
        <el-form-item label="主题">
          <el-select v-model="selectedTheme" @change="loadTutorials" style="width: 250px;">
            <el-option label="高中衔接大学数学基础" value="高中衔接大学数学基础" />
            <el-option label="专升本" value="专升本" />
            <el-option label="高数期末考试" value="高数期末考试" />
          </el-select>
        </el-form-item>
        <el-form-item label="章节">
          <el-select v-model="selectedChapter" @change="loadChapterContent" style="width: 200px;">
            <el-option 
              v-for="(chapter, idx) in chapters" 
              :key="idx"
              :label="chapter" 
              :value="chapter" 
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 章节内容 -->
    <el-card v-loading="loading" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>{{ selectedChapter }} - 讲解内容</span>
          <el-button type="primary" @click="handleAddCard">
            <el-icon><Plus /></el-icon>
            新增知识卡片
          </el-button>
        </div>
      </template>

      <div v-if="chapterData">
        <!-- 章节导学 -->
        <el-alert
          v-if="chapterData.chapterIntro"
          type="info"
          :closable="false"
          style="margin-bottom: 20px;"
        >
          <template #title>
            <strong>📖 章节导学</strong>
          </template>
          <div class="chapter-intro">
            <p><strong>概述：</strong>{{ chapterData.chapterIntro.overview }}</p>
            <p><strong>学习目标：</strong></p>
            <ul>
              <li v-for="(goal, idx) in chapterData.chapterIntro.learningGoals" :key="idx">
                {{ goal }}
              </li>
            </ul>
            <p>
              <el-tag>预备知识：{{ chapterData.chapterIntro.prerequisite }}</el-tag>
              <el-tag type="warning" style="margin-left: 10px;">
                难度：{{ chapterData.chapterIntro.difficulty }}
              </el-tag>
              <el-tag type="success" style="margin-left: 10px;">
                预估时间：{{ chapterData.chapterIntro.estimatedTime }}
              </el-tag>
            </p>
          </div>
        </el-alert>

        <!-- 知识点列表 -->
        <div v-for="(section, sIdx) in chapterData.sections" :key="sIdx" class="section-block">
          <h3 class="section-title">
            <el-icon><Reading /></el-icon>
            {{ section.sectionName }}
          </h3>
          <p v-if="section.sectionIntro" class="section-intro">{{ section.sectionIntro }}</p>

          <!-- 知识卡片 -->
          <div class="knowledge-cards">
            <el-card
              v-for="(card, cIdx) in section.knowledgeCards"
              :key="cIdx"
              class="knowledge-card"
              shadow="hover"
            >
              <template #header>
                <div class="card-header">
                  <strong>{{ card.title }}</strong>
                  <div>
                    <el-button size="small" @click="handleEditCard(card)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDeleteCard(card)">删除</el-button>
                  </div>
                </div>
              </template>

              <!-- 概念 -->
              <div v-if="card.concept" class="card-section">
                <h4>📌 核心概念</h4>
                <p>{{ card.concept }}</p>
              </div>

              <!-- 公式 -->
              <div v-if="card.formula" class="card-section formula-section">
                <h4>📐 公式</h4>
                <div class="formula-box">
                  <MathFormula v-if="hasLatex(card.formula)" :formula="extractLatex(card.formula)" :display-mode="true" />
                  <pre v-else>{{ card.formula }}</pre>
                </div>
              </div>

              <!-- 记忆技巧 -->
              <div v-if="card.memoryTip" class="card-section">
                <h4>💡 记忆技巧</h4>
                <el-tag type="warning">{{ card.memoryTip }}</el-tag>
              </div>

              <!-- 典型例题 -->
              <div v-if="card.example" class="card-section">
                <h4>📝 典型例题</h4>
                <div class="example-box">
                  <p><strong>题目：</strong>{{ card.example.problem }}</p>
                  <p><strong>解答：</strong>{{ card.example.solution }}</p>
                  <div v-if="card.example.steps">
                    <strong>详细步骤：</strong>
                    <ol>
                      <li v-for="(step, idx) in card.example.steps" :key="idx">{{ step }}</li>
                    </ol>
                  </div>
                </div>
              </div>

              <!-- 易错点 -->
              <div v-if="card.commonMistakes && card.commonMistakes.length > 0" class="card-section">
                <h4>⚠️ 易错点</h4>
                <ul class="mistakes-list">
                  <li v-for="(mistake, idx) in card.commonMistakes" :key="idx">
                    {{ mistake }}
                  </li>
                </ul>
              </div>

              <!-- 解题策略 -->
              <div v-if="card.solvingStrategy" class="card-section">
                <h4>🎯 解题策略</h4>
                <p><strong>{{ card.solvingStrategy.title }}</strong></p>
                <ol>
                  <li v-for="(step, idx) in card.solvingStrategy.steps" :key="idx">
                    {{ step }}
                  </li>
                </ol>
              </div>
            </el-card>
          </div>
        </div>

        <!-- 章节小结 -->
        <el-alert
          v-if="chapterData.chapterSummary"
          type="success"
          :closable="false"
          style="margin-top: 30px;"
        >
          <template #title>
            <strong>📚 章节小结</strong>
          </template>
          <div class="chapter-summary">
            <div v-if="chapterData.chapterSummary.keyPoints">
              <h4>关键要点：</h4>
              <ul>
                <li v-for="(point, idx) in chapterData.chapterSummary.keyPoints" :key="idx">
                  {{ point }}
                </li>
              </ul>
            </div>

            <div v-if="chapterData.chapterSummary.formulaSheet">
              <h4>公式速查表：</h4>
              <el-collapse>
                <el-collapse-item 
                  v-for="(formulas, key) in chapterData.chapterSummary.formulaSheet" 
                  :key="key"
                  :title="key"
                >
                  <ul>
                    <li v-for="(formula, idx) in formulas" :key="idx">
                      <MathFormula v-if="hasLatex(formula)" :formula="extractLatex(formula)" />
                      <span v-else>{{ formula }}</span>
                    </li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
            </div>

            <div v-if="chapterData.chapterSummary.studyTips">
              <h4>学习建议：</h4>
              <ul>
                <li v-for="(tip, idx) in chapterData.chapterSummary.studyTips" :key="idx">
                  {{ tip }}
                </li>
              </ul>
            </div>
          </div>
        </el-alert>
      </div>

      <el-empty v-else description="暂无内容" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Reading } from '@element-plus/icons-vue'
import { tutorialAPI } from '../api'
import MathFormula from '../components/MathFormula.vue'

const selectedTheme = ref('高中衔接大学数学基础')
const selectedChapter = ref('第1章 三角函数')
const chapters = ref<string[]>([
  '第1章 三角函数',
  '第2章 代数与方程',
  '第3章 平面几何',
  '第4章 排列组合',
  '第5章 参数方程',
  '第6章 复数',
  '第7章 反三角函数'
])

const loading = ref(false)
const chapterData = ref<any>(null)

// 加载讲解内容
const loadTutorials = async () => {
  try {
    const data = await tutorialAPI.getAll()
    if (data && data.themes) {
      const theme = data.themes.find((t: any) => t.themeName === selectedTheme.value)
      if (theme && theme.chapters) {
        chapters.value = theme.chapters.map((ch: any) => ch.chapterName)
        if (chapters.value.length > 0) {
          selectedChapter.value = chapters.value[0]
          loadChapterContent()
        }
      }
    }
  } catch (error) {
    ElMessage.error('加载讲解内容失败')
    console.error(error)
  }
}

// 加载章节内容
const loadChapterContent = async () => {
  loading.value = true
  try {
    const data = await tutorialAPI.getChapter(selectedTheme.value, selectedChapter.value)
    chapterData.value = data
  } catch (error) {
    ElMessage.error('加载章节内容失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAddCard = () => {
  ElMessage.info('新增知识卡片功能开发中...')
}

const handleEditCard = (card: any) => {
  ElMessage.info(`编辑卡片: ${card.title}`)
}

const handleDeleteCard = (card: any) => {
  ElMessage.info(`删除卡片: ${card.title}`)
}

// 工具函数
const hasLatex = (text: string) => {
  return text && text.includes('$')
}

const extractLatex = (text: string) => {
  if (!text) return ''
  const match = text.match(/\$(.*?)\$/)
  return match ? match[1] : text
}

onMounted(() => {
  loadTutorials()
})
</script>

<style scoped>
.tutorials-page {
  width: 100%;
}

.selector-card :deep(.el-card__body) {
  padding: 15px 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chapter-intro,
.chapter-summary {
  line-height: 1.8;
}

.chapter-intro ul,
.chapter-summary ul {
  margin: 10px 0;
  padding-left: 20px;
}

.section-block {
  margin-bottom: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #409eff;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.section-intro {
  color: #606266;
  margin-bottom: 15px;
  font-style: italic;
}

.knowledge-cards {
  display: grid;
  gap: 15px;
}

.knowledge-card {
  transition: transform 0.2s;
}

.knowledge-card:hover {
  transform: translateY(-2px);
}

.card-section {
  margin-bottom: 15px;
}

.card-section h4 {
  color: #303133;
  margin-bottom: 8px;
  font-size: 14px;
}

.card-section p {
  line-height: 1.6;
  color: #606266;
}

.formula-section {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.formula-box {
  padding: 10px;
  background: white;
  border-radius: 4px;
  text-align: center;
}

.example-box {
  background: #ecf5ff;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.example-box p {
  margin: 8px 0;
}

.example-box ol {
  margin: 10px 0;
  padding-left: 25px;
}

.mistakes-list {
  list-style: none;
  padding: 0;
}

.mistakes-list li {
  padding: 8px 12px;
  margin: 5px 0;
  background: #fef0f0;
  border-left: 3px solid #f56c6c;
  border-radius: 4px;
}
</style>
