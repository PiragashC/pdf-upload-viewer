import { Route, Routes } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Files from './pages/Files';
import FileViewer from './pages/FileViewer';

import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import ProtectedRoute from './ProtectedRoute';

function App() {
  const value = {
    ripple: true,
  };

  return (
    <PrimeReactProvider value={value}>
      <Routes>
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/files' element={<ProtectedRoute><Files /></ProtectedRoute>} />
        <Route path='/file-view' element={<ProtectedRoute><FileViewer /></ProtectedRoute>} />
      </Routes>
    </PrimeReactProvider>
  );
}

export default App;
