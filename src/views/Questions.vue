<template>
  <div class="questions-page">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true">
        <el-form-item label="题目搜索">
          <el-input
            v-model="searchQuery"
            placeholder="搜索题目内容"
            style="width: 250px;"
            clearable
          />
        </el-form-item>
        <el-form-item label="章节">
          <el-select v-model="filterTopic" placeholder="全部" style="width: 150px;" clearable>
            <el-option label="三角函数" value="三角函数" />
            <el-option label="代数与方程" value="代数与方程" />
            <el-option label="平面几何" value="平面几何" />
            <el-option label="排列组合" value="排列组合" />
            <el-option label="参数方程" value="参数方程" />
            <el-option label="复数" value="复数" />
            <el-option label="反三角函数" value="反三角函数" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-select v-model="filterDifficulty" placeholder="全部" style="width: 120px;" clearable>
            <el-option label="简单" value="L1" />
            <el-option label="中等" value="L2" />
            <el-option label="困难" value="L3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadQuestions">搜索</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 题目列表 -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>题目列表（共 {{ total }} 题）</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增题目
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="questions"
        style="width: 100%"
        stripe
      >
        <el-table-column type="index" label="#" width="60" />

        <el-table-column prop="question" label="题目内容" min-width="300">
          <template #default="{ row }">
            <div class="question-cell">
              <MathFormula v-if="hasLatex(row.question)" :formula="extractLatex(row.question)" />
              <span v-else>{{ row.question }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="topic" label="章节" width="120">
          <template #default="{ row }">
            <el-tag>{{ row.topic }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.type === 'choice'" type="success">选择题</el-tag>
            <el-tag v-else-if="row.type === 'fill'" type="warning">填空题</el-tag>
            <el-tag v-else type="info">解答题</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="difficulty" label="难度" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.difficulty === 'L1'" type="success">简单</el-tag>
            <el-tag v-else-if="row.difficulty === 'L2'" type="warning">中等</el-tag>
            <el-tag v-else type="danger">困难</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="answer" label="答案" width="120">
          <template #default="{ row }">
            <div class="answer-cell">
              <MathFormula v-if="hasLatex(row.answer)" :formula="extractLatex(row.answer)" />
              <span v-else>{{ row.answer }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除这道题目吗？"
              @confirm="handleDelete(row.questionId)"
            >
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: center;"
        @size-change="loadQuestions"
        @current-change="loadQuestions"
      />
    </el-card>

    <!-- 题目编辑对话框 -->
    <QuestionDialog
      v-model="dialogVisible"
      :question-data="currentQuestion"
      @submit="handleSubmit"
    />

    <!-- 题目详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="题目详情"
      width="700px"
    >
      <el-descriptions v-if="currentQuestion" :column="1" border>
        <el-descriptions-item label="题目ID">
          {{ currentQuestion.questionId }}
        </el-descriptions-item>
        <el-descriptions-item label="题目内容">
          <div class="detail-content">
            <MathFormula
              v-if="hasLatex(currentQuestion.question)"
              :formula="extractLatex(currentQuestion.question)"
              :display-mode="true"
            />
            <span v-else>{{ currentQuestion.question }}</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="章节">
          <el-tag>{{ currentQuestion.topic }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="难度">
          <el-tag v-if="currentQuestion.difficulty === 'L1'" type="success">简单</el-tag>
          <el-tag v-else-if="currentQuestion.difficulty === 'L2'" type="warning">中等</el-tag>
          <el-tag v-else type="danger">困难</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentQuestion.options" label="选项">
          <div v-for="(opt, idx) in currentQuestion.options" :key="idx" class="option-line">
            <strong>{{ String.fromCharCode(65 + idx) }}.</strong>
            <MathFormula v-if="hasLatex(opt)" :formula="extractLatex(opt)" />
            <span v-else>{{ opt }}</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="标准答案">
          <div class="detail-content">
            <MathFormula
              v-if="hasLatex(currentQuestion.answer)"
              :formula="extractLatex(currentQuestion.answer)"
            />
            <span v-else>{{ currentQuestion.answer }}</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="题目解析">
          {{ currentQuestion.solution }}
        </el-descriptions-item>
        <el-descriptions-item label="知识点">
          <el-tag
            v-for="(point, idx) in currentQuestion.knowledgePoints"
            :key="idx"
            style="margin-right: 5px;"
          >
            {{ point }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { questionAPI } from '../api'
import MathFormula from '../components/MathFormula.vue'
import QuestionDialog from '../components/QuestionDialog.vue'

interface Question {
  questionId: string
  question: string
  type: string
  difficulty: string
  topic: string
  answer: string
  options?: string[]
  solution: string
  knowledgePoints: string[]
  tags: string[]
  abilityTags: string[]
}

// 搜索和筛选
const searchQuery = ref('')
const filterTopic = ref('')
const filterDifficulty = ref('')

// 列表数据
const questions = ref<Question[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

// 对话框
const dialogVisible = ref(false)
const detailVisible = ref(false)
const currentQuestion = ref<Question | null>(null)

// 加载题目列表
const loadQuestions = async () => {
  loading.value = true
  try {
    // 注意：这里是模拟数据，实际需要调用后端API
    // const data = await questionAPI.getList(...)

    // 临时使用：直接从stats获取总数
    const stats = await questionAPI.getStats()
    total.value = stats.total || 0

    // 实际应该有分页API，这里先显示空数据提示
    questions.value = []
    ElMessage.info('题目列表API待实现，请在后端添加分页查询接口')

  } catch (error) {
    ElMessage.error('加载失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  filterTopic.value = ''
  filterDifficulty.value = ''
  loadQuestions()
}

// 新增题目
const handleAdd = () => {
  currentQuestion.value = null
  dialogVisible.value = true
}

// 查看详情
const handleView = (question: Question) => {
  currentQuestion.value = question
  detailVisible.value = true
}

// 编辑题目
const handleEdit = (question: Question) => {
  currentQuestion.value = { ...question }
  dialogVisible.value = true
}

// 删除题目
const handleDelete = async (id: string) => {
  try {
    await questionAPI.deleteQuestion(id)
    ElMessage.success('删除成功')
    loadQuestions()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 提交表单
const handleSubmit = async (data: Question) => {
  try {
    if (data.questionId) {
      await questionAPI.updateQuestion(data.questionId, data)
      ElMessage.success('更新成功')
    } else {
      await questionAPI.createQuestion(data)
      ElMessage.success('创建成功')
    }
    loadQuestions()
  } catch (error) {
    ElMessage.error('操作失败')
    console.error(error)
  }
}

// 工具函数：检查是否包含LaTeX
const hasLatex = (text: string) => {
  return text && text.includes('$')
}

// 工具函数：提取LaTeX公式
const extractLatex = (text: string) => {
  if (!text) return ''
  // 提取第一个$...$之间的内容
  const match = text.match(/\$(.*?)\$/)
  return match ? match[1] : text
}

onMounted(() => {
  loadQuestions()
})
</script>

<style scoped>
.questions-page {
  width: 100%;
}

.search-card :deep(.el-card__body) {
  padding: 15px 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-cell,
.answer-cell {
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-content {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.option-line {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}

.option-line strong {
  min-width: 20px;
}
</style>
