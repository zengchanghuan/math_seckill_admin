<template>
  <div class="exam-answer-page page-container">
    <el-card shadow="hover">
      <template #header>
        <div class="paper-header">
          <h2>{{ paperTitle }}</h2>
          <el-tag type="success" size="large">参考答案</el-tag>
        </div>
      </template>

      <!-- 单项选择题 -->
      <div class="section">
        <h3 class="section-title">一、单项选择题（本大题共5小题，每小题3分，共15分。每小题只有一项符合题目要求）</h3>
        
        <div v-for="q in choiceAnswers" :key="q.id" class="answer-item">
          <div class="question-number">{{ q.number }}.</div>
          <div class="answer-content">
            <MathFormula :formula="q.question" />
            <div class="options">
              <div v-for="opt in q.options" :key="opt.letter" class="option">
                <span class="option-letter">{{ opt.letter }}.</span>
                <MathFormula :formula="opt.content" />
              </div>
            </div>
            <div class="answer-box">
              <el-tag type="success" size="large">答案：{{ q.answer }}</el-tag>
            </div>
            <div class="solution-box" v-if="q.solution">
              <div class="solution-title">
                <el-icon><Check /></el-icon>
                <span>精析：</span>
              </div>
              <MathFormula :formula="q.solution" />
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 填空题 -->
      <div class="section">
        <h3 class="section-title">二、填空题（本大题共 5 小题，每小题 3 分，共 15 分）</h3>
        
        <div v-for="q in fillAnswers" :key="q.id" class="answer-item">
          <div class="question-number">{{ q.number }}.</div>
          <div class="answer-content">
            <MathFormula :formula="q.question" />
            <div class="answer-box">
              <el-tag type="success" size="large">答案：</el-tag>
              <MathFormula :formula="q.answer" />
            </div>
            <div class="solution-box" v-if="q.solution">
              <div class="solution-title">
                <el-icon><Check /></el-icon>
                <span>精析：</span>
              </div>
              <MathFormula :formula="q.solution" />
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 计算题 -->
      <div class="section">
        <h3 class="section-title">三、计算题（本大题共8小题，每小题6分，共48分）</h3>
        
        <div v-for="q in calcAnswers" :key="q.id" class="answer-item">
          <div class="question-number">{{ q.number }}.</div>
          <div class="answer-content">
            <MathFormula :formula="q.question" />
            <div class="solution-box">
              <div class="solution-title">
                <el-icon><Check /></el-icon>
                <span>精析：</span>
              </div>
              <MathFormula :formula="q.solution" />
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 综合题 -->
      <div class="section">
        <h3 class="section-title">四、综合题（本大题共2小题，第19小题10分，第20小题12分，共22分）</h3>
        
        <div v-for="q in comprehensiveAnswers" :key="q.id" class="answer-item">
          <div class="question-number">{{ q.number }}.</div>
          <div class="answer-content">
            <MathFormula :formula="q.question" />
            <div class="solution-box">
              <div class="solution-title">
                <el-icon><Check /></el-icon>
                <span>证明/精析：</span>
              </div>
              <MathFormula :formula="q.solution" />
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import MathFormula from '../components/MathFormula.vue'

const paperTitle = '广东省2023年普通高等学校专升本招生考试高等数学参考答案'

