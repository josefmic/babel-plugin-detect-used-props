# babel-plugin-detect-used-props

A Babel plugin to analyze the props of a single or multiple files.
Traversal and analysis using @babel/traverse.

## Install

`npm i babel-plugin-detect-used-props`

## Configuring `babel-plugin-detect-used-props`

To use `babel-plugin-detect-used-props`, you need to add it to your Babel configuration.  

### **Babel Configuration (`babel.config.js` or `.babelrc`)**
You can configure `babel-plugin-detect-used-props` directly in your Babel settings:  

```tsx
module.exports = {
  plugins: [
    ['babel-plugin-detect-used-props', {
      filePath: 'src/output.json'
    }]
  ]
}
```

Or, if you're using a `.babelrc` file:

```tsx
{
  "plugins": [
    ["babel-plugin-detect-used-props", {
      "filePath": "src/output.json"
    }]
  ]
}
```

### **Vite Configuration**
Alternatively, if you're using Vite, you can configure `babel-plugin-detect-used-props` inside the Vite config:

```tsx
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-detect-used-props', {
            filePath: 'src/output.json'
          }]
        ],
      },
    }),
  ],
});
```

## Basic usage

### Get the analysis output

```tsx
import * as fs from "node:fs"

// Get the output from file (when `fileOutput` option is specified)
const usedPropsFromFile = JSON.parse(fs.readFileSync("./src/output.json"));
```

### Example input/output

**Input:**

```tsx
export const Component = ({
  data,
}: {
  data: {
    used1: number;
    used2: number;
    unused: number; 
  }
}) => {
  return (
    <div>
      <div>used1: {data.used1}</div>
      <div>used2: {data.used2}</div>
    </div>
  );
};
```

**Expected output:**

```ts
[
  {
    fileName: "C:/.../src/Component.tsx",
    functions: [
      {
        name: "Component",
        used: [
          ["data", "used1"],
          ["data", "used2"]
        ]
      }
    ]
  }
]
```

## `analyzeProps` config

```ts
interface AnalyzePropsOptions {
  /**
   * Where to output the analysis result
   * @example "./output.json"
   */
  filePath?: string;
}
```
