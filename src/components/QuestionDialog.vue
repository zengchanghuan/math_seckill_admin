<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑题目' : '新增题目'"
    width="800px"
    @close="handleClose"
  >
    <el-form :model="form" label-width="100px">
      <el-form-item label="题目内容">
        <el-input
          v-model="form.question"
          type="textarea"
          :rows="3"
          placeholder="支持LaTeX: 用$包围公式，如 $\sin(30^\circ)$"
        />
      </el-form-item>

      <el-form-item label="公式预览">
        <div class="preview-box">
          <MathFormula v-if="form.question" :formula="extractLatex(form.question)" />
          <span v-else class="placeholder">输入包含$的LaTeX公式可预览</span>
        </div>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="题目类型">
            <el-select v-model="form.type" style="width: 100%;">
              <el-option label="选择题" value="choice" />
              <el-option label="填空题" value="fill" />
              <el-option label="解答题" value="solution" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="难度">
            <el-select v-model="form.difficulty" style="width: 100%;">
              <el-option label="简单" value="L1" />
              <el-option label="中等" value="L2" />
              <el-option label="困难" value="L3" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="所属章节">
        <el-input v-model="form.topic" placeholder="如：三角函数" />
      </el-form-item>

      <el-form-item label="标准答案" v-if="form.type !== 'solution'">
        <el-input v-model="form.answer" placeholder="支持LaTeX格式" />
      </el-form-item>

      <el-form-item label="选项" v-if="form.type === 'choice'">
        <div v-for="(option, index) in form.options" :key="index" class="option-item">
          <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
          <el-input v-model="form.options[index]" placeholder="支持LaTeX" />
          <el-button
            v-if="form.options.length > 1"
            type="danger"
            :icon="Delete"
            circle
            size="small"
            @click="removeOption(index)"
          />
        </div>
        <el-button type="primary" size="small" @click="addOption">
          <el-icon><Plus /></el-icon>
          添加选项
        </el-button>
      </el-form-item>

      <el-form-item label="题目解析">
        <el-input
          v-model="form.solution"
          type="textarea"
          :rows="3"
          placeholder="详细解答过程"
        />
      </el-form-item>

      <el-form-item label="知识点">
        <el-input v-model="knowledgePointsStr" placeholder="多个知识点用逗号分隔" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import MathFormula from './MathFormula.vue'

interface Question {
  questionId?: string
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

interface Props {
  modelValue: boolean
  questionData?: Question | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: Question): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.questionData?.questionId)

const defaultForm: Question = {
  question: '',
  type: 'choice',
  difficulty: 'L1',
  topic: '三角函数',
  answer: '',
  options: ['', '', '', ''],
  solution: '',
  knowledgePoints: [],
  tags: [],
  abilityTags: ['计算']
}

const form = ref<Question>({ ...defaultForm })

const knowledgePointsStr = computed({
  get: () => form.value.knowledgePoints.join('、'),
  set: (val) => {
    form.value.knowledgePoints = val.split(/[,，、]/).map(s => s.trim()).filter(s => s)
  }
})

// 监听props变化
watch(() => props.questionData, (data) => {
  if (data) {
    form.value = { ...data }
  } else {
    form.value = { ...defaultForm }
  }
}, { immediate: true })

// 提取LaTeX公式（简单版）
const extractLatex = (text: string) => {
  const match = text.match(/\$(.*?)\$/)?.[1]
  return match || text
}

const addOption = () => {
  form.value.options = form.value.options || []
  form.value.options.push('')
}

const removeOption = (index: number) => {
  form.value.options?.splice(index, 1)
}

const handleClose = () => {
  visible.value = false
}

const handleSubmit = () => {
  // 基本验证
  if (!form.value.question) {
    ElMessage.warning('请输入题目内容')
    return
  }
  if (!form.value.answer && form.value.type !== 'solution') {
    ElMessage.warning('请输入标准答案')
    return
  }

  // 为选择题自动标记答案字母
  if (form.value.type === 'choice' && form.value.options) {
    // 假设answer是选项内容，转换为字母
    const answerIndex = form.value.options.findIndex(opt => opt === form.value.answer)
    if (answerIndex >= 0) {
      form.value.answer = String.fromCharCode(65 + answerIndex)
    }
  }

  emit('submit', { ...form.value })
  handleClose()
}
</script>

<style scoped>
.preview-box {
  min-height: 60px;
  padding: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #f5f7fa;
}

.preview-box .placeholder {
  color: #909399;
  font-size: 14px;
}

.option-item {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.option-label {
  font-weight: bold;
  min-width: 20px;
}
</style>

