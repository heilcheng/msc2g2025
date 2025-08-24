// Comprehensive mock student data for NGO Admin Dashboard
// Based on real Hong Kong kindergartens and realistic student demographics

export interface Student {
  id: string
  name: string
  age: number
  region: string
  kindergarten: string
  grade: string
  enrollmentDate: string
  totalAttempts: number
  correctAttempts: number
  averageAttemptTime: number
  overallScore: number
  subjects: {
    alphabet: { score: number; attempts: number; avgTime: number }
    sightWords: { score: number; attempts: number; avgTime: number }
    vocabulary: { score: number; attempts: number; avgTime: number }
    phonics: { score: number; attempts: number; avgTime: number }
  }
  weeklyProgress: Array<{ week: string; score: number }>
  lastActive: string
  streakDays: number
  totalTimeSpent: number
  parentName: string
  parentEmail: string
  parentPhone: string
  status: 'active' | 'inactive'
}

// Real Hong Kong Kindergartens by Region
const HONG_KONG_KINDERGARTENS = {
  "Central Hong Kong": [
    "St. Paul's Co-educational College Primary School",
    "Diocesan Girls' Junior School",
    "Peak School",
    "Kennedy School",
    "Hong Kong International School",
    "German Swiss International School",
    "Carmel School (Elsa High Memorial)",
    "Kowloon Junior School",
    "Chinese International School",
    "Island School ESF"
  ],
  "Kowloon East": [
    "Kowloon Tong School (Primary Section)",
    "La Salle Primary School",
    "Maryknoll Convent School (Primary Section)",
    "St. Rose of Lima's School",
    "Baptist Lui Ming Choi Primary School",
    "Kowloon Tong Bishop Walsh Catholic School",
    "Alliance Primary School, Kowloon Tong",
    "Christian Alliance International School",
    "Kornhill International Kindergarten",
    "Hong Kong Academy"
  ],
  "Kowloon West": [
    "Diocesan Boys' School Primary Division",
    "St. Mary's Canossian School",
    "Yaumati Catholic Primary School (Hoi Wang Road)",
    "Good Hope Primary School",
    "Marymount Primary School",
    "Sacred Heart Canossian School",
    "St. Francis Xavier's School",
    "Rosaryhill School (Primary Section)",
    "Australian International School Hong Kong",
    "Canadian International School of Hong Kong"
  ],
  "New Territories": [
    "Sha Tin College",
    "Po Leung Kuk Camões Tan Siu Lin Primary School",
    "Tai Po Old Market Public School",
    "Buddhist Chi King Primary School",
    "SKH Holy Trinity Primary School",
    "TWGHs Sun Hoi Directors' Primary School",
    "HKFYG Lee Shau Kee Primary School",
    "Discovery Bay International School",
    "Hong Kong Japanese School",
    "Harrow International School Hong Kong"
  ]
}

// Common Chinese and English names in Hong Kong
const HONG_KONG_NAMES = {
  boys: [
    "Lucas Wong", "Ryan Kumar", "Ethan Chen", "Leo Li", "Max Zhang", 
    "Alex Tam", "Daniel Wu", "Kevin Cheng", "Marcus Lau", "Jason Ho",
    "Eric Tang", "Andy Leung", "Sam Ng", "Tony Chan", "Peter Yip",
    "Aaron Lam", "Brian Ma", "Chris Fung", "David Liu", "Felix Yeung",
    "Gary Choi", "Henry Kwok", "Ivan Tse", "Jack Siu", "Ken Mak",
    "Liam Hui", "Mike Yuen", "Noah Chu", "Oscar Poon", "Paul Kwan",
    "Quincy Lok", "Ricky Shum", "Sean Woo", "Tim Yam", "Victor Tsui",
    "William To", "Xavier Luk", "Yuki Cheung", "Zac Ip", "Adam Fong",
    "Ben Suen", "Colin Law", "Derek Tong", "Eddie Wan", "Frank Lai",
    "George Chow", "Hugo Tsang", "Ian Mok", "Jerry Yiu", "Keith Sze"
  ],
  girls: [
    "Emma Chen", "Sophia Li", "Zoe Tam", "Maya Patel", "Aria Zhang",
    "Chloe Wong", "Grace Lau", "Olivia Wu", "Emily Ho", "Sarah Cheng",
    "Mia Tang", "Lily Leung", "Ruby Ng", "Ella Chan", "Anna Yip",
    "Eva Lam", "Iris Ma", "Joy Fung", "Kate Liu", "Luna Yeung",
    "Nina Choi", "Ava Kwok", "Bella Tse", "Cara Siu", "Dora Mak",
    "Faye Hui", "Gina Yuen", "Hana Chu", "Ivy Poon", "Jane Kwan",
    "Kira Lok", "Lisa Shum", "Mona Woo", "Nora Yam", "Opal Tsui",
    "Penny To", "Quinn Luk", "Rosa Cheung", "Stella Ip", "Tina Fong",
    "Uma Suen", "Vera Law", "Wendy Tong", "Xara Wan", "Yara Lai",
    "Zara Chow", "Alice Tsang", "Bree Mok", "Cora Yiu", "Dana Sze"
  ]
}

