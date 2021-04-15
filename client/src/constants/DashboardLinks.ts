interface Link {
  text: string;
  link: string;
}

const links: Link[] = [
  { text: 'Public', link: '/' },
  { text: 'Events', link: '/dashboard/events' },
  { text: 'Venues', link: '/dashboard/venues' },
];

export default links;
