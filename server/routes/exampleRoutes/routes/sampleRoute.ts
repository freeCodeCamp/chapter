export default (req, res) => {
  const { query } = req;
  res.json({ message: 'Response from the server', query });
};
