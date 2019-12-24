interface IHeaderLink {
  name: string;
  label: string;
  href: string;
}
export const headerLinks: IHeaderLink[] = [
  { name: 'events', label: 'Events', href: '/events' },
  { name: 'chapters', label: 'Chapters', href: '/chapters' },
  { name: 'login', label: 'Login', href: '/login' },
  { name: 'register', label: 'Register', href: '/register' },
];
