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
export default App
