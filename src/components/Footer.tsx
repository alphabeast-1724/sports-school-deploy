import { ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-card border-t border-border/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-4">
            <span>Made with</span>
            <Heart size={16} className="text-red-500 fill-current" />
            <span>by Alpha Developing Co. Pvt. Ltd.</span>
          </p>
          
          <p className="text-xs text-muted-foreground mb-6">
            © 2025–30. All rights reserved.
          </p>
          
          <a
            href="https://alpha17-beast.github.io/Portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 btn-hero group"
          >
            <span>Visit My Portfolio</span>
            <ExternalLink 
              size={16} 
              className="group-hover:translate-x-1 transition-transform duration-200" 
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;