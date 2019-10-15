const users = [
  {
    id: 1
  },
  { id: 2 },
  { id: 3 }
];

export default (req, res) => {
  res.status(200).json(users);
};
