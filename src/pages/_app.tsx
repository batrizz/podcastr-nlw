import styles from '../styles/app.module.scss';
import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { PlayerContextsProvider } from '../contexts/PlayerContexts';

function MyApp({ Component, pageProps }) {
  return(
    <PlayerContextsProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextsProvider>
  )
}

export default MyApp