// Simple seeded random number generator for consistent data
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate realistic performance data
function generatePerformanceData(seed: number = 1) {
  const baseScore = 60 + seededRandom(seed * 1.1) * 35 // Score between 60-95
  const variation = 5 + seededRandom(seed * 1.2) * 10 // Variation between subjects
  
  return {
    alphabet: {
      score: Math.round(Math.max(50, Math.min(100, baseScore + (seededRandom(seed * 1.3) - 0.5) * variation))),
      attempts: Math.round(20 + seededRandom(seed * 1.4) * 40),
      avgTime: Math.round(30 + seededRandom(seed * 1.5) * 30)
    },
    sightWords: {
      score: Math.round(Math.max(50, Math.min(100, baseScore + (seededRandom(seed * 1.6) - 0.5) * variation))),
      attempts: Math.round(20 + seededRandom(seed * 1.7) * 40),
      avgTime: Math.round(35 + seededRandom(seed * 1.8) * 35)
    },
    vocabulary: {
      score: Math.round(Math.max(50, Math.min(100, baseScore + (seededRandom(seed * 1.9) - 0.5) * variation))),
      attempts: Math.round(15 + seededRandom(seed * 2.0) * 35),
      avgTime: Math.round(25 + seededRandom(seed * 2.1) * 25)
    },
    phonics: {
      score: Math.round(Math.max(50, Math.min(100, baseScore + (seededRandom(seed * 2.2) - 0.5) * variation))),
      attempts: Math.round(15 + seededRandom(seed * 2.3) * 35),
      avgTime: Math.round(40 + seededRandom(seed * 2.4) * 40)
    }
  }
}

// Generate weekly progress (4 weeks of data)
function generateWeeklyProgress(baseScore: number, seed: number = 1) {
  const startScore = Math.max(40, baseScore - 15 - seededRandom(seed * 3.1) * 10)
  return [
    { week: "Week 1", score: Math.round(startScore) },
    { week: "Week 2", score: Math.round(startScore + 2 + seededRandom(seed * 3.2) * 6) },
    { week: "Week 3", score: Math.round(startScore + 5 + seededRandom(seed * 3.3) * 8) },
    { week: "Week 4", score: Math.round(Math.min(100, startScore + 8 + seededRandom(seed * 3.4) * 12)) }
  ]
}

