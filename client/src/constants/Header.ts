const chapterServer = process.env.NEXT_PUBLIC_CHAPTER_SERVER;

export interface IHeaderLink {
  name: string;
  label: string;
  href: string;
}

export const headerLinks: IHeaderLink[] = [
  { name: 'events', label: 'Events', href: '/events' },
  { name: 'chapters', label: 'Chapters', href: '/chapters' },
  // { name: 'login', label: 'Login', href: '/login' },
  { name: 'register', label: 'Register', href: '/register' },
  {
    name: 'login',
    label: 'Login',
    href: `${chapterServer}/auth/google/`,
  },
  {
    name: 'logout',
    label: 'Logout',
    href: `${chapterServer}/auth/logout`,
  },
];
