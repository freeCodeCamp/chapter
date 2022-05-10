declare namespace Cypress {
  interface Chainable {
    /**
     * Intercept GQL request
     * @param operationName Name of GQL operation to intercept
     */
    interceptGQL(operationName: string): void;

    /**
     * Get users of the chapter directly from server
     * @param chapterId Id of the chapter
     */
    getChapterMembers(chapterId: number): Chainable<any>;

    /**
     * Get Rsvps for the event directly from server
     * @param eventId Id of the event
     */
    getRSVPs(eventId: number): Chainable<any>;

    /**
     * Authenticate with JWT token
     * @param token JWT token for authorization. If not provided, Cypress.env.JWT token is used.
     */
    login(token?: string): void;

    /**
     * Register user using GQL query
     */
    register(firstName: string, lastName: string, email: string): void;

    /**
     * Register user using page UI
     */
    registerViaUI(firstName: string, lastName: string, email: string): void;

    /**
     * Wait until emails are received by mailhog
     * @param alias Name of the alias to reference emails by
     */
    waitUntilMail(alias: string): void;

    /**
     * Create event using GQL mutation
     * @param data Data of the event. Equivalent of CreateEventInputs for the Events resolver.
     */
    createEvent(data): Chainable<any>;

    /**
     * Delete event using GQL mutation
     * @param eventId Id of the event for deletion
     */
    deleteEvent(eventId: number): Chainable<any>;
  }
}
