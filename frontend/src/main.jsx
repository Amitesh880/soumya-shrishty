import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import { MantineProvider } from '@mantine/core'
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')).render(
    <Auth0Provider domain="dev-1u7ju166q720ebc3.us.auth0.com" clientId="gJvpPSYZ7jOP3jCMfrDaEVs037YpH4Xe" authorizationParams={{ redirect_uri:"http://localhost:5173"}}
    audience="http://localhost:3000"
    scope="openid profile email"
    >
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <App />
        </MantineProvider>
    </Auth0Provider>

)
