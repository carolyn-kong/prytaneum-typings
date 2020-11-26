import faker from 'faker';
import { ObjectId } from 'mongodb';
import { Meta, Name, makeMetaField, makeName } from '.';

const past = faker.date.past();
const future = faker.date.future();

export interface FileAttachment {
    type: 'file';
    name: string;
    file: string; // this will be a url on the server to download that file
}

export const makeFileAttachment = (): FileAttachment => {
    return {
        type: 'file',
        name: faker.random.word(),
        file: faker.random.word(), // TODO: maybe make this a better 'random'
    };
};

export interface UrlAttachment {
    type: 'url';
    name: string;
    url: string; // e.g. some youtube video
}

export const makeUrlAttachment = (): UrlAttachment => {
    return {
        type: 'url',
        name: faker.random.word(),
        url: faker.random.word(), // TODO: maybe make this a better 'random'
    };
};

export type TownhallAttachment = FileAttachment | UrlAttachment;

export const makeTownhallAttachment = (): TownhallAttachment => {
    return Math.random() > 0.5 ? makeUrlAttachment() : makeFileAttachment();
};

export type ModeratorPermissions = 'TODO';
export interface Moderator<T extends ObjectId | string = string> {
    permissions: ModeratorPermissions[];
    name: Name;
    _id: T;
}

export const makeModerator = (): Moderator => ({
    permissions: ['TODO'],
    name: makeName(),
    _id: faker.random.alphaNumeric(12),
});

export interface TownhallSettings {
    waitingRoom: {
        enabled: boolean;
        scheduled: null | Date;
    };
    chat: {
        enabled: boolean;
        automated: boolean;
    };
    questionQueue: {
        transparent: boolean;
        automated: boolean;
        // TODO: prepopulated questions (if transparent then users can see these)
    };
    credits: {
        enabled: boolean;
        list: string[]; // user id's
    };
    attachments: {
        // TODO: change to attachments
        enabled: boolean;
        list: TownhallAttachment[];
    };
    moderators: {
        list: Moderator[];
    };
    speakers: {
        list: Speaker[];
    };
    registration: {
        reminders: {
            enabled: boolean;
            customTimes: string[]; // TODO: ISO times, don't need this now
        };
        registrants: string[]; // TODO: emails or userIds idk yet -- how to prevent abuse?
    };
}

export const makeTownhallSettings = (): TownhallSettings => {
    return {
        waitingRoom: {
            enabled: Math.random() > 0.5,
            scheduled: null,
        },
        chat: {
            enabled: Math.random() > 0.5,
            automated: Math.random() > 0.5,
        },
        questionQueue: {
            transparent: Math.random() > 0.5,
            automated: Math.random() > 0.5,
        },
        credits: {
            enabled: Math.random() > 0.5,
            list: [],
        },
        attachments: {
            enabled: Math.random() > 0.5,
            list: [],
        },
        moderators: {
            list: [makeModerator()],
        },
        speakers: {
            list: [makeSpeaker()],
        },
        registration: {
            reminders: {
                enabled: Math.random() > 0.5,
                customTimes: [],
            },
            registrants: [],
        },
    };
};

export interface TownhallForm {
    title: string;
    date: Date | string;
    description: string;
    private: boolean; // TODO: what does this mean? might put this in the form itself
    topic: string;
}

export const makeTownhallForm = (): TownhallForm => {
    return {
        title: faker.random.words(5),
        date: faker.date.between(past, future),
        description: faker.lorem.words(),
        private: Math.random() > 0.5,
        topic: faker.random.words(),
    };
};

export interface Speaker {
    name: string; // speaker's name written however, first and last don't matter
    title: string; // speaker's official title
    picture: string; // speaker's picture
    description: string; // description of who the speaker is
}

export const makeSpeaker = (): Speaker => ({
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    picture: faker.image.imageUrl(),
    title: faker.name.jobTitle(),
    description: faker.lorem.lines(5),
});

