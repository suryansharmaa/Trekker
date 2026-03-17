import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DashboardContainer from './pages/DashboardContainer';
import AlgorithmVisualizer from './pages/AlgorithmVisualizer';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardContainer />} />
          <Route path="/visualizer" element={<AlgorithmVisualizer />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
