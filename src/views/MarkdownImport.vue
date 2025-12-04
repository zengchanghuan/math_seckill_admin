<template>
  <div class="markdown-import-page page-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>📝 Markdown格式题目导入</span>
          <el-tag type="success">快速录入</el-tag>
        </div>
      </template>

      <el-alert type="info" :closable="false" style="margin-bottom: 20px;">
        <template #title>
          <strong>使用说明</strong>
        </template>
        <div style="line-height: 1.8;">
          <p>1. 直接粘贴markdown格式的题目（支持LaTeX公式）</p>
          <p>2. 系统自动识别题型：单项选择题、填空题、计算题、综合题</p>
          <p>3. 点击"解析并导入"后，自动跳转到校验页面进行编辑</p>
          <p>4. LaTeX公式格式：<code>\( ... \)</code> 或 <code>\[ ... \]</code></p>
        </div>
      </el-alert>

      <el-form label-width="100px">
        <el-form-item label="试卷名称">
          <el-input
            v-model="paperName"
            placeholder="例如：广东省2020年普通高等学校高等数学试卷"
            style="max-width: 600px;"
          />
        </el-form-item>

        <el-form-item label="题目内容">
          <el-input
            v-model="markdownText"
            type="textarea"
            :rows="20"
            placeholder="粘贴markdown格式的题目..."
            style="font-family: 'Courier New', monospace; font-size: 14px;"
          />
        </el-form-item>

        <el-form-item>
          <el-space>
            <el-button type="primary" size="large" @click="parseAndImport" :loading="parsing">
              <el-icon><Upload /></el-icon>
              解析并导入
            </el-button>
            <el-button size="large" @click="loadSampleData">
              <el-icon><Document /></el-icon>
              加载示例数据
            </el-button>
            <el-button size="large" @click="clear">
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
          </el-space>
        </el-form-item>
      </el-form>

      <!-- 解析预览 -->
      <el-card v-if="parsedQuestions.length > 0" shadow="hover" style="margin-top: 20px;">
        <template #header>
          <span>🎯 解析结果预览（共 {{ parsedQuestions.length }} 道题）</span>
        </template>
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="选择题">{{ countByType('choice') }} 道</el-descriptions-item>
          <el-descriptions-item label="填空题">{{ countByType('fill') }} 道</el-descriptions-item>
          <el-descriptions-item label="计算题">{{ countByType('calculation') }} 道</el-descriptions-item>
          <el-descriptions-item label="综合题">{{ countByType('comprehensive') }} 道</el-descriptions-item>
        </el-descriptions>

        <div style="margin-top: 15px;">
          <el-button type="success" @click="confirmImport">
            <el-icon><Check /></el-icon>
            确认导入（跳转到校验页面）
          </el-button>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Upload, Document, Delete, Check } from '@element-plus/icons-vue'

interface ParsedQuestion {
  questionNumber: number
  rawText: string
  ocrRawText: string
  options?: { letter: string; content: string }[]
  hasFormula: boolean
  answer: string
  type: string
  difficulty: string
  knowledgePoints: string[]
  solution: string
  topic: string
  sectionTitle?: string
}

const router = useRouter()

const paperName = ref('广东省2020年普通高等学校高等数学试卷')
const markdownText = ref('')
const parsing = ref(false)
const parsedQuestions = ref<ParsedQuestion[]>([])

