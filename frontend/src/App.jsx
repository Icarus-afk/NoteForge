// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import HomePage from './pages/HomePage';
import PrivateRoute from './utils/PrivateRoute';
import NoteEditor from './pages/NoteEditor';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signin"  element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<PrivateRoute><HomePage /> </PrivateRoute>} />
                <Route path="/note/:fileId" element={<PrivateRoute><NoteEditor /> </PrivateRoute>} />
            </Routes>
        </Router>
    );
};

export default App;