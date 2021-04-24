interface HeaderLink {
  name: string;
  label: string;
  href: string;
}

export const headerLinks: HeaderLink[] = [
  { name: 'events', label: 'Events', href: '/events' },
  { name: 'chapters', label: 'Chapters', href: '/chapters' },
  { name: 'login', label: 'Login', href: '/auth/login' },
  { name: 'register', label: 'Register', href: '/auth/register' },
  { name: 'admin', label: 'Admin', href: '/dashboard' },
];
