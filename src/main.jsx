import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import {store, persistor} from './redux/store.jsx'

const ClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
 
createRoot(document.getElementById('root')).render(
   <StrictMode>

     <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
              <GoogleOAuthProvider clientId={ClientId}>
                <App />
              </GoogleOAuthProvider>
        </PersistGate>
     </Provider>
   </StrictMode>
 
)
