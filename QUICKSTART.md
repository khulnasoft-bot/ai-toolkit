# Quick Start Guide

## Getting Started in 5 Minutes

### 1. Start the Development Server
```bash
npm run dev
```
The application will open at `http://localhost:3000`

### 2. Explore the Application

#### Home Page (/)
- View the hero section and key features
- Learn about the toolkit capabilities
- Find links to all major sections

#### Dashboard (/dashboard)
- See project statistics and metrics
- View available packages and versions
- Explore supported AI providers
- Access quick links to features

#### Playground (/playground)
- **Select a Provider**: Choose from OpenAI, Anthropic, Groq, Google
- **Pick a Model**: Available models change based on provider
- **Choose a Function**: Generate Text, Object, Stream, or Images
- **Write Your Prompt**: Enter what you want the AI to do
- **Adjust Parameters**:
  - **Temperature**: 0 (focused) to 2 (creative)
  - **Max Tokens**: 100 to 4000 (response length)
  - **Top P**: 0 to 1 (diversity control)
- **Run**: Click the Run button to execute
- **View Results**: See responses with copy and download options

#### Examples (/examples)
- **Search**: Find examples by title or description
- **Filter by Category**: Text Generation, Object Generation, Streaming, Chat, Tool Use, Embeddings
- **Filter by Provider**: OpenAI, Anthropic, Groq
- **Copy Code**: Click "Copy Code" to copy examples to clipboard

## Key Pages

| Route | Purpose | Features |
|-------|---------|----------|
| `/` | Home/Landing | Hero section, features, CTAs |
| `/dashboard` | Project Overview | Stats, packages, providers |
| `/playground` | AI Testing | Test models, adjust parameters |
| `/examples` | Code Learning | Browse, search, copy examples |

## Navigation

Use the header navigation to jump between sections:
- Dashboard
- Playground
- Examples
- Docs (coming soon)

## Tips & Tricks

### Playground Tips
1. **Start Simple**: Begin with "Generate Text" function
2. **Experiment**: Try different temperatures to see how creativity changes
3. **Copy Results**: Use the copy button to save responses
4. **Download**: Save responses as files for later review

### Example Tips
1. **Search First**: Use keywords to find relevant examples
2. **Filter Smart**: Combine category and provider filters
3. **Read Comments**: Each example has descriptions
4. **Copy & Adapt**: Use examples as templates for your code

## Customization

### Change Theme Colors
Edit `/app/globals.css`:
```css
:root {
  --primary: 217 91% 60%;  /* Change this value */
  --background: 0 0% 5.5%;
  /* ... other colors */
}
```

### Add More Providers
Edit `/app/playground/page.tsx`:
```typescript
const PROVIDERS = [
  { id: 'newprovider', name: 'New Provider', models: ['model1', 'model2'] },
  // ... existing providers
]
```

### Add Examples
Edit `/app/examples/page.tsx`:
```typescript
const EXAMPLES = [
  {
    id: 7,
    title: 'Your Example Title',
    description: 'Description here',
    category: 'Category',
    provider: 'Provider',
    code: 'your code here',
  },
  // ... existing examples
]
```

## API Testing

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Playground Request
```bash
curl -X POST http://localhost:3000/api/playground \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "model": "gpt-4",
    "function": "generateText",
    "prompt": "Hello world",
    "parameters": {
      "temperature": 0.7,
      "maxTokens": 1024,
      "topP": 1
    }
  }'
```

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- -p 3001  # Use different port
```

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Type Errors
Make sure TypeScript is up to date:
```bash
npm install --save-dev typescript@latest
```

## Next Steps

1. **Integrate Real APIs**: Replace mock responses with real AI provider APIs
2. **Add Authentication**: Implement user accounts and API key management
3. **Deploy**: Push to production (Vercel recommended)
4. **Monitor**: Set up error tracking and analytics
5. **Expand**: Add more providers and examples

## Learn More

- [Khulnasoft AI Toolkit Docs](https://sdk.vercel.ai)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Support

For issues or questions:
1. Check the IMPLEMENTATION.md for detailed architecture
2. Review the code comments in components
3. Open an issue on GitHub
4. Contact support@khulnasoft.com

---

Happy exploring! 🚀
