import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './router/Router.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'

import { theme } from './theme.ts'
import { ThemeProvider } from '@mui/material/styles'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      
        <RouterProvider router={router} />
        <ThemeProvider theme={theme}/>
    </Provider>
  </StrictMode>,
)
