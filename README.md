# native-federation-tests

Bundler agnostic plugins to share federated types.

## Install

```bash
npm i -D https://github.com/ilteoood/native-federation-tests
```

This module provides two plugins:

### NativeFederationTestsRemote
This plugin is used to build the federated types.

#### Configuration
```typescript
{
    moduleFederationConfig: any; // the configuration same configuration provided to the module federation plugin, it is MANDATORY
    distFolder?: string; // folder used to store the dist, default is './dist'
    testsFolder?: string; // folder where all the files will be stored, default is '@mf-tests'
    deleteTypesFolder?: boolean; // indicate if the tests folder will be deleted when the job completes, default is 'true'
}
```

#### Additional configuration
Note that, for Webpack, the plugin automatically inject the `devServer.static.directory` configuration.

### NativeFederationTestsHost
This plugin is used to download the federated types.

### Configuration

```typescript
{
    moduleFederationConfig: any; // the configuration same configuration provided to the module federation plugin, it is MANDATORY
    typesFolder?: string; // folder where all the files will be stored, default is '@mf-types',
    deleteTypesFolder?: boolean; // indicate if the types folder will be deleted before the job starts, default is 'true'
}
```

## Bundler configuration

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import {NativeFederationTestsHost, NativeFederationTestsRemote} from 'native-federation-tests/vite'

export default defineConfig({
  plugins: [
    NativeFederationTestsRemote({ /* options */ }),
    NativeFederationTestsHost({ /* options */ }),
  ],
  /* ... */
  server: { // This is needed to emulate the devServer.static.directory of WebPack and correctly serve the zip file
    /* ... */
    proxy: {
      '/@mf-types.zip': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: () => `/@fs/${process.cwd()}/dist/@mf-types.zip`
      }
    },
    fs: {
      /* ... */
      allow: ['./dist']
      /* ... */
    }
  }
})
```

<br>
</details>
<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import {NativeFederationTestsHost, NativeFederationTestsRemote} from 'native-federation-tests/rollup'

export default {
  plugins: [
    NativeFederationTestsRemote({ /* options */ }),
    NativeFederationTestsHost({ /* options */ }),
  ],
}
```

<br>
</details>
<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
const {NativeFederationTestsHost, NativeFederationTestsRemote} = require('native-federation-tests/webpack')
module.exports = {
  /* ... */
  plugins: [
    NativeFederationTestsRemote({ /* options */ }),
    NativeFederationTestsHost({ /* options */ })
  ]
}
```

<br>
</details>
<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import {NativeFederationTestsHost, NativeFederationTestsRemote} from 'native-federation-tests/esbuild'

build({
  plugins: [
    NativeFederationTestsRemote({ /* options */ }),
    NativeFederationTestsHost({ /* options */ })
  ],
})
```

<br>
</details>

## TypeScript configuration

To have the type definitions automatically found for imports, add paths to the `compilerOptions` in the `tsconfig.json`:

```json
{  
  "paths": {
    "*": ["./@mf-types/*"]
  }
}
```

## Examples

To use it in a `host` module, refer to [this example](https://github.com/ilteoood/module-federation-typescript/tree/host).  
To use it in a `remote` module, refer to [this example](https://github.com/ilteoood/module-federation-typescript/tree/remote).