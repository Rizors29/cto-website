import { createRoot } from 'react-dom/client';
import AppRoutes from '../src/routes/AppRoutes';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(<AppRoutes />);