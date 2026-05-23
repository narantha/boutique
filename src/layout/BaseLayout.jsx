import { Helmet } from './Helmet';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function BaseLayout({ title, description, children }) {
  return (
    <>
      <Helmet title={title} description={description} />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
