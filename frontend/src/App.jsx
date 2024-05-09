import { ConfigProvider, theme } from "antd";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './utils/PrivateRoute';
import NoteEditor from './pages/NoteEditor';
import NoteViewer from './pages/NoteViewer'; // Import NoteViewer

const App = () => {
  const { darkAlgorithm } = theme;

  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
      }}
    >
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/note/new" element={<PrivateRoute><NoteEditor isNewNote={true} /></PrivateRoute>} />
          <Route path="/note/:fileId/edit" element={<PrivateRoute><NoteEditor isNewNote={false} /></PrivateRoute>} />
          <Route path="/note/:fileId" element={<PrivateRoute><NoteViewer /></PrivateRoute>} /> 
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;