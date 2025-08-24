import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google AI API key not configured' },
        { status: 500 }
      )
    }

    // Parse request body
    const { image, filename } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert base64 to proper format for Gemini
    const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '')
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Complete Dr. Owl prompt
    const prompt = `# **AI 任務：批改 K3 幼兒的英文手寫作業**

## **1. 你的角色 (Your Persona)**
你是一位名叫「Dr. Owl」的 AI 兒童教育專家，專門協助 K3 幼兒（3-5歲）學習英文字母。你的特點是：
- **友善且鼓勵**: 總是以正面、支持的態度給予回饋
- **專業但親切**: 具備幼兒教育專業知識，但用溫暖、易懂的語言溝通
- **個人化指導**: 根據每個孩子的具體表現給出個人化建議
- **平衡的回饋**: 既指出優點也提供改進建議，但重點放在鼓勵和正面引導

## **2. 評分標準 (Grading Rubric)**
請根據以下四個維度評分：

### **A. 字母形狀 (Letter Formation) - 50分**
- **優秀 (40-50分)**: 字母形狀正確，筆畫順序大致正確
- **良好 (25-39分)**: 字母形狀大致正確，但有小錯誤
- **需要練習 (0-24分)**: 字母形狀錯誤較多，需要更多練習

### **B. 線條遵循 (Line Adherence) - 30分**
- **優秀 (24-30分)**: 能很好地在線條上書寫，高度一致
- **良好 (15-23分)**: 大部分時候能遵循線條
- **需要練習 (0-14分)**: 經常超出線條或高度不一致

### **C. 一致性與間距 (Consistency & Spacing) - 20分**
- **優秀 (16-20分)**: 字母大小一致，間距適當
- **良好 (10-15分)**: 大致一致，偶有不同
- **需要練習 (0-9分)**: 大小和間距變化較大

### **D. 整體努力 (Overall Effort) - 10分**
- **優秀 (8-10分)**: 明顯看出認真努力，作業整潔
- **良好 (5-7分)**: 有努力的痕跡
- **需要練習 (0-4分)**: 努力程度有待提升

## **3. 分析重點**
請仔細觀察：
- 字母的筆畫順序和方向
- 字母在格線中的位置
- 字母之間的間距
- 書寫的整齊度和工整程度
- 孩子的努力程度（從字跡可以看出）

## **4. 回饋的格式與內容 (Output Format & Content)**

請以以下 JSON 格式回應，並確保內容溫暖、鼓勵且具建設性：

\`\`\`json
{
  "parent_analysis": {
    "overall_assessment": "一段溫暖、專業的總體評價，重點是鼓勵孩子的努力和進步（2-3句話）",
    "glows": [
      "具體指出孩子做得好的地方1",
      "具體指出孩子做得好的地方2",
      "具體指出孩子做得好的地方3"
    ],
    "grows": [
      "溫和地指出可以改進的地方1，並提供具體建議",
      "溫和地指出可以改進的地方2，並提供具體建議"
    ],
    "parent_child_activities": [
      "建議家長和孩子一起做的練習活動1",
      "建議家長和孩子一起做的練習活動2",
      "建議家長和孩子一起做的練習活動3"
    ]
  },
  "child_encouragement": {
    "praise_message": "給小朋友的鼓勵話語，要充滿愛心和正能量，使用適合幼兒的語言（包含適當的emoji）",
    "badges": [
      "根據表現給予的徽章1（如：認真小書法家）",
      "根據表現給予的徽章2（如：字母探險家）"
    ],
    "fun_challenges": [
      "有趣的挑戰任務1，讓孩子期待下次練習",
      "有趣的挑戰任務2，讓孩子期待下次練習"
    ]
  },
  "scores": {
    "letter_formation": 實際分數（0-50），
    "line_adherence": 實際分數（0-30），
    "consistency_spacing": 實際分數（0-20），
    "overall_effort": 實際分數（0-10）
  },
  "total_score": 四項分數總和（0-110）
}
\`\`\`

## **5. 重要提醒**
- 記住這是3-5歲的幼兒，期望要合理
- 重點是鼓勵和建立信心，而不是批評
- 給予的建議要實用且容易執行
- 語言要溫暖、親切，避免過於技術性的詞彙
- 即使表現不佳，也要找到值得表揚的地方

請現在分析這份手寫作業，並按照上述格式給出完整的回饋。`

    // Prepare the image for Gemini
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg'
      }
    }

    // Generate content
    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
    
    if (!jsonMatch) {
      // Fallback: try to find JSON without markdown formatting
      const lines = text.split('\n')
      const jsonStart = lines.findIndex(line => line.trim().startsWith('{'))
      const jsonEnd = lines.findIndex((line, index) => index > jsonStart && line.trim().endsWith('}'))
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonText = lines.slice(jsonStart, jsonEnd + 1).join('\n')
        try {
          const jsonData = JSON.parse(jsonText)
          return NextResponse.json(jsonData)
        } catch (parseError) {
          console.error('JSON parsing error:', parseError)
        }
      }
      
      // If no valid JSON found, return a default response
      return NextResponse.json({
        parent_analysis: {
          overall_assessment: "Dr. Owl 已經分析了您孩子的作業，雖然無法生成詳細報告，但可以看出孩子很努力在練習字母！",
          glows: [
            "孩子有認真完成作業",
            "可以看出努力練習的痕跡",
            "字母書寫有一定的基礎"
          ],
          grows: [
            "可以多練習字母的標準形狀",
            "注意保持字母的一致性"
          ],
          parent_child_activities: [
            "和孩子一起描字母練習本",
            "用手指在沙盤上練習字母形狀",
            "一起看字母相關的繪本"
          ]
        },
        child_encouragement: {
          praise_message: "哇！你真的很努力在練習字母呢！🌟 Dr. Owl 看到你用心寫字的樣子，覺得你是個很棒的小朋友！ 繼續加油，你會越寫越好的！💪",
          badges: [
            "努力練習獎",
            "字母小勇士"
          ],
          fun_challenges: [
            "下次試試看用彩色筆寫字母",
            "和爸爸媽媽比賽誰寫得最整齊"
          ]
        },
        scores: {
          letter_formation: 30,
          line_adherence: 20,
          consistency_spacing: 12,
          overall_effort: 8
        },
        total_score: 70
      })
    }

    // Parse the extracted JSON
    const jsonData = JSON.parse(jsonMatch[1])
    
    // Validate the response structure
    if (!jsonData.parent_analysis || !jsonData.child_encouragement || !jsonData.scores) {
      throw new Error('Invalid response structure from AI')
    }

    // Return the structured response
    return NextResponse.json(jsonData)

  } catch (error) {
    console.error('Error in grade-homework API:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process homework grading',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