export interface QuestionForm {
    question: string;
}

export const makeQuestionForm = () => {
    return { question: faker.lorem.lines() };
};

export type QuestionState = '' | 'in_queue' | 'asked' | 'current';

export const pickQuestionState = (): QuestionState => {
    const choice = Math.random();
    // able to forgo the && choice > in each else-if statement due to short circuit evaluation
    if (choice < 0.25) {
        return '';
    } else if (choice < 0.5) {
        return 'in_queue';
    } else if (choice < 0.75) {
        return 'asked';
    } else {
        return 'current';
    }
};

export interface Question<T extends string | ObjectId = string> {
    _id: T;
    meta: Meta & {
        original?: string; // will be a question id if it's an edit of something else
        townhallId: T;
    };
    question: string;
    state: QuestionState;
    likes: string[]; // array of user id's
    aiml: {
        labels: string[];
    };
    visibility: Visibility;
}

export const makeQuestion = (): Question => {
    return {
        _id: faker.random.alphaNumeric(12),
        meta: {
            ...makeMetaField(),
            original: '',
            townhallId: faker.random.alphaNumeric(12),
        },
        question: faker.lorem.lines(2),
        state: pickQuestionState(),
        likes: [],
        aiml: {
            labels: [],
        },
        visibility: pickVisibility(),
    };
};

export type Visibility = 'visible' | 'hidden';

export const pickVisibility = (): Visibility => {
    const choice = Math.random();
    return choice > 0.5 ? 'visible' : 'hidden';
};

// TODO: last updated field
export interface ChatMessage<T extends string | ObjectId = string> {
    _id: T;
    meta: Meta & {
        townhallId: T;
    };
    visibility: Visibility;
    message: string;
}

export const makeChatMessage = (): ChatMessage => ({
    _id: faker.random.alphaNumeric(12),
    meta: { ...makeMetaField(), townhallId: faker.random.alphaNumeric(12) },
    message: faker.lorem.lines(3),
    visibility: pickVisibility(),
});

export interface ChatMessageForm {
    message: string;
}

export const makeChatMessageForm = (): ChatMessageForm => ({
    message: faker.lorem.lines(3),
});

export type Panes = 'Question Feed' | 'Chat' | 'Information';

// export type SocketNamespaces = '/townhall-messages' | '/townhall-questions';

// export interface SocketEvents {
//     '/townhall-messages': 'message-state';
//     // '/townhall-'
// }

// export interface SocketEventPayload<T, U> {
//     type: T;
//     payload: U;
// }

interface TownhallState {
    active: boolean;
    // TODO: move this inside of active?
    start: Date | null;
    end: Date | null;
    attendees: {
        current: number;
        max: number;
        // TODO: other stats so we can show a graph?
        // engagement and attendees per question?
    };
}

export const makeTownhallState = (): TownhallState => ({
    active: true,
    start: faker.date.recent(),
    end: null,
    attendees: {
        current: faker.random.number(5),
        max: faker.random.number(10),
    },
});

export interface Townhall<T extends string | ObjectId = string> {
    _id: T;
    meta: Meta;
    form: TownhallForm;
    settings: TownhallSettings;
    state: TownhallState;
}

export const makeTownhall = (): Townhall => ({
    _id: faker.random.alphaNumeric(12),
    form: makeTownhallForm(),
    meta: makeMetaField(),
    settings: makeTownhallSettings(),
    state: makeTownhallState(),
});

export const makeTownhalls = (
    amount?: number,
    callback?: (t: Townhall) => Townhall // for transforming each townhall if needed
): Townhall[] => {
    const list = [];
    const iterations = amount || 10;
    for (let i = 0; i < iterations; i += 1) {
        let townhall = makeTownhall();
        if (callback) townhall = callback(townhall);
        list.push(townhall);
    }
    return list;
};
