import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Browse from '../pages/Browse';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/browse" element={<Browse />} />
            </Routes>
        </Router>
    );
}

export default App;
