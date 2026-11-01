import { Layout } from './components/Layout';
import type { Route } from './routes';
import '@fontsource/schibsted-grotesk/400.css';
import '@fontsource/schibsted-grotesk/600.css';
import '@fontsource/schibsted-grotesk/800.css';
import './styles/global.css';

export function App({ route }: { route: Route }) {
  return <Layout path={route.path}>{route.render()}</Layout>;
}