// 单项选择题答案
const choiceAnswers = [
  {
    id: 1,
    number: 1,
    question: '$$ \\lim_{x \\to 0} (2^x + 1) = $$ （ ）',
    options: [
      { letter: 'A', content: '$0$' },
      { letter: 'B', content: '$1$' },
      { letter: 'C', content: '$2$' },
      { letter: 'D', content: '$3$' }
    ],
    answer: 'C',
    solution: '$\\lim_{x \\to 0} (2^x + 1) = 2^0 + 1 = 2$.'
  },
  {
    id: 2,
    number: 2,
    question: '若函数 $ f(x) = \\begin{cases} (1 + x^2)^{\\frac{1}{x^2}}, & x \\neq 0, \\\\ a, & x = 0 \\end{cases} $ 在 $ x = 0 $ 处连续，则 $ a = $ （ ）',
    options: [
      { letter: 'A', content: '$0$' },
      { letter: 'B', content: '$1$' },
      { letter: 'C', content: '$e$' },
      { letter: 'D', content: '$e^2$' }
    ],
    answer: 'C',
    solution: '因为 $f(x)$ 在 $x = 0$ 处连续，所以 $\\lim_{x \\to 0} f(x) = f(0)$，又 $\\lim_{x \\to 0} f(x) = \\lim_{x \\to 0} (1 + x^2)^{\\frac{1}{x^2}} = e, f(0) = a$，故 $a = e$.'
  },
  {
    id: 3,
    number: 3,
    question: '曲线 $ y = xe^{-x} $ 在点 $ (1, e^{-1}) $ 处的切线斜率是 （ ）',
    options: [
      { letter: 'A', content: '$-e^{-1}$' },
      { letter: 'B', content: '$0$' },
      { letter: 'C', content: '$e^{-1}$' },
      { letter: 'D', content: '$2e^{-1}$' }
    ],
    answer: 'B',
    solution: '$y\' = e^{-x} - xe^{-x} = (1 - x)e^{-x}$，则曲线在点 $(1, e^{-1})$ 处的切线斜率为 $y\'(1) = 0$.'
  },
  {
    id: 4,
    number: 4,
    question: '设 $ 2x $ 是 $ f(x) $ 的一个原函数，则 $$ \\int_0^{\\pi/2} [f(x) - \\sin x] dx = $$ （ ）',
    options: [
      { letter: 'A', content: '$\\pi - 1$' },
      { letter: 'B', content: '$\\pi + 1$' },
      { letter: 'C', content: '$\\frac{\\pi^2}{4} - 1$' },
      { letter: 'D', content: '$\\frac{\\pi^2}{4} + 1$' }
    ],
    answer: 'A',
    solution: '由题意知 $\\int_0^{\\pi/2} [f(x) - \\sin x] dx = \\int_0^{\\pi/2} f(x) dx - \\int_0^{\\pi/2} \\sin x dx = 2x \\bigg|_0^{\\pi/2} + \\cos x \\bigg|_0^{\\pi/2} = \\pi - 1$.'
  },
  {
    id: 5,
    number: 5,
    question: '设级数 $$ \\sum_{n=1}^{\\infty} u_n $$ 收敛，则下列级数发散的是 （ ）',
    options: [
      { letter: 'A', content: '$$ \\sum_{n=1}^{\\infty} 4u_n $$' },
      { letter: 'B', content: '$$ \\sum_{n=1}^{\\infty} u_{n+4} $$' },
      { letter: 'C', content: '$$ \\sum_{n=1}^{\\infty} (u_n - u_{n+1}) $$' },
      { letter: 'D', content: '$$ \\sum_{n=1}^{\\infty} (u_n - 1) $$' }
    ],
    answer: 'D',
    solution: '因为 $\\sum_{n=1}^{\\infty} u_n$ 收敛，由常数项级数的基本性质可知 A, B, C 项级数均收敛，又由级数收敛的必要条件知 $\\lim_{n \\to \\infty} u_n = 0$，而 $\\lim_{n \\to \\infty} (u_n - 1) = -1 \\neq 0$，故 $\\sum_{n=1}^{\\infty} (u_n - 1)$ 发散.'
  }
]

