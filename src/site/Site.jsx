import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import { useTheme } from './theme'
import SiteHeader from './SiteHeader'
import './site.css'

// Cadre commun à toutes les pages du site vitrine : thème, polices, en-tête
export default function Site({ className = '', children }) {
  const theme = useTheme()
  return (
    <div className={`site ${className}`} data-theme={theme}>
      <SiteHeader />
      {children}
    </div>
  )
}