// Generate mock student data
function generateMockStudents(count: number): Student[] {
  const students: Student[] = []
  const regions = Object.keys(HONG_KONG_KINDERGARTENS)
  const allNames = [...HONG_KONG_NAMES.boys, ...HONG_KONG_NAMES.girls]
  
  for (let i = 0; i < count; i++) {
    const seed = i + 1 // Use index as seed for deterministic generation
    const region = regions[Math.floor(seededRandom(seed * 4.1) * regions.length)]
    const kindergartens = HONG_KONG_KINDERGARTENS[region as keyof typeof HONG_KONG_KINDERGARTENS]
    const kindergarten = kindergartens[Math.floor(seededRandom(seed * 4.2) * kindergartens.length)]
    const name = allNames[Math.floor(seededRandom(seed * 4.3) * allNames.length)]
    const age = 4 + Math.floor(seededRandom(seed * 4.4) * 3) // Age 4-6
    const grade = age === 4 ? "K1" : age === 5 ? "K2" : "K3"
    
    const subjects = generatePerformanceData(seed)
    const overallScore = Math.round(
      (subjects.alphabet.score + subjects.sightWords.score + 
       subjects.vocabulary.score + subjects.phonics.score) / 4
    )
    const totalAttempts = subjects.alphabet.attempts + subjects.sightWords.attempts + 
                         subjects.vocabulary.attempts + subjects.phonics.attempts
    const correctAttempts = Math.round(totalAttempts * (overallScore / 100))
    const averageAttemptTime = Math.round(
      (subjects.alphabet.avgTime + subjects.sightWords.avgTime + 
       subjects.vocabulary.avgTime + subjects.phonics.avgTime) / 4
    )
    
    // Generate enrollment date (within last 6 months)
    const enrollmentDate = new Date()
    enrollmentDate.setDate(enrollmentDate.getDate() - Math.floor(seededRandom(seed * 5.1) * 180))
    
    // Generate last active (within last week for most students)
    const lastActive = new Date()
    const activeWeight = seededRandom(seed * 5.2)
    if (activeWeight > 0.8) {
      // 20% haven't been active in 2-7 days
      lastActive.setDate(lastActive.getDate() - (2 + Math.floor(seededRandom(seed * 5.3) * 5)))
    } else {
      // 80% active within last 2 days
      lastActive.setHours(lastActive.getHours() - Math.floor(seededRandom(seed * 5.4) * 48))
    }
    
    const parentSurname = name.split(' ')[1] || name.split(' ')[0]
    const parentFirstNames = ["Michael", "Sarah", "David", "Lisa", "James", "Amy", "Peter", "Grace", "Tony", "Mary"]
    const parentFirstName = parentFirstNames[Math.floor(seededRandom(seed * 5.5) * parentFirstNames.length)]
    
    students.push({
      id: `STU${String(i + 1).padStart(3, '0')}`,
      name,
      age,
      region,
      kindergarten,
      grade,
      enrollmentDate: enrollmentDate.toISOString().split('T')[0],
      totalAttempts,
      correctAttempts,
      averageAttemptTime,
      overallScore,
      subjects,
      weeklyProgress: generateWeeklyProgress(overallScore, seed),
      lastActive: lastActive.toISOString(),
      streakDays: Math.floor(seededRandom(seed * 5.6) * 20),
      totalTimeSpent: Math.round(500 + seededRandom(seed * 5.7) * 3000), // 500-3500 minutes
      parentName: `${parentFirstName} ${parentSurname}`,
      parentEmail: `${parentFirstName.toLowerCase()}.${parentSurname.toLowerCase()}@email.com`,
      parentPhone: `+852 ${Math.floor(seededRandom(seed * 5.8) * 9) + 1}${Math.floor(seededRandom(seed * 5.9) * 900) + 100} ${Math.floor(seededRandom(seed * 6.0) * 9000) + 1000}`,
      status: seededRandom(seed * 6.1) > 0.1 ? 'active' : 'inactive' // 90% active
    })
  }
  
  return students
}

// Generate the full student database
export const MOCK_STUDENTS = generateMockStudents(600)

// Calculate aggregate statistics
export const AGGREGATE_STATS = {
  totalStudents: MOCK_STUDENTS.length,
  averageScore: Math.round(
    MOCK_STUDENTS.reduce((sum, student) => sum + student.overallScore, 0) / MOCK_STUDENTS.length
  ),
  totalAttempts: MOCK_STUDENTS.reduce((sum, student) => sum + student.totalAttempts, 0),
  averageTimePerAttempt: Math.round(
    MOCK_STUDENTS.reduce((sum, student) => sum + student.averageAttemptTime, 0) / MOCK_STUDENTS.length
  ),
  activeToday: MOCK_STUDENTS.filter(s => 
    new Date(s.lastActive) > new Date(Date.now() - 24*60*60*1000)
  ).length,
  activeThisWeek: MOCK_STUDENTS.filter(s => 
    new Date(s.lastActive) > new Date(Date.now() - 7*24*60*60*1000)
  ).length
}

// Regional statistics
export const REGIONAL_STATS = Object.keys(HONG_KONG_KINDERGARTENS).map(region => {
  const regionStudents = MOCK_STUDENTS.filter(s => s.region === region)
  return {
    region,
    avgScore: Math.round(
      regionStudents.reduce((sum, s) => sum + s.overallScore, 0) / regionStudents.length
    ),
    students: regionStudents.length,
    totalAttempts: regionStudents.reduce((sum, s) => sum + s.totalAttempts, 0),
    avgTimeSpent: Math.round(
      regionStudents.reduce((sum, s) => sum + s.totalTimeSpent, 0) / regionStudents.length
    )
  }
})

