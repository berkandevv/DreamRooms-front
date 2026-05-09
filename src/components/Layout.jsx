import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  )
}
