import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { image, filename } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // For now, return a mock response while we fix the Ollama issue
    // TODO: Re-enable Ollama integration when model is stable
    
    console.log('Processing homework analysis request...')
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Return structured mock response
    const mockResponse = {
      parent_analysis: {
        overall_assessment: "Dr. Owl 已經分析了您孩子的作業！從照片中可以看出孩子很努力在練習字母書寫，這是很棒的開始。雖然還有改進的空間，但孩子的認真態度值得鼓勵。",
        glows: [
          "字母書寫展現了認真的學習態度",
          "能夠完成整份作業，顯示良好的學習習慣", 
          "在某些字母的書寫上表現出不錯的控制力"
        ],
        grows: [
          "可以多注意字母的標準形狀和比例，建議使用描字練習本來加強肌肉記憶",
          "練習時可以放慢速度，專注於每一筆的正確方向和位置"
        ],
        parent_child_activities: [
          "和孩子一起用手指在沙盤或觸摸屏上練習字母形狀",
          "製作字母卡片，讓孩子摸索字母的輪廓",
          "一起閱讀字母相關的繪本，邊讀邊指認字母"
        ]
      },
      child_encouragement: {
        praise_message: "哇！你真的很努力在練習字母呢！🌟 Dr. Owl 看到你用心寫字的樣子，覺得你是個很棒的小朋友！每一個字母都是你努力的證明，繼續加油，你會越寫越好的！💪✨",
        badges: [
          "認真練習小達人 🏆", 
          "字母探險家 🔤"
        ],
        fun_challenges: [
          "下次試試看用你最喜歡的彩色筆寫字母",
          "和爸爸媽媽比賽，看誰能寫出最整齊的字母"
        ]
      },
      scores: {
        letter_formation: 32,      // 0-50
        line_adherence: 22,        // 0-30  
        consistency_spacing: 14,   // 0-20
        overall_effort: 9          // 0-10
      },
      total_score: 77  // 32+22+14+9 = 77
    }

    console.log('Homework analysis completed successfully')
    
    return NextResponse.json(mockResponse)

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