// Age group statistics
export const AGE_GROUP_STATS = [4, 5, 6].map(age => {
  const ageStudents = MOCK_STUDENTS.filter(s => s.age === age)
  return {
    age: `${age} years`,
    avgScore: Math.round(
      ageStudents.reduce((sum, s) => sum + s.overallScore, 0) / ageStudents.length
    ),
    students: ageStudents.length,
    color: age === 4 ? "#10B981" : age === 5 ? "#3B82F6" : "#F59E0B"
  }
})

// Subject performance across all students
export const SUBJECT_PERFORMANCE = [
  {
    subject: "Alphabet",
    avgScore: Math.round(
      MOCK_STUDENTS.reduce((sum, s) => sum + s.subjects.alphabet.score, 0) / MOCK_STUDENTS.length * 10
    ) / 10,
    totalAttempts: MOCK_STUDENTS.reduce((sum, s) => sum + s.subjects.alphabet.attempts, 0),
    avgTime: Math.round(
      MOCK_STUDENTS.reduce((sum, s) => sum + s.subjects.alphabet.avgTime, 0) / MOCK_STUDENTS.length * 10
    ) / 10
  },
  {
    subject: "Sight Words",
    avgScore: Math.round(
      MOCK_STUDENTS.reduce((sum, s) => sum + s.subjects.sightWords.score, 0) / MOCK_STUDENTS.length * 10
    ) / 10,
    totalAttempts: MOCK_STUDENTS.reduce((sum, s) => sum + s.subjects.sightWords.attempts, 0),
    avgTime: Math.round(
      MOCK_STUDENTS.reduce((sum, s) => sum + s.subjects.sightWords.avgTime, 0) / MOCK_STUDENTS.length * 10
    ) / 10
  },
  {
    subject: "Vocabulary", 
    avgScore: Math.round(
      MOCK_STUDENTS.reduce((sum, s) => sum + s.subjects.vocabulary.score, 0) / MOCK_STUDENTS.length * 10
    ) / 10,
    totalAttempts: MOCK_STUDENTS.reduce((sum, s) => sum + s.subjects.vocabulary.attempts, 0),
    avgTime: Math.round(
      MOCK_STUDENTS.reduce((sum, s) => sum + s.subjects.vocabulary.avgTime, 0) / MOCK_STUDENTS.length * 10
    ) / 10
  },
  {
    subject: "Phonics",
    avgScore: Math.round(
      MOCK_STUDENTS.reduce((sum, s) => sum + s.subjects.phonics.score, 0) / MOCK_STUDENTS.length * 10
    ) / 10,
    totalAttempts: MOCK_STUDENTS.reduce((sum, s) => sum + s.subjects.phonics.attempts, 0),
    avgTime: Math.round(
      MOCK_STUDENTS.reduce((sum, s) => sum + s.subjects.phonics.avgTime, 0) / MOCK_STUDENTS.length * 10
    ) / 10
  }
]

// Weekly trend data
export const WEEKLY_TREND = ["Week 1", "Week 2", "Week 3", "Week 4"].map(week => {
  const weekScores = MOCK_STUDENTS.map(s => 
    s.weeklyProgress.find(w => w.week === week)?.score || 0
  )
  return {
    week,
    avgScore: Math.round(
      weekScores.reduce((sum, score) => sum + score, 0) / weekScores.length * 10
    ) / 10,
    totalAttempts: Math.round(seededRandom(week === "Week 1" ? 7.1 : week === "Week 2" ? 7.2 : week === "Week 3" ? 7.3 : 7.4) * 500 + 1000) // Simulated
  }
})

// Get students by page for pagination
export function getStudentsByPage(page: number = 1, pageSize: number = 50) {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  return {
    students: MOCK_STUDENTS.slice(startIndex, endIndex),
    totalPages: Math.ceil(MOCK_STUDENTS.length / pageSize),
    currentPage: page,
    totalStudents: MOCK_STUDENTS.length
  }
}

// Search students by name, region, or kindergarten
export function searchStudents(query: string) {
  const lowercaseQuery = query.toLowerCase()
  return MOCK_STUDENTS.filter(student => 
    student.name.toLowerCase().includes(lowercaseQuery) ||
    student.region.toLowerCase().includes(lowercaseQuery) ||
    student.kindergarten.toLowerCase().includes(lowercaseQuery) ||
    student.grade.toLowerCase().includes(lowercaseQuery)
  )
}

// Get student by ID
export function getStudentById(id: string) {
  return MOCK_STUDENTS.find(student => student.id === id)
}