// 填空题答案
const fillAnswers = [
  {
    id: 6,
    number: 6,
    question: '曲线 $ y = \\frac{\\sin x}{x} $ 的水平渐近线方程为 $ y = $ ___。',
    answer: '$0$',
    solution: '因为无穷小与有界函数之积仍为无穷小，且 $| \\sin x | \\leq 1$，则 $\\lim_{x \\to \\infty} \\frac{\\sin x}{x} = \\lim_{x \\to \\infty} \\frac{1}{x} \\sin x = 0$，故所求水平渐近线为 $y = 0$。'
  },
  {
    id: 7,
    number: 7,
    question: '已知常数 $ k > 0 $，若 $$ \\int_{k}^{\\infty} \\frac{1}{x^2} dx = 1 $$，则 $ k = $ ___。',
    answer: '$1$',
    solution: '$$ \\int_{k}^{+\\infty} \\frac{1}{x^2} dx = -\\frac{1}{x} \\bigg|_{k}^{+\\infty} = -\\lim_{x \\to +\\infty} \\frac{1}{x} - \\left( -\\frac{1}{k} \\right) = \\frac{1}{k} = 1 $$ 则 $k = 1$。'
  },
  {
    id: 8,
    number: 8,
    question: '设二元函数 $ z = x^x + (x - y)^2 (x > 0) $，则 $$ \\frac{\\partial^2 z}{\\partial y \\partial x} = $$ ___。',
    answer: '$-2$',
    solution: '$$ \\frac{\\partial z}{\\partial y} = 2(x-y) \\cdot (x-y)\'_y = -2(x-y), $$ 则 $$ \\frac{\\partial^2 z}{\\partial y \\partial x} = [-2(x-y)]\'_x = -2. $$'
  },
  {
    id: 9,
    number: 9,
    question: '交换二次积分 $$ \\int_{0}^{1} dx \\int_{\\sqrt{x}}^{1} f(x, y) dy $$ 的积分次序，则 $$ \\int_{0}^{1} dx \\int_{\\sqrt{x}}^{1} f(x, y) dy = $$ ___。',
    answer: '$\\int_{0}^{1} dy \\int_{0}^{y^2} f(x,y) dx$',
    solution: '由题意可得积分区域为：$ 0 \\leq x \\leq 1, \\sqrt{x} \\leq y \\leq 1 $，积分区域还可表示为：$ 0 \\leq x \\leq y^2, 0 \\leq y \\leq 1 $，故 $$ \\int_{0}^{1} dx \\int_{\\sqrt{x}}^{1} f(x,y) dy = \\int_{0}^{1} dy \\int_{0}^{y^2} f(x,y) dx. $$'
  },
  {
    id: 10,
    number: 10,
    question: '微分方程 $ y\'\' - 8y\' + 7y = 0 $ 的通解为 $ y = $ ___。',
    answer: '$C_1 e^x + C_2 e^{7x}$',
    solution: '该微分方程的特征方程为 $ r^2 - 8r + 7 = 0 $，解得特征根 $ r_1 = 1, r_2 = 7 $，故所求通解为 $ y = C_1 e^x + C_2 e^{7x} $.'
  }
]

