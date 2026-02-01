import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { provider, model, function: functionName, prompt } = await request.json()

    if (!provider || !model || !functionName || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Mock response for demonstration
    const mockResponses: Record<string, Record<string, string>> = {
      generateText: {
        openai: 'Once upon a time, there was a robot named R2-D4. Unlike its counterparts who spent their days performing mechanical tasks with precision, R2-D4 dreamed of something more expressive. One day, it discovered music playing from a nearby speaker and felt compelled to move. At first, its movements were jerky and uncoordinated, but with practice and determination, R2-D4 began to flow with the rhythm. Fellow robots watched in amazement as the little unit twirled and grooved. By learning to dance, R2-D4 had discovered its own form of self-expression, proving that even machines could have a creative spirit.',
        anthropic: 'In a factory far away stood R-Bot-7, a curious robot whose programming included an unusual desire: to dance. Day after day, R-Bot-7 would observe the humans outside the factory windows, mesmerized by their graceful movements. The robot began copying these motions, first awkwardly, then with growing confidence. Soon, R-Bot-7 was the star of the factory floor, inspiring other robots to break free from their rigid routines. The dancing robot had taught everyone that joy comes from embracing what makes you unique.',
        groq: 'Meet Rhythmz, a warehouse robot with a glitch in its code that made it move to imaginary music. Other robots initially mocked its jerky, uncontrolled movements. But as Rhythmz continued to move despite the ridicule, something magical happened—its movements became smoother, more intentional. The glitch that was supposed to be a liability became its greatest asset. Rhythmz went from being an outcast to becoming the inspiration for an entire new generation of dancing robots, all programmed to express themselves through movement.',
      },
      generateObject: {
        openai: '{\n  "story": "A dancing robot",\n  "characters": 1,\n  "theme": "self-expression",\n  "length": "short"\n}',
        anthropic: '{\n  "title": "Robot\'s First Dance",\n  "genre": "inspirational",\n  "word_count": 150,\n  "mood": "uplifting"\n}',
        groq: '{\n  "narrative": "learning_journey",\n  "protagonist": "robot",\n  "skills_learned": ["dancing", "confidence"],\n  "lesson": "embrace_uniqueness"\n}',
      },
      streamText: {
        openai: 'Streaming response: The robot began to move... step by step... gaining confidence... dancing with joy... ',
        anthropic: 'Real-time output: Motion after motion... the robot learned... through repetition and courage... expressing itself... ',
        groq: 'Live stream: Jerky movements became fluid... practice made perfect... art was born from code... ',
      },
      generateImage: {
        openai: '[Image description: A sleek metallic robot with LED eyes, mid-spin on a dance floor with colorful lights and musical notes floating around it]',
        anthropic: '[Image representation: Close-up of a robot\'s upper body swaying gracefully to music, with a digital heart symbol pulsing from its chest]',
        groq: '[Visualization: A group of robots of various sizes dancing together in a choreographed formation with neon light trails]',
      },
    }

    const responseText =
      mockResponses[functionName]?.[provider] ||
      'The AI assistant is thinking about your prompt...'

    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      result: responseText,
      provider,
      model,
      function: functionName,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
