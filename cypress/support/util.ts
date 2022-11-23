export function expectError(error: string) {
  return function (response) {
    expect(response.status).to.eq(200);
    const errors = response.body?.errors;
    expect(errors, 'Expected response to contain one error').to.have.length(1);
    expect(errors[0].message).to.eq(error);
  };
}

export function expectToBeRejected(response) {
  expectError("Access denied! You don't have permission for this action!")(
    response,
  );
}

export function expectNoErrors(response) {
  expect(response.status).to.eq(200);
  expect(response.body.errors, 'Expected response to not contain errors').not.to
    .exist;
}

export function gqlOptions(body: any, additionalOptions?: any) {
  return {
    method: 'POST',
    url: Cypress.env('GQL_URL'),
    body: body,
    ...additionalOptions,
  };
}

export function getFirstPathParam(link: JQuery<HTMLElement>) {
  return parseInt(link.attr('href').match(/\d+/)[0]);
}
