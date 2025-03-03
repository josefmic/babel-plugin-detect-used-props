import { PluginObj, PluginPass } from '@babel/core';
import fs from 'fs/promises';
import { getUsedProps } from './traverse';
import { AnalyzePropsOptions, ProgramOutput } from './types';
import path from 'path';

let analyzedProps: ProgramOutput = [];

function reactPropHunter(
  { types: t }: { types: any },
  options: AnalyzePropsOptions
): PluginObj<PluginPass> {
  return {
    name: 'babel-plugin-detect-used-props',
    visitor: {
      JSXOpeningElement(path, state) {
        analyzedProps = getUsedProps(path, state, analyzedProps);
      }
    },
    post() {
      if (options.filePath) {
        const dir = path.dirname(options.filePath);
    
        fs.mkdir(dir, { recursive: true })
          .then(() =>
            fs.writeFile(options.filePath, JSON.stringify(analyzedProps, null, 2), 'utf-8')
          )
          .catch(err => console.error('Failed to write analyzed props:', err));
      }
    }
  };
}

export default reactPropHunter;
