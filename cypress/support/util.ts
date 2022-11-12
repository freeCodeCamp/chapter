export function expectToBeRejected(response) {
  expect(response.status).to.eq(200);
  const errors = response.body?.errors;
  expect(errors, 'Expected response to contain one error').to.have.length(1);
  expect(errors[0].message).to.eq(
    "Access denied! You don't have permission for this action!",
  );
}

export function expectNoErrors(response) {
  expect(response.status).to.eq(200);
  expect(response.body.errors).not.to.exist;
}

export function gqlOptions(body: any, additionalOptions?: any) {
  return {
    method: 'POST',
    url: Cypress.env('GQL_URL'),
    body: body,
    ...additionalOptions,
  };
}

export function expectHrefIdToBeInArray(link, ids: number[]) {
  cy.wrap(link)
    .invoke('attr', 'href')
    .then((href) => {
      const id = parseInt(href.match(/\d+/)[0]);
      expect(ids).includes(id);
    });
}

export function expectOnlyObjectIdsInLinks(objects, linksDataCy) {
  const ids = objects.map(({ id }) => id);
  cy.get(`[data-cy=${linksDataCy}]`).each((link) =>
    expectHrefIdToBeInArray(link, ids),
  );
}
