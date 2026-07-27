import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="font-bold text-lg leading-none">A</span>
              </div>
              <span className="font-bold text-lg text-white">Andy Homecare Connect</span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm mb-4 leading-relaxed">
              Kenya's trusted marketplace connecting families with dedicated, vetted house helps. Building stronger communities through dignified work and safe homes.
            </p>
            <div className="flex items-center gap-3">
              {/* Kenyan flag subtle accent */}
              <div className="w-4 h-1 bg-black rounded-sm"></div>
              <div className="w-4 h-1 bg-secondary rounded-sm"></div>
              <div className="w-4 h-1 bg-primary rounded-sm"></div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/browse" className="hover:text-white transition-colors">Find Help</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Join as Professional</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-help">Contact Us</span></li>
              <li><span className="cursor-help">Trust & Safety</span></li>
              <li><span className="cursor-help">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-800 text-sm text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Andy Homecare Connect. All rights reserved.</p>
          <p className="flex items-center gap-1">Proudly built in Kenya <span className="inline-block w-3 h-3 bg-secondary rounded-full"></span></p>
        </div>
      </div>
    </footer>
  );
}
