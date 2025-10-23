export interface LobbyOccupant {
    is_owner: boolean;
    turn_index: number;
    player: LobbyPlayer;
}

export interface LobbyPlayer {
    id: number;
    health: number;
    max_health: number;
    name: string;
    room_id: string;
    connected: boolean;
    commander_damage: any;
    image?: string;
    color?: string;
}

export interface LobbyRoom {
    room_id: string;
    name: string;
    owner_id: number
    turn_index: number;
    turn_user_id: number;
    actual_turn: number;
    started: boolean;
    players: LobbyOccupant[];
    max_players?: number;
}

export interface ServerMessage extends Object {
    action?: string;
    type?: string;
    data?: any;
    rooms?: LobbyRoom[];
}

export enum WSAction {
    UNKNOWN = 'UNKNOWN',
    LIST_ROOMS = 'LIST_ROOMS',
    JOIN_ROOM = 'JOIN_ROOM',
    LEAVE_ROOM = 'LEAVE_ROOM',
    CREATE_ROOM = 'CREATE_ROOM',
    CLOSE_ROOM = 'CLOSE_ROOM',
    MESSAGE = 'MESSAGE',
    BROADCAST = 'BROADCAST',
    TURN_NEXT = 'TURN_NEXT',
    TURN_SET = 'TURN_SET',
    HEALTH = 'HEALTH',
    DISCONNECT = 'DISCONNECT',
    UPDATE_ROOM = 'UPDATE_ROOM'
}