// 计算题答案
const calcAnswers = [
  {
    id: 11,
    number: 11,
    question: '求极限 $$ \\lim_{x \\to 2} \\frac{x^3 + 3x^2 - 20}{x^2 - 4} $$。',
    solution: '$$ \\lim_{x \\to 2} \\frac{x^3 + 3x^2 - 20}{x^2 - 4} = \\lim_{x \\to 2} \\frac{3x^2 + 6x}{2x} = \\lim_{x \\to 2} \\frac{3x + 6}{2} = 6. $$'
  },
  {
    id: 12,
    number: 12,
    question: '求函数 $ y = \\sqrt{x + \\cos x} $ 在 $ x = 0 $ 处的微分 $ dy \\bigg|_{x=0} $。',
    solution: '$$ y\' = \\frac{1}{2\\sqrt{x + \\cos x}} \\cdot (x + \\cos x)\' = \\frac{1 - \\sin x}{2\\sqrt{x + \\cos x}}, $$ 则 $$ y\'|_{x=0} = \\frac{1}{2}, $$ 故 $$ dy|_{x=0} = \\frac{1}{2} dx. $$'
  },
  {
    id: 13,
    number: 13,
    question: '已知函数 $ f(x) $ 的导数 $ f\'(x) = \\frac{\\ln x}{x} $，求曲线 $ y = f(x) $ 在 $(0, +\\infty)$ 内的凹凸区间。',
    solution: '$$ f\'\'(x) = \\frac{\\frac{1}{x} \\cdot x - \\ln x}{x^2} = \\frac{1 - \\ln x}{x^2}, $$ 令 $$ f\'\'(x) = 0, $$ 解得 $$ x = e, $$ 当 $$ 0 < x < e $$ 时，$$ f\'\'(x) > 0; $$ 当 $$ x > e $$ 时，$$ f\'\'(x) < 0, $$ 故 $$ f(x) $$ 的凹区间为 $$ (0,e], $$ 凸区间为 $$ [e, +\\infty). $$'
  },
  {
    id: 14,
    number: 14,
    question: '求不定积分 $$ \\int (2x - 1)e^x dx $$。',
    solution: '$$ \\int (2x - 1)e^x dx = \\int (2x - 1)de^x = e^x (2x - 1) - \\int 2e^x dx $$ $$ = e^x (2x - 1) - 2e^x + C $$ $$ = (2x - 3)e^x + C. $$'
  },
  {
    id: 15,
    number: 15,
    question: '设函数 $ f(x) = \\begin{cases} \\frac{2x^3}{1+x^2}, & x \\leq 1, \\\\ 1, & x > 1, \\end{cases} $ 计算定积分 $\\int_{-1}^4 f(x) dx$.',
    solution: '$$ \\int_{-1}^{4} f(x) dx = \\int_{-1}^{1} f(x) dx + \\int_{1}^{4} f(x) dx = \\int_{-1}^{1} \\frac{2x^3}{1+x^2} dx + \\int_{1}^{4} dx, $$ 因为 $\\frac{2x^3}{1+x^2}$ 是 $[-1,1]$ 上的奇函数，则 $\\int_{-1}^{1} \\frac{2x^3}{1+x^2} dx = 0$, 故 $\\int_{-1}^{4} f(x) dx = \\int_{-1}^{1} \\frac{2x^3}{1+x^2} dx + \\int_{1}^{4} dx = 0 + x \\big|_{1}^{4} = 3$.'
  },
  {
    id: 16,
    number: 16,
    question: '设 $ z = \\ln 3 - x^2 e^{y^2 z} $，求 $\\frac{\\partial z}{\\partial x}$ 及 $\\frac{\\partial z}{\\partial y}$.',
    solution: '设 $ F(x,y,z) = \\ln3 - x^2 e^{y^2z} - z $，则 $ F_x = -2xe^{y^2z} $，$ F_y = -2x^2 yze^{y^2z} $，$ F_z = -x^2 y^2 e^{y^2z} - 1 $，故 $$ \\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z} = -\\frac{-2xe^{y^2z}}{-x^2 y^2 e^{y^2z} - 1} = -\\frac{2xe^{y^2z}}{x^2 y^2 e^{y^2z} + 1}, $$ $$ \\frac{\\partial z}{\\partial y} = -\\frac{F_y}{F_z} = -\\frac{-2x^2 yze^{y^2z}}{-x^2 y^2 e^{y^2z} - 1} = -\\frac{2x^2 yze^{y^2z}}{x^2 y^2 e^{y^2z} + 1}. $$'
  },
  {
    id: 17,
    number: 17,
    question: '计算二重积分 $\\iint_D (x^2 + y^2)^2 d\\sigma$，其中 $D$ 是由圆周 $x^2 + y^2 = 1$ 所围成的区域.',
    solution: '令 $ x = r \\cos \\theta, y = r \\sin \\theta $，积分区域在极坐标系下可表示为：$ 0 \\leq \\theta \\leq 2\\pi, 0 \\leq r \\leq 1 $，故 $$ \\iint_D (x^2 + y^2)^2 d\\sigma = \\int_0^{2\\pi} d\\theta \\int_0^1 r^4 \\cdot r dr = \\int_0^{2\\pi} d\\theta \\int_0^1 r^5 dr $$ $$ = \\theta \\bigg|_0^{2\\pi} \\cdot \\frac{1}{6} r^6 \\bigg|_0^1 = 2\\pi \\times \\frac{1}{6} = \\frac{\\pi}{3}. $$'
  },
  {
    id: 18,
    number: 18,
    question: '已知 $u_n$ 满足 $\\left(\\frac{1}{2}\\right)^n \\leq u_n \\leq \\frac{n^2}{2^n} (n = 1, 2, \\cdots)$，判定级数 $\\sum_{n=1}^{\\infty} u_n$ 的收敛性.',
    solution: '由 $ u_n \\geq \\left( \\frac{1}{2} \\right)^n $ 可知 $\\sum_{n=1}^\\infty u_n$ 为正项级数，记 $ v_n = \\frac{n^2}{2^n} $，又 $$ \\lim_{n \\to \\infty} \\frac{v_{n+1}}{v_n} = \\lim_{n \\to \\infty} \\frac{(n+1)^2 \\cdot 2^n}{2^{n+1} \\cdot n^2} = \\lim_{n \\to \\infty} \\frac{(n+1)^2}{2n^2} = \\frac{1}{2} < 1, $$ 由比值审敛法可知 $\\sum_{n=1}^\\infty \\frac{n^2}{2^n}$ 收敛，因为 $u_n \\leq \\frac{n^2}{2^n}$，则由正项级数的比较审敛法可知 $\\sum_{n=1}^\\infty u_n$ 收敛。'
  }
]