// 示例数据（完整试卷）
const sampleMarkdown = `# 广东省2020年普通高等学校高等数学数学试卷

## 一、单项选择题（本大题共5小题，每小题3分，共15分。每小题只有一个选项符合题目要求）

1. 设 \\(\\lim_{x \\to 0} \\left[ \\cos x - f(x) \\right] = 1\\)，则下列等式正确的是
   A. \\(\\lim_{x \\to 0} f(x) = 1\\)
   B. \\(\\lim_{x \\to 0} f(x) \\cos x = 1\\)
   C. \\(\\lim_{x \\to 0} f(x) = -1\\)
   D. \\(\\lim_{x \\to 0} \\left[ f(x) + \\cos x \\right] = 1\\)

2. 函数 \\(f(x) = 2x^3 - 3x^2\\) 的极小值点是
   A. \\(x = -1\\)
   B. \\(x = 0\\)
   C. \\(x = 1\\)
   D. \\(x = 2\\)

3. 已知 \\(3^x\\) 是函数 \\(f(x)\\) 的一个原函数，则 \\(f(x) =\\)
   A. \\(3^x\\)
   B. \\(3^x \\ln 3\\)
   C. \\(x 3^{x-1}\\)
   D. \\(\\frac{3^x}{\\ln 3}\\)

4. 设平面区域 \\(D = \\{(x, y) | x^2 + y^2 \\leq 1, y \\geq 0\\}\\)，则 \\(\\iint\\limits_D (x^2 + y^2)^4 d\\sigma =\\)
   A. \\(\\frac{\\pi}{10}\\)
   B. \\(\\frac{\\pi}{9}\\)
   C. \\(\\frac{\\pi}{5}\\)
   D. \\(\\frac{2\\pi}{9}\\)

5. 设级数 \\(\\sum_{n=1}^\\infty a_n\\) 满足 \\(0 \\leq a_n \\leq \\frac{1}{5^n}\\)，则下列级数发散的是
   A. \\(\\sum_{n=1}^\\infty 3a_n\\)
   B. \\(\\sum_{n=1}^\\infty a_{n+3}\\)
   C. \\(\\sum_{n=1}^\\infty \\left( a_n + \\frac{1}{\\sqrt{n^2}} \\right)\\)
   D. \\(\\sum_{n=1}^\\infty \\left( a_n - \\frac{1}{\\sqrt{n^3}} \\right)\\)

## 二、填空题（本大题共5小题，每小题3分，共15分）

6. 若函数 \\( f(x) = \\begin{cases} (1 + a)x^2, & x \\leq 1, \\\\ a(x - 2)^3 + 3, & x > 1 \\end{cases} \\) 在 \\( x = 1 \\) 处连续，则常数 \\( a = \\underline{\\quad } \\)。

7. 曲线 \\( \\frac{x^2}{2} + y^2 = 3 \\) 在点 \\( (2, -1) \\) 处的切线方程为 \\( y = \\underline{\\quad } \\)。

8. 微分方程 \\( y'' + 3y' - 4y = 0 \\) 的通解为 \\( y = \\underline{\\quad } \\)。

9. 设二元函数 \\( f(x, y) \\) 在点 \\( (0, 0) \\) 的某个邻域内有定义，且当 \\( x \\neq 0 \\) 时，\\[ \\frac{f(x, 0) - f(0, 0)}{x} = 3x + 2，\\] 则 \\( f_x'(0, 0) = \\underline{\\quad } \\)。

10. 设函数 \\( f(x) \\) 在 \\((-\\infty, +\\infty)\\) 内可导，且满足 \\( f(x) = f'(x), f(0) = m \\)。如果 \\[ \\int_{-1}^{1} \\frac{f(x)}{e^x} dx = 8，\\] 则 \\( m = \\underline{\\quad } \\)。

## 三、计算题（本大题共8小题，每小题6分，共48分）

11. 求极限 \\[ \\lim_{x \\to 0} \\frac{\\int_0^x t \\arctan t \\, dt}{x^3}。\\]

12. 已知 \\( y \\) 是 \\( x \\) 的函数，且 \\[ y' = \\ln \\sqrt{x} + \\sqrt{\\ln x} + 2 \\ln 2，\\] 求 \\[ \\frac{d^2 y}{dx^2} \\bigg|_{x=e}。\\]

13. 求不定积分 \\[ \\int (\\cos 2x - x \\sin x^2) \\, dx。\\]

14. 设函数 \\[ f(x) = \\begin{cases} \\frac{x^3}{1+x^2}, & x \\leq 1, \\\\ x, & x > 1. \\end{cases} \\] 求定积分 \\[ \\int_{-3}^0 f(x+2) \\, dx。\\]

15. 求二元函数 \\[ z = 3xy^2 + \\frac{x^2}{y} \\] 的全微分 \\( dz \\)，并求 \\[ \\frac{\\partial^2 z}{\\partial x \\partial y}。\\]

16. 计算 \\[ \\iint_D y \\, d\\sigma，\\] 其中 \\( D \\) 是由直线 \\( y = x, y = x-2 \\) 与 \\( y = 0, y = 2 \\) 围成的有界闭区域。

17. 求微分方程 \\[ \\frac{dy}{dx} = \\frac{\\sec^2 x}{y^2} \\] 满足初始条件 \\[ y \\big|_{x=0} = 1 \\] 的特解。

18. 判定级数 \\[ \\sum_{n=1}^{\\infty} \\frac{n^n}{2^n n!} \\] 的收敛性。

## 四、综合题（本大题共 2 小题，第 19 小题 10 分，第 20 小题 12 分，共 22 分）

19. 设有界平面图形 \\( G \\) 由曲线 \\( y = e^{ax} \\) 和直线 \\( y = e \\)，\\( x = 0 \\) 围成，其中常数 \\( a > 0 \\)。若 \\( G \\) 的面积等于 1。(1) 求 \\( a \\) 的值；(2) 求 \\( G \\) 绕 \\( y \\) 轴旋转一周而成的旋转体的体积 \\( V \\)。

20. 设函数 \\( f(x) = \\frac{a}{1 + e^x} \\)，其中 \\( a, b \\) 为常数，且 \\( ab \\neq 0 \\)。(1) 判别 \\( f(x) \\) 在区间 \\((-\\infty, +\\infty)\\) 内的单调性；(2) 求曲线 \\( y = f(x) \\) 的拐点；(3) 求曲线 \\( y = f(x) \\) 的水平渐近线方程。`

