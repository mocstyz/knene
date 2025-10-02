import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from '@/application/providers'
import { router } from '@/presentation/router'
import '@/App.css'

function App() {
  return (
    <QueryProvider>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </QueryProvider>
  )
}

export default App