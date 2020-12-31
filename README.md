# babel-plugin-transform-module

## Install

Using npm:

```bash
npm install --save-dev babel-plugin-transform-module
```

or using yarn:

```bash
yarn add babel-plugin-transform-module --D
```

## Usage

```js
module.exports = {
  plugins: [['transform-module', { module: 'antd' }]],
}
```

## Example

Transform

```js
import { Button } from 'antd'
```

To

```js
import Button from 'antd/button'
```
