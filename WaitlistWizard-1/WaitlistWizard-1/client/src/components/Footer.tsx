import Logo from "./Logo";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/40 backdrop-blur-md text-white py-12 border-t border-purple-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="mt-4 text-gray-400">
              Самый удобный сервис для приема донатов для стримеров и блогеров.
            </p>
            <div className="mt-6 flex space-x-4">
              <SocialLink href="#" icon="twitter" />
              <SocialLink href="#" icon="facebook" />
              <SocialLink href="#" icon="instagram" />
              <SocialLink href="#" icon="linkedin" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Навигация</h3>
            <ul className="space-y-2">
              <FooterLink href="#features" label="Возможности" />
              <FooterLink href="#faq" label="Вопросы и ответы" />
              <FooterLink href="#waitlist" label="Регистрация" />
              <FooterLink href="/login" label="Войти" isLink={true} />
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Документы</h3>
            <ul className="space-y-2">
              <FooterLink href="#" label="Политика конфиденциальности" />
              <FooterLink href="#" label="Условия использования" />
              <FooterLink href="#" label="Политика cookies" />
              <FooterLink href="#" label="Правила сервиса" />
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@flydonate.com</span>
              </li>
              <li className="flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Москва, ул. Цифровая, 42</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-purple-900/30 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} FlyDonate. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkProps {
  href: string;
  label: string;
  isLink?: boolean;
}

function FooterLink({ href, label, isLink = false }: FooterLinkProps) {
  if (isLink) {
    return (
      <li>
        <Link href={href}>
          <span className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">
            {label}
          </span>
        </Link>
      </li>
    );
  }
  
  return (
    <li>
      <a 
        href={href} 
        className="text-gray-400 hover:text-purple-400 transition-colors"
      >
        {label}
      </a>
    </li>
  );
}

interface SocialLinkProps {
  href: string;
  icon: "twitter" | "facebook" | "instagram" | "linkedin";
}

function SocialLink({ href, icon }: SocialLinkProps) {
  const getIcon = () => {
    switch (icon) {
      case "twitter":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
        );
      case "facebook":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        );
      case "instagram":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        );
      case "linkedin":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        );
      default:
        return null;
    }
  };

  return (
    <a href={href} className="text-gray-400 hover:text-purple-400 transition-colors">
      {getIcon()}
    </a>
  );
}
