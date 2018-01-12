export const ref = {
    AUTH_SERVER: 'https://rfmdpuov4b.execute-api.us-west-2.amazonaws.com/prod/routesms',
    INVITE_SERVER: 'https://rfmdpuov4b.execute-api.us-west-2.amazonaws.com/prod/invite',
}

export const STATUS_GOING = "going"
export const STATUS_INVITED = "invited"

export const locations =
    [
        { city: 'Dallas, Texas', key: 'key0' },
        { city: 'Ottawa, Kansas', key: 'key1' },
        { city: 'Las Vegas, Nevada', key: 'key2' },
        { city: 'Seattle, Washington', key: 'key3' },
    ]


export const DURATION =
    [
        { time: '01:00:00', key: 1, value: 1 },
        { time: '02:00:00', key: 2, value: 2 },
        { time: '03:00:00', key: 3, value: 3 },
        { time: '04:00:00', key: 4, value: 4 },
    ]
export const ADD_DURATION =
    [
        { time: '01:00:00', key: 1, value: 1 },
        { time: '02:00:00', key: 2, value: 2 },
        { time: '03:00:00', key: 3, value: 3 },
        { time: '04:00:00', key: 4, value: 4 },
    ]


export const LIST_DATA_WITH_SECTIONS = [

    { name: 'Edit Profile', key: 'editProfile', section: 'Account' },

    { name: 'Blocked User', key: 'blockedList', section: 'Account' },

    { name: 'Feedback', key: 'feedback', section: 'Support' },

]

export const DEFAULT_LOCATION = "Dallas, Texas";
export const EMPTY_EVENT_LIST_TEXT = "No events in the area. Invite your friends to the app or create your own PartyOn!";
