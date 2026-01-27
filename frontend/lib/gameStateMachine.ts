import { setup, assign } from 'xstate';
import { RoomResponse } from './api';

export interface LeaderboardEntry {
  playerId: string;
  rank: number;
  playerName: string;
  points: number;
  topicScore?: { [topic: string]: number };
}

// Context holds the game data
export interface GameContext {
  room: RoomResponse | null;
  gameStartedAt: Date | null;
  isCorrect: boolean;
  score: number;
  leaderboard: LeaderboardEntry[];
  error: string;
}

// Events that can trigger state transitions
export type GameEvent =
  | { type: 'GAME_LOADED'; room: RoomResponse; startedAt: Date }
  | { type: 'ROOM_UPDATED'; room: RoomResponse }
  | { type: 'TIMER_EXPIRED' }
  | { type: 'ANSWER_SUBMITTED'; isCorrect: boolean; score: number }
  | { type: 'ROUND_FINISHED'; leaderboard: LeaderboardEntry[] }
  | { type: 'ROUND_BREAK_COMPLETE' }
  | { type: 'GAME_FINISHED'; leaderboard: LeaderboardEntry[] }
  | { type: 'QUESTION_CHANGED' }
  | { type: 'ROUND_CHANGED'; startedAt: Date; room: RoomResponse }
  | { type: 'LEADERBOARD_UPDATED'; leaderboard: LeaderboardEntry[] }
  | { type: 'PLAYER_JOINED'; player: { playerId: string; playerName: string; joinedAt: string } }
  | { type: 'ERROR'; error: string };

export const gameStateMachine = setup({
  types: {} as {
    context: GameContext;
    events: GameEvent;
  },
  actions: {
    updateRoom: assign({
      room: ({ event }) => (event as Extract<GameEvent, { type: 'ROOM_UPDATED' }>).room,
    }),
    updateLeaderboard: assign({
      leaderboard: ({ event }) => (event as Extract<GameEvent, { type: 'LEADERBOARD_UPDATED' }>).leaderboard,
    }),
    addPlayer: assign({
      room: ({ context, event }) => {
        const playerEvent = event as Extract<GameEvent, { type: 'PLAYER_JOINED' }>;
        if (!context.room) return null;
        
        const playerExists = context.room.players.some(
          (p) => p.playerId === playerEvent.player.playerId
        );
        
        if (playerExists) return context.room;
        
        return {
          ...context.room,
          players: [
            ...context.room.players,
            {
              playerId: playerEvent.player.playerId,
              playerName: playerEvent.player.playerName,
              score: 0,
              joinedAt: playerEvent.player.joinedAt,
            }
          ],
        };
      },
    }),
  },
}).createMachine({
  id: 'game',
  initial: 'loading',
  context: {
    room: null,
    gameStartedAt: null,
    isCorrect: false,
    score: 0,
    leaderboard: [],
    error: '',
  },
  states: {
    loading: {
      on: {
        GAME_LOADED: {
          target: 'question',
          actions: assign({
            room: ({ event }) => (event as Extract<GameEvent, { type: 'GAME_LOADED' }>).room,
            gameStartedAt: ({ event }) => (event as Extract<GameEvent, { type: 'GAME_LOADED' }>).startedAt,
            error: () => '',
          }),
        },
        ERROR: {
          target: 'error',
          actions: assign({
            error: ({ event }) => (event as Extract<GameEvent, { type: 'ERROR' }>).error,
          }),
        },
      },
    },

    question: {
      on: {
        ANSWER_SUBMITTED: {
          target: 'waiting',
          actions: assign({
            isCorrect: ({ event }) => (event as Extract<GameEvent, { type: 'ANSWER_SUBMITTED' }>).isCorrect,
            score: ({ event }) => (event as Extract<GameEvent, { type: 'ANSWER_SUBMITTED' }>).score,
          }),
        },
        TIMER_EXPIRED: {
          target: 'waiting',
          actions: assign({
            isCorrect: () => false,
          }),
        },
        ROOM_UPDATED: {
          actions: 'updateRoom',
        },
        LEADERBOARD_UPDATED: {
          actions: 'updateLeaderboard',
        },
        PLAYER_JOINED: {
          actions: 'addPlayer',
        },
      },
    },

    waiting: {
      on: {
        TIMER_EXPIRED: 'submitted',
        ROOM_UPDATED: {
          actions: 'updateRoom',
        },
        LEADERBOARD_UPDATED: {
          actions: 'updateLeaderboard',
        },
        PLAYER_JOINED: {
          actions: 'addPlayer',
        },
      },
    },

    submitted: {
      on: {
        QUESTION_CHANGED: 'question',
        ROUND_FINISHED: {
          target: 'roundFinished',
          actions: assign({
            leaderboard: ({ event }) => (event as Extract<GameEvent, { type: 'ROUND_FINISHED' }>).leaderboard,
          }),
        },
        GAME_FINISHED: {
          target: 'finished',
          actions: assign({
            leaderboard: ({ event }) => (event as Extract<GameEvent, { type: 'GAME_FINISHED' }>).leaderboard,
          }),
        },
        ROOM_UPDATED: {
          actions: 'updateRoom',
        },
        LEADERBOARD_UPDATED: {
          actions: 'updateLeaderboard',
        },
        PLAYER_JOINED: {
          actions: 'addPlayer',
        },
      },
    },

    roundFinished: {
      on: {
        ROUND_BREAK_COMPLETE: 'newRound',
        ROOM_UPDATED: {
          actions: 'updateRoom',
        },
        LEADERBOARD_UPDATED: {
          actions: 'updateLeaderboard',
        },
      },
    },

    newRound: {
      on: {
        ROUND_CHANGED: {
          target: 'question',
          actions: assign({
            gameStartedAt: ({ event }) => (event as Extract<GameEvent, { type: 'ROUND_CHANGED' }>).startedAt,
            room: ({ event }) => (event as Extract<GameEvent, { type: 'ROUND_CHANGED' }>).room,
          }),
        },
        ROOM_UPDATED: {
          actions: 'updateRoom',
        },
        LEADERBOARD_UPDATED: {
          actions: 'updateLeaderboard',
        },
      },
    },

    finished: {
      type: 'final',
      on: {
        ROOM_UPDATED: {
          actions: 'updateRoom',
        },
        LEADERBOARD_UPDATED: {
          actions: 'updateLeaderboard',
        },
      },
    },

    error: {
      on: {
        GAME_LOADED: {
          target: 'question',
          actions: assign({
            room: ({ event }) => (event as Extract<GameEvent, { type: 'GAME_LOADED' }>).room,
            gameStartedAt: ({ event }) => (event as Extract<GameEvent, { type: 'GAME_LOADED' }>).startedAt,
            error: () => '',
          }),
        },
      },
    },
  },
});
