import { merge } from 'lodash/fp';

const baseUser = {
  instance_role: {
    name: 'zero-permissions-role',
    instance_role_permissions: [],
  },
  user_chapters: [],
  user_events: [],
  first_name: 'any',
  last_name: 'one',
  id: 1,
  email: 'an@add.ress',
};

export const userWithInstanceRole = merge(baseUser, {
  instance_role: {
    name: 'some-role',
    instance_role_permissions: [
      {
        instance_permission: {
          name: 'some-permission',
        },
      },
      {
        instance_permission: {
          name: 'a-different-permission',
        },
      },
    ],
  },
});

export const chapterTwoUserEvent = [
  {
    event: {
      chapter_id: 2,
    },
    event_role: {
      name: 'some-role',
      event_role_permissions: [
        {
          event_permission: {
            name: 'some-permission-for-events',
          },
        },
      ],
    },
    event_id: 2,
  },
];

export const chapterOneUserEvent = [
  {
    event: {
      chapter_id: 1,
    },
    event_role: {
      name: 'some-role',
      event_role_permissions: [
        {
          event_permission: {
            name: 'some-permission-for-events',
          },
        },
      ],
    },
    event_id: 2,
  },
];

export const userWithRoleForChapterOne = merge(baseUser, {
  user_chapters: [
    {
      chapter_role: {
        name: 'some-role',
        chapter_role_permissions: [
          {
            chapter_permission: {
              name: 'some-permission',
            },
          },
        ],
      },
      chapter_id: 1,
    },
  ],
});

export const userWithRoleForEventOne = merge(baseUser, {
  user_events: [
    {
      event: {
        chapter_id: 1,
      },
      event_role: {
        name: 'some-role',
        event_role_permissions: [
          {
            event_permission: {
              name: 'some-permission',
            },
          },
        ],
      },
      event_id: 1,
    },
  ],
});
