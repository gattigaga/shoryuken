export const getHttpStatusCode = (postgrestErrorCode: string) => {
  // https://postgrest.org/en/stable/references/errors.html

  const errorCodes: Record<string, number> = {
    // Group 0
    PGRST000: 503,
    PGRST001: 503,
    PGRST002: 503,
    PGRST003: 504,

    // Group 1
    PGRST100: 400,
    PGRST101: 405,
    PGRST102: 400,
    PGRST103: 416,
    PGRST105: 405,
    PGRST106: 406,
    PGRST107: 415,
    PGRST108: 400,
    PGRST109: 400,
    PGRST110: 400,
    PGRST111: 500,
    PGRST112: 500,
    PGRST114: 400,
    PGRST115: 400,
    PGRST116: 406,
    PGRST117: 405,
    PGRST118: 400,
    PGRST119: 400,
    PGRST120: 400,
    PGRST121: 400,
    PGRST122: 400,

    // Group 2
    PGRST200: 400,
    PGRST201: 300,
    PGRST202: 404,
    PGRST203: 300,
    PGRST204: 400,

    // Group 3
    PGRST300: 500,
    PGRST301: 401,
    PGRST302: 401,

    // Group X
    PGRSTX00: 500,
  };

  return errorCodes[postgrestErrorCode];
};
