import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client'
import AppRouter from "./components/nav/AppRouter"

createRoot(document.getElementById('root')).render(
    <AppRouter/>
);
