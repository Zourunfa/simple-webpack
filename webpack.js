const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

// TODO 有哪些import项
// TODO ES6->ES5

function getModuleInfo(file) {
  // 读取文件
  const body = fs.readFileSync(file, 'utf-8');

  // 转化AST语法树
  const ast = parser.parse(body, {
    sourceType: 'module', //表示我们要解析的是ES模块
  });

  console.log(ast);
  const deps = {};
  // 遍历ast
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const abspath = './' + path.join(dirname, node.source.value);
      deps[node.source.value] = abspath;
    },
  });

  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env'], //ES6->ES5
  });

  const moduleInfo = { file, deps, code };
  return moduleInfo;
}

const info = getModuleInfo('./src/index.js');
console.log('info:', info);
