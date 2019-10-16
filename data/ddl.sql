create table users (
    id uuid primary key,
    first_name text not null ,
    last_name text,
    email text not null,
    password_digest text
);

create table social_providers (
    id uuid primary key,
    name text
);

create table social_provider_users (
    id uuid primary key,
    provider_id uuid references social_providers(id) not null,
    provider_user_id text not null,
    user_id uuid references users(id) not null
);

create table locations (
    id uuid primary key,
    country text not null,
    city text not null,
    state text,
    zip text
);

create table groups (
    id uuid primary key ,
    name text unique not null,
    description text not null,
    details jsonb,
    location_id uuid references locations(id) not null,
    creator_id uuid references users(id) not null
);

create table venues (
    id uuid primary key,
    name text not null,
    location_id uuid references locations(id) not null
);

create type sponsor_type as enum ('FOOD', 'VENUE', 'OTHER');

create table sponsors (
    id uuid primary key,
    name text not null,
    website text,
    type sponsor_type not null
);

create table tags (
    id uuid primary key,
    name text not null
);

create table events (
    id uuid primary key,
    name text not null,
    description text,
    starts_at timestamptz not null,
    ends_at timestamptz not null,
    group_id uuid references groups(id) not null ,
    venue_id uuid references venues(id),
    tag_id uuid references tags(id),
    canceled boolean default false
);

create table event_sponsors (
    event_id uuid references events(id),
    sponsor_id uuid references sponsors(id)
);

create table user_groups (
    user_id uuid references users(id),
    group_id uuid references groups(id),
    primary key (user_id, group_id)
);

create table rsvps (
    user_id uuid references  users(id),
    event_id uuid references events(id),
    date timestamptz not null,
    on_waitlist boolean not null default FALSE,
    primary key (user_id, event_id)
);

create table user_bans (
    user_id uuid references users(id),
    group_id uuid references groups(id),
    primary key (user_id, group_id)
);
