import asyncHandler from 'express-async-handler';

export default asyncHandler(async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 3000));

  const { query } = req;
  res.json({ message: 'Delayed response from the server', query });
});
