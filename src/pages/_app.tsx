import { CountdownProvider } from '../contexts/CountdownContext';
import '../styles/global.css';


function MyApp({ Component, pageProps}) {
  return (
    <CountdownProvider>
        <Component {...pageProps} />
    </CountdownProvider> 
  )
}

export default MyApp
