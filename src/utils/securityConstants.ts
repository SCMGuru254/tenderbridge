
export const RATE_LIMIT_CONFIG = {
  DEFAULT: {
    points: 100,
    duration: '15 m'
  },
  AUTH: {
    points: 5,
    duration: '15 m'
  },
  API: {
    points: 60,
    duration: '1 m'
  },
  profile_update: {
    points: 5,
    duration: '1 m'
  },
  track_activity: {
    points: 100,
    duration: '1 m'
  },
  connection_request: {
    points: 10,
    duration: '1 h'
  }
} as const;
