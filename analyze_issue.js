const https = require('https');

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const issueTitle = process.argv[2];
const issueId = process.argv[3];

if (!CLAUDE_API_KEY) {
  console.log('⚠️  CLAUDE_API_KEY not set - creating basic implementation');
  generateBasicImplementation();
  process.exit(0);
}

const prompt = `You are a senior developer. A Linear issue was created with this title: "${issueTitle}"

Based on this issue, generate appropriate code files for a React application using Vite and shadcn/ui.

Rules:
1. Analyze what the issue is asking for
2. Generate complete, working code files
3. Use modern React patterns (hooks, TypeScript)
4. Include shadcn/ui components where appropriate
5. Provide package.json updates if needed
6. Be specific and practical

Respond with a JSON object containing:
{
  "analysis": "Brief analysis of what needs to be implemented",
  "files": [
    {
      "path": "relative/path/to/file.tsx",
      "content": "complete file content",
      "description": "what this file does"
    }
  ],
  "dependencies": ["package1", "package2"],
  "instructions": "Additional setup instructions"
}

Generate real, working code that addresses the issue.`;

const data = JSON.stringify({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 4000,
  messages: [
    {
      role: "user",
      content: prompt
    }
  ]
});

const options = {
  hostname: 'api.anthropic.com',
  port: 443,
  path: '/v1/messages',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': CLAUDE_API_KEY,
    'anthropic-version': '2023-06-01',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(body);
      const content = response.content[0].text;
      
      // Extract JSON from Claude's response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        implementCode(result);
      } else {
        console.log('⚠️  Could not parse Claude response - creating basic implementation');
        generateBasicImplementation();
      }
    } catch (error) {
      console.log('⚠️  Error processing Claude response:', error.message);
      generateBasicImplementation();
    }
  });
});

req.on('error', (error) => {
  console.log('⚠️  API request failed:', error.message);
  generateBasicImplementation();
});

req.write(data);
req.end();

function implementCode(result) {
  console.log('🤖 AI Analysis:', result.analysis);
  
  // Create files based on AI response
  result.files.forEach(file => {
    const fs = require('fs');
    const path = require('path');
    
    // Ensure directory exists
    const dir = path.dirname(file.path);
    if (dir && dir !== '.') {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(file.path, file.content);
    console.log(`✅ Created: ${file.path}`);
  });
  
  // Write implementation summary
  const summary = {
    analysis: result.analysis,
    files_created: result.files.map(f => f.path),
    dependencies: result.dependencies || [],
    instructions: result.instructions || 'No additional setup needed'
  };
  
  fs.writeFileSync('AI_IMPLEMENTATION.json', JSON.stringify(summary, null, 2));
  console.log('📋 Implementation summary saved to AI_IMPLEMENTATION.json');
}

function generateBasicImplementation() {
  const fs = require('fs');
  
  // Create a basic React component based on the issue title
  const componentName = issueTitle
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '');
  
  const basicComponent = `import React from 'react';

export const ${componentName} = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        ${issueTitle}
      </h1>
      <p className="text-gray-600">
        This component was auto-generated from Linear issue: ${issueId}
      </p>
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm">
          🚧 Implementation needed: ${issueTitle}
        </p>
      </div>
    </div>
  );
};

export default ${componentName};
`;
  
  fs.mkdirSync('src/components', { recursive: true });
  fs.writeFileSync(`src/components/${componentName}.tsx`, basicComponent);
  
  const summary = {
    analysis: `Basic component generated for: ${issueTitle}`,
    files_created: [`src/components/${componentName}.tsx`],
    dependencies: [],
    instructions: 'Complete the implementation based on the Linear issue requirements'
  };
  
  fs.writeFileSync('AI_IMPLEMENTATION.json', JSON.stringify(summary, null, 2));
  console.log(`✅ Created basic component: src/components/${componentName}.tsx`);
}
