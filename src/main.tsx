import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Providers from './Providers/index.tsx';
import App from './routes/index.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Providers>
            <App />
        </Providers>
    </StrictMode>
);