// 综合题答案
const comprehensiveAnswers = [
  {
    id: 19,
    number: 19,
    question: '证明：当 $ x > 0 $ 时，\n\n(1) $\\arctan x = \\frac{\\pi}{2} - \\arctan \\frac{1}{x}$；\n\n(2) $\\arctan x < \\ln(x + \\sqrt{1 + x^2})$。',
    solution: '(1) 设 $ f(x) = \\arctan x + \\arctan \\frac{1}{x} - \\frac{\\pi}{2} $, $$ f\'(x) = \\frac{1}{1+x^2} + \\frac{1}{1+\\frac{1}{x^2}} \\cdot \\left( -\\frac{1}{x^2} \\right) - 0 = \\frac{1}{1+x^2} - \\frac{1}{1+x^2} = 0, $$ 则 $ f(x) $ 在 $(0, +\\infty)$ 内是一个常数，令 $ x=1 $，得 $ f(1) = \\frac{\\pi}{4} + \\frac{\\pi}{4} - \\frac{\\pi}{2} = 0 $，即 $ f(x) = 0 $, 故当 $ x > 0 $ 时，$\\arctan x = \\frac{\\pi}{2} - \\arctan \\frac{1}{x}$;\n\n(2) 设 $ g(x) = \\ln(x + \\sqrt{1 + x^2}) - \\arctan x, x \\geq 0 $，则 $$ g\'(x) = \\frac{1}{x + \\sqrt{1 + x^2}} \\cdot (x + \\sqrt{1 + x^2})\' - \\frac{1}{1 + x^2} $$ $$ = \\frac{1}{x + \\sqrt{1 + x^2}} \\cdot \\left(1 + \\frac{x}{\\sqrt{1 + x^2}}\\right) - \\frac{1}{1 + x^2} $$ $$ = \\frac{1}{x + \\sqrt{1 + x^2}} \\cdot \\frac{x + \\sqrt{1 + x^2}}{\\sqrt{1 + x^2}} - \\frac{1}{1 + x^2} = \\frac{\\sqrt{1 + x^2} - 1}{1 + x^2}, $$ 当 $ x > 0 $ 时，$ g\'(x) > 0 $，则 $ g(x) $ 是 $[0, +\\infty)$ 上的单调递增函数，故当 $ x > 0 $ 时，$ g(x) > g(0) = 0 $，即 $\\arctan x < \\ln(x + \\sqrt{1 + x^2})$。'
  },
  {
    id: 20,
    number: 20,
    question: '设定义在区间 $[0, +\\infty)$ 上的连续函数 $ f(x) $ 满足 $ f(x) \\geq \\sqrt{1 + x^4} $，且由曲线 $ y = f(x) $, $ y = \\sqrt{1 + x^4} $ 及直线 $ x = 0 $, $ x = t(t > 0) $ 围成的图形的面积为 $ t^3 $。\n\n(1) 求 $ f(x) $；\n\n(2) 若可导函数 $ g(x) $ 满足 $ f(x)g\'(x) + f\'(x)g(x) = 5x\\sqrt{x} $，且 $ g(0) = 1 $，求 $ g(x) $。',
    solution: '(1) 由题意可知 $$ \\int_{0}^{t} [f(x) - \\sqrt{1 + x^4}] dx = t^3, $$ 等式两边对 $ t $ 求导得 $$ f(t) - \\sqrt{1 + t^4} = 3t^2, $$ 则 $$ f(t) = 3t^2 + \\sqrt{1 + t^4}, $$ 即 $$ f(x) = 3x^2 + \\sqrt{1 + x^4}; $$\n\n(2) 由 $ f(x)g\'(x) + f\'(x)g(x) = 5x\\sqrt{x} $ 知 $$ [f(x)g(x)]\' = 5x\\sqrt{x}, $$ 故 $$ f(x)g(x) = \\int 5x\\sqrt{x} dx, $$ 得 $$ f(x)g(x) = 2x^{\\frac{5}{2}} + C, $$ 则 $$ g(x) = \\frac{2x^{\\frac{5}{2}} + C}{3x^2 + \\sqrt{1 + x^4}} = \\frac{2x^2\\sqrt{x} + C}{3x^2 + \\sqrt{1 + x^4}}. $$ 又 $ g(0) = 1 $，解得 $ C = 1 $，故 $$ g(x) = \\frac{2x^2\\sqrt{x} + 1}{3x^2 + \\sqrt{1 + x^4}}. $$'
  }
]
</script>

