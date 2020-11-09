import { ObjectId } from 'mongodb';

export type ReferenceNames =
    | 'Github'
    | 'LinkedIn'
    | 'resume'
    | 'personalWebsite'
    | 'email'
    | 'phone'
    | 'other';

interface Reference {
    link: string;
    // NOTE: If necessary, add more types of references in the future. There must be an icon for each Reference.name
    name: ReferenceNames;
}

export interface TeamMember {
    picturePath?: string;
    fullName: string;
    subtitle: string;
    description: string;
    startDate: string;
    endDate: string;
    references?: Reference[];
}

export interface Team {
    name: string;
    members: TeamMember[];
}

/**
 * on the client _id will be a string, on the server the _id will be an object id
 */
export interface User {
    _id: string | ObjectId;
    meta: {
        createdAt: Date | string;
        lastLogin: Date | string;
    };
    roles: string[];
    email: {
        verified: boolean;
        address: string;
    };
    password: string;
    name: {
        first: string;
        last: string;
    };
    settings: {
        townhall: {
            anonymous: boolean;
        };
        notifications: {
            enabled: boolean;
            types: string[];
        };
    };
}

/**
 * Fields from the user document that are safe to send to the client in almost any scenario
 */
export type ClientSafeUser = Pick<User, '_id' | 'email' | 'name'>;

export interface UserHistory {
    _id: string | ObjectId;
    userId: string | ObjectId;
    history: {
        actions: {
            timestamp: Date | number | string;
            action: string;
        }[];
        townhall: {
            _id: string;
            title: string;
            timestamp: Date | number | string;
            tags: string[]; // stuff like attended/moderated/banned/viewed/etc
        }[];
    };
}

/**
 * general meta field on any database doc
 */
export interface Meta {
    createdAt: Date | string;
    createdBy: {
        _id: string | ObjectId;
        name: {
            first: string;
            last: string;
        };
    };
}

export * from './auth';
export * from './townhall';
