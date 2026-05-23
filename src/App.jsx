import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PrivacyPage from './pages/PrivacyPage';

export default function App() {
  const path = window.location.pathname;
  const isPrivacy = path.includes('politica-de-privacidad');

  return (
    <Layout isPrivacy={isPrivacy}>
      {isPrivacy ? <PrivacyPage /> : <HomePage />}
    </Layout>
  );
}