const loadSampleData = () => {
  markdownText.value = sampleMarkdown
  ElMessage.success('示例数据已加载')
}

const clear = () => {
  markdownText.value = ''
  parsedQuestions.value = []
}

// 解析markdown
const parseAndImport = () => {
  if (!markdownText.value.trim()) {
    ElMessage.warning('请先粘贴题目内容')
    return
  }

  parsing.value = true

  try {
    const questions: ParsedQuestion[] = []
    const lines = markdownText.value.split('\n')

    let currentSection = ''
    let currentQuestionNumber = 0
    let currentQuestionText = ''
    let currentOptions: { letter: string; content: string }[] = []
    let inQuestion = false
    let questionType = 'choice'

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // 识别章节标题（二级标题）
      if (line.startsWith('## ')) {
        if (inQuestion && currentQuestionText) {
          // 保存上一道题
          questions.push(createQuestion(currentQuestionNumber, currentQuestionText, currentOptions, currentSection, questionType))
          currentQuestionText = ''
          currentOptions = []
          inQuestion = false
        }

        currentSection = line.replace('## ', '').trim()

        // 根据章节标题判断题型
        if (currentSection.includes('单项选择题') || currentSection.includes('多项选择题')) {
          questionType = 'choice'
        } else if (currentSection.includes('填空题')) {
          questionType = 'fill'
        } else if (currentSection.includes('计算题')) {
          questionType = 'calculation'
        } else if (currentSection.includes('综合题')) {
          questionType = 'comprehensive'
        }
        continue
      }

      // 识别题号（1. 2. 3. 或 1、2、3、）
      const questionMatch = line.match(/^(\d+)[.、]\s*(.*)/)
      if (questionMatch) {
        // 保存上一道题
        if (inQuestion && currentQuestionText) {
          questions.push(createQuestion(currentQuestionNumber, currentQuestionText, currentOptions, currentSection, questionType))
          currentOptions = []
        }

        currentQuestionNumber = parseInt(questionMatch[1])
        currentQuestionText = questionMatch[2]
        inQuestion = true
        continue
      }

      // 识别选项（A. B. C. D. 或 A、B、C、D、）
      const optionMatch = line.match(/^([A-D])[.、]\s*(.*)/)
      if (optionMatch && questionType === 'choice') {
        currentOptions.push({
          letter: optionMatch[1],
          content: optionMatch[2]
        })
        continue
      }

      // 继续拼接题目文本（多行题目）
      if (inQuestion && line && !line.startsWith('#')) {
        currentQuestionText += ' ' + line
      }
    }

    // 保存最后一道题
    if (inQuestion && currentQuestionText) {
      questions.push(createQuestion(currentQuestionNumber, currentQuestionText, currentOptions, currentSection, questionType))
    }

    parsedQuestions.value = questions
    ElMessage.success(`✅ 成功解析 ${questions.length} 道题目`)
  } catch (error: any) {
    ElMessage.error(`解析失败: ${error.message}`)
    console.error('解析错误:', error)
  } finally {
    parsing.value = false
  }
}

// 创建题目对象
const createQuestion = (
  questionNumber: number,
  rawText: string,
  options: { letter: string; content: string }[],
  sectionTitle: string,
  type: string
): ParsedQuestion => {
  // 将 \( \) 转换为 $ $
  const convertedText = rawText.replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$').replace(/\\\]/g, '$$')

  const convertedOptions = options.map(opt => ({
    letter: opt.letter,
    content: opt.content.replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$').replace(/\\\]/g, '$$')
  }))

  return {
    questionNumber,
    rawText: convertedText,
    ocrRawText: `【${sectionTitle}】\n${convertedText}`,
    options: convertedOptions.length > 0 ? convertedOptions : undefined,
    hasFormula: /\$/.test(convertedText),
    answer: '', // 待人工填写
    type,
    difficulty: 'L2',
    knowledgePoints: [],
    solution: '',
    topic: '高等数学',
    sectionTitle
  }
}

// 统计题型
const countByType = (type: string) => {
  return parsedQuestions.value.filter(q => q.type === type).length
}

// 确认导入
const confirmImport = () => {
  if (parsedQuestions.value.length === 0) {
    ElMessage.warning('没有解析到题目')
    return
  }

  // 存储到sessionStorage
  const taskId = 'markdown_' + Date.now()
  sessionStorage.setItem('pdfTaskId', taskId)
  sessionStorage.setItem('pdfQuestions', JSON.stringify(parsedQuestions.value))
  sessionStorage.setItem('pdfFileName', paperName.value || '未命名试卷.md')

  ElMessage.success('✅ 题目已导入，跳转到校验页面...')

  setTimeout(() => {
    router.push('/pdf-review')
  }, 500)
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

code {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #e83e8c;
}
</style>

