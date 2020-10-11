interface ILink {
  text: string;
  link: string;
}

const links: ILink[] = [
  { text: 'Public', link: '/' },
  { text: 'Events', link: '/dashboard/events' },
  { text: 'Venues', link: '/dashboard/venues' },
];

export default links;
