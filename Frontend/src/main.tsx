import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
import {Provider} from 'react-redux'
import {store,persistor} from './redux/Store'
import { PersistGate } from 'redux-persist/integration/react'
const queryClient=new QueryClient()

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
<QueryClientProvider client={queryClient}>
<App />

</QueryClientProvider>
    </PersistGate>

  </Provider>
)
