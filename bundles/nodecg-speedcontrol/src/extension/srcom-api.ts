import needle, { NeedleResponse } from 'needle';
import { UserData } from '../../types';
import { get as ncgGet } from './util/nodecg';

const nodecg = ncgGet();
const userDataCache: { [k: string]: UserData } = {};

/**
 * Make a GET request to speedrun.com API.
 * @param url speedrun.com API endpoint you want to access.
 */
async function get(endpoint: string): Promise<NeedleResponse> {
  try {
    nodecg.log.debug(`[speedrun.com] API request processing on ${endpoint}`);
    const resp = await needle(
      'get',
      `https://www.speedrun.com/api/v1${endpoint}`,
      null,
      {
        headers: {
          'User-Agent': 'nodecg-speedcontrol',
          Accept: 'application/json',
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore: parser exists but isn't in the typings
    if (resp.parser !== 'json') {
      throw new Error('Response was not JSON');
      // We should retry here.
    } else if (resp.statusCode !== 200) {
      throw new Error(JSON.stringify(resp.body));
      // Do we need to retry here? Depends on err code.
    }
    nodecg.log.debug(`[speedrun.com] API request successful on ${endpoint}`);
    return resp;
  } catch (err) {
    nodecg.log.debug(`[speedrun.com] API request error on ${endpoint}:`, err);
    throw err;
  }
}

/**
 * Returns the Twitch game name if set on speedrun.com.
 * @param query String you wish to try to find a game with.
 */
export async function searchForTwitchGame(query: string, abbr = false): Promise<string> {
  try {
    const endpoint = (abbr) ? 'abbreviation' : 'name';
    const resp = await get(`/games?${endpoint}=${encodeURIComponent(query)}&max=1`);
    if (!resp.body.data.length) {
      throw new Error('No game matches');
    } else if (!resp.body.data[0].names.twitch) {
      throw new Error('Game was found but has no Twitch game set');
    }
    nodecg.log.debug(
      `[speedrun.com] Twitch game name found for "${query}":`,
      resp.body.data[0].names.twitch,
    );
    return resp.body.data[0].names.twitch;
  } catch (err) {
    nodecg.log.debug(`[speedrun.com] Twitch game name lookup failed for "${query}":`, err);
    throw err;
  }
}

/**
 * Returns the user's data if available on speedrun.com.
 * @param query String you wish to try to find a user with.
 */
export async function searchForUserData(query: string): Promise<UserData> {
  if (userDataCache[query]) {
    nodecg.log.debug(
      `[speedrun.com] User data found in cache for "${query}":`,
      JSON.stringify(userDataCache[query]),
    );
    return userDataCache[query];
  }
  try {
    const resp = await get(
      `/users?lookup=${encodeURIComponent(query)}&max=1`,
    );
    if (!resp.body.data.length) {
      throw new Error(`No user matches for "${query}"`);
    }
    [userDataCache[query]] = resp.body.data; // Simple temp cache storage.
    nodecg.log.debug(
      `[speedrun.com] User data found for "${query}":`,
      JSON.stringify(resp.body.data[0]),
    );
    return resp.body.data[0];
  } catch (err) {
    nodecg.log.debug(`[speedrun.com] User data lookup failed for "${query}":`, err);
    throw err;
  }
}

/**
 * Try to find user data using multiple strings, will loop through them until one is successful.
 * Does not return any errors, if those happen this will just treat it as unsuccessful.
 * @param queries List of queries to use, if any are falsey they will be skipped.
 */
export async function searchForUserDataMultiple(...queries: (string | undefined | null)[]):
  Promise<UserData | undefined> {
  let userData;
  for (const query of queries) {
    if (query) {
      try {
        const data = await searchForUserData(query);
        userData = data;
        break;
      } catch (err) {
        // nothing found
      }
    }
  }
  return userData;
}