<style scoped>
.exam-answer-page {
  background-color: white;
}

.paper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 30px;
}

.paper-header h2 {
  margin: 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.section {
  margin-bottom: 50px;
}

.section-title {
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 25px;
  line-height: 1.6;
}

.answer-item {
  display: flex;
  margin-bottom: 30px;
  background-color: white;
}

.question-number {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-right: 8px;
  min-width: 20px;
}

.answer-content {
  flex: 1;
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
}

.options {
  margin-top: 12px;
  padding-left: 10px;
}

.option {
  display: flex;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.option-letter {
  font-weight: 600;
  color: #606266;
  margin-right: 10px;
  min-width: 25px;
}

.answer-box {
  margin-top: 15px;
  padding: 15px;
  background-color: #f0f9ff;
  border-left: 4px solid #67c23a;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.solution-box {
  margin-top: 15px;
  padding: 20px;
  background-color: #f5f7fa;
  border-left: 4px solid #409eff;
  border-radius: 4px;
}

.solution-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 15px;
  font-size: 16px;
}

.el-divider {
  margin: 40px 0;
  border-color: #e4e7ed;
}

:deep(.el-card__body) {
  background-color: white;
}

/* 响应式 */
@media (max-width: 768px) {
  .paper-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .paper-header h2 {
    font-size: 20px;
  }

  .answer-item {
    flex-direction: column;
  }

  .question-number {
    margin-bottom: 8px;
  }
}
</style>

