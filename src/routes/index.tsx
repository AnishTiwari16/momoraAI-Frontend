import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Browse from '../pages/Browse';
import Transactions from '../pages/Transactions';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/transactions" element={<Transactions />} />
            </Routes>
        </Router>
    );
}

export default App;
