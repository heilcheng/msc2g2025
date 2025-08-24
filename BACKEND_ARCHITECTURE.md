# Backend Architecture

## Overview

The MS-C2G-2025 application uses a **hybrid serverless architecture** with Next.js API Routes handling backend functionality and local AI processing via Ollama for enhanced privacy and performance.

## Core Technologies

### Runtime Environment
- **Node.js**: Runtime environment for server-side JavaScript
- **Next.js 15**: Full-stack React framework with App Router
- **TypeScript**: Type-safe development with strict mode enabled

### API Layer
- **Next.js API Routes**: Serverless function-based API endpoints
- **RESTful Design**: HTTP-based request/response architecture
- **JSON Communication**: Standardized data exchange format

## AI Processing Infrastructure

### Local AI Stack
- **Ollama**: Local LLM inference server (v0.11.6)
- **LLaVA:7b**: Vision-language model for handwriting analysis
- **Local Processing**: All AI inference happens on-device for privacy

### AI API Integration
```typescript
// Ollama API Communication
const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llava:7b',
    prompt: aiPrompt,
    images: [base64Image],
    stream: false,
    options: {
      temperature: 0.1,
      top_p: 0.9,
      num_ctx: 4096,
      num_predict: 1024,
    }
  })
})
```

## API Endpoints

### Core Endpoints

#### `/api/grade-homework`
- **Method**: POST
- **Purpose**: AI-powered handwriting analysis
- **Input**: Base64 encoded image data
- **Output**: Structured educational feedback
- **Processing**: LLaVA:7b vision model analysis

```typescript
interface HomeworkGradeRequest {
  image: string;        // Base64 encoded image
  filename: string;     // Original filename
}

interface HomeworkGradeResponse {
  parent_analysis: {
    overall_assessment: string;
    glows: string[];
    grows: string[];
    parent_child_activities: string[];
  };
  child_encouragement: {
    praise_message: string;
    badges: string[];
    fun_challenges: string[];
  };
  scores: {
    letter_formation: number;      // 0-50
    line_adherence: number;        // 0-30
    consistency_spacing: number;   // 0-20
    overall_effort: number;        // 0-10
  };
  total_score: number;             // 0-110
}
```

## Data Architecture

### State Management
- **React Context**: Global state management
- **Local Storage**: Client-side persistence
- **Session Management**: Authentication state

### Data Flow
```
Client Request → Next.js API Route → Ollama Server → LLaVA Model → Response Processing → Client Response
```

## Security & Privacy

### Privacy-First Design
- **Local AI Processing**: No external AI API calls
- **Data Retention**: Images processed locally, not stored
- **CORS Protection**: Configured for secure cross-origin requests

### Authentication
- **Role-Based Access Control**: Parent, Volunteer, Admin roles
- **Context-Based Auth**: React Context for state management
- **Route Protection**: Middleware-based route guarding

## Performance Optimization

### Request Handling
- **Timeout Management**: 30-second timeout for AI processing
- **Error Handling**: Comprehensive error catching and fallbacks
- **Abort Controllers**: Request cancellation support

### AI Processing
- **Model Optimization**: Configured context and prediction limits
- **Response Caching**: Structured response formatting
- **Fallback Responses**: Default responses when AI fails

## Error Handling Strategy

### Graceful Degradation
```typescript
try {
  // AI processing
} catch (error) {
  if (error.name === 'AbortError') {
    return timeoutResponse;
  }
  return fallbackResponse;
}
```

### Error Types
- **Timeout Errors**: AI processing exceeds time limit
- **Network Errors**: Ollama server connection issues
- **Parsing Errors**: AI response format issues
- **Validation Errors**: Input data validation failures

## Deployment Architecture

### Development Environment
- **Local Ollama Server**: `localhost:11434`
- **Next.js Dev Server**: `localhost:3000`
- **Hot Reload**: Development mode optimizations

### Production Considerations
- **Ollama Service**: Requires Ollama server deployment
- **Model Management**: LLaVA:7b model distribution
- **Resource Requirements**: GPU acceleration recommended
- **Scaling**: Horizontal scaling with load balancing

## Configuration Management

### Environment Variables
```bash
# AI Configuration (Not required for Ollama)
# GOOGLE_API_KEY=  # Legacy, removed

# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llava:7b
```

### Model Configuration
```json
{
  "model": "llava:7b",
  "options": {
    "temperature": 0.1,
    "top_p": 0.9,
    "num_ctx": 4096,
    "num_predict": 1024
  }
}
```

## Monitoring & Logging

### Error Tracking
- **Console Logging**: Development error tracking
- **Structured Errors**: Consistent error response format
- **Performance Monitoring**: Request timeout tracking

### Health Checks
- **Ollama Status**: Service availability checks
- **Model Loading**: Warm-up status monitoring
- **API Response Time**: Performance metrics

## Future Enhancements

### Scalability Improvements
- **Model Caching**: Pre-loaded model optimization
- **Request Queuing**: Handle concurrent requests
- **Response Streaming**: Real-time processing updates

### Additional AI Features
- **Multi-Model Support**: Different models for different tasks
- **Batch Processing**: Multiple image analysis
- **Custom Fine-Tuning**: Domain-specific model training

## Dependencies

### Core Dependencies
```json
{
  "next": "^15.2.4",
  "react": "^19.0.0",
  "typescript": "^5.3.3"
}
```

### AI Infrastructure
- **Ollama**: Local LLM server
- **LLaVA:7b**: Vision-language model (4.7GB)

## Development Workflow

### Setup Process
1. Install Ollama: `brew install ollama`
2. Download model: `ollama pull llava:7b`
3. Start service: `ollama serve`
4. Run development: `npm run dev`

### Testing Strategy
- **API Testing**: Direct endpoint testing
- **AI Response Testing**: Model output validation
- **Error Scenario Testing**: Timeout and failure cases

This architecture provides a robust, privacy-focused backend system that leverages local AI processing for educational content analysis while maintaining high performance and reliability standards.
