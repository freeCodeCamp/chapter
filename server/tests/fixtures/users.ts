import { merge } from 'lodash/fp';

import {
  users,
  events,
  instance_roles,
  chapter_users,
  instance_role_permissions,
  event_users,
  event_roles,
  event_permissions,
  user_bans,
} from '@prisma/client';

type User = users & {
  instance_role: instance_roles & {
    instance_role_permissions: instance_role_permissions[];
  };
} & {
  user_chapters: chapter_users[];
} & {
  user_events: event_users[];
};

const baseUser: User = {
  instance_role: {
    id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    name: 'zero-permissions-role',
    instance_role_permissions: [],
  },
  instance_role_id: 1,
  user_chapters: [],
  user_events: [],
  name: 'any one',
  id: 1,
  image_url: null,
  created_at: new Date(),
  updated_at: new Date(),
  email: 'an@add.ress',
  auto_subscribe: false,
};

export const userWithInstanceRole: User = merge(baseUser, {
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

type EventRolePermissions = {
  event_permission: Pick<event_permissions, 'name'>;
};

type EventUser = Pick<event_users, 'event_id'> & {
  event: Pick<events, 'chapter_id'>;
  event_role: Pick<event_roles, 'name'> & {
    event_role_permissions: EventRolePermissions[];
  };
};

export const chapterTwoEventUser: EventUser[] = [
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
    event_id: 3,
  },
];

export const userWithRoleForChapterOne: User = merge(baseUser, {
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

export const userWithRoleForChaptersOneAndTwo: User = merge(baseUser, {
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
      chapter_id: 2,
    },
  ],
});

export const userWithRoleForEventOne: User = merge(baseUser, {
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

// The user's id is not used directly. Instead we rely on their bans being
// returned with the original user query.
export const userBansChapterOne: user_bans[] = [
  {
    created_at: new Date(),
    updated_at: new Date(),
    chapter_id: 1,
    user_id: -1,
  },
];

export const userBansChapterTwo: user_bans[] = [
  {
    created_at: new Date(),
    updated_at: new Date(),
    chapter_id: 2,
    user_id: -1,
  },
];
