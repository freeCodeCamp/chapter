export function expectToBeRejected(response) {
  expect(response.status).to.eq(200);
  const errors = response.body?.errors;
  expect(errors).to.have.length(1);
  expect(errors[0].message).to.eq(
    "Access denied! You don't have permission for this action!",
  );
}

export function gqlOptions(body, additionalOptions) {
  return {
    method: 'POST',
    url: Cypress.env('GQL_URL'),
    body: body,
    ...additionalOptions,
  };
}
