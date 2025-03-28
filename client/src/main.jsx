import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import routes from './routes/index.jsx';
import './assets/css/index.css';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={routes} />
    <Toaster />
  </>
);