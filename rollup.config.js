import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'

export default [
  // ES Modules

  {
    input: 'src/index.ts',
    output: {
      file: 'dist/es/index.es.js', format: 'es',
    },
    plugins: [
      typescript(),
      babel({ extensions: ['.ts'] }),
    ],
  },
  
  // CommonJS
  
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/cjs/index.cjs.min.js',
      format: 'cjs',
      indent: false,
    },
    plugins: [
      typescript(),
      babel({ extensions: ['.ts'], exclude: 'node_modules/**' }),
      commonjs()
    ],
  }
]