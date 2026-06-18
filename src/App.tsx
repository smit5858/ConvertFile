import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { AppRoutes } from './routes'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      
      {/* Page Content Container */}
      <main className="flex-grow">
        <AppRoutes />
      </main>
      
      <Footer />
    </div>
  )
}

export default App

