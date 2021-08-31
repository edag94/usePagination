# use-pagination-hook

> 

[![NPM](https://img.shields.io/npm/v/use-pagination-hook.svg)](https://www.npmjs.com/package/use-pagination-hook) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## About
Hook to abstract away client side pagination logic. Written when trying to wrap [DetailsList](https://github.com/microsoft/fluentui/blob/master/packages/react/src/DetailsList.ts) from FluentUI/React with pagination logic, but can be used for any table-like component

## Install

```bash
npm install --save use-pagination-hook
```

## Usage

```tsx
import React from 'react'
import { DetailsList, DefaultButton, TextField } from "@fluentui/react"
import { usePagination } from 'use-pagination-hook'

const App = () => {
  const items = [1,2,3,4,5]
  const [itemsPerPageToSetOnClick, setItemsPerPageToSetOnClick] = React.useState(10)
  const api = usePagination({initialItemCount: items.length, initialPageNumber: 1, initialItemsPerPage: 10})
  const itemsToDisplay = api.getCurrentData(items)
  return (
    <div>
      <DetailsList
        items={itemsToDisplay}
      />
      <TextField onChange={(_, newValue) => setItemsPerPageToSetOnClick(parseInt(newValue))}/>
      <DefaultButton
        label={"Set items per page"}
        onClick={() => api.setItemsPerPage(itemsPerPageToSetOnClick)}
      />
    </div>
  )
}
```

## License

MIT © [edag94](https://github.com/edag94)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).