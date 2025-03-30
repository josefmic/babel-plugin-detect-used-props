import { PluginObj, PluginPass } from '@babel/core';
import fs from 'fs/promises';
import { getUsedProps } from './traverse';
import { AnalyzePropsOptions, ProgramOutput } from './types';
import pathModule from 'path';
import glob from 'fast-glob';

let analyzedProps: ProgramOutput = [];

function detectUsedProps(
  { types: t }: { types: any },
  options: AnalyzePropsOptions
): PluginObj<PluginPass> {
  return {
    name: 'babel-plugin-detect-used-props',
    visitor: {
      JSXOpeningElement(path, state) {
        const fileName = state.file.opts.filename;

        if (options.patterns) {
          const matchedFiles = glob.sync(options.patterns, {
            cwd: process.cwd(),
            absolute: true
          });
  
          const normalizedFileName = pathModule.normalize(fileName);
          const matched = matchedFiles.some(f => pathModule.normalize(f) === normalizedFileName);
  
          if (!matched) return;
        }

        analyzedProps = getUsedProps(path, state, analyzedProps);
      } 

    },
    post() {
      if (options.filePath) {
        const dir = pathModule.dirname(options.filePath);
    
        fs.mkdir(dir, { recursive: true })
          .then(() =>
            fs.writeFile(options.filePath, JSON.stringify(analyzedProps, null, 2), 'utf-8')
          )
          .catch(err => console.error('Failed to write analyzed props:', err));
      }
    }
  };
}

export default detectUsedProps;
