import React from 'react'

import { useMyHook } from 'use-pagination-hook'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App
