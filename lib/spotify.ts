import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

let token: string;
const getToken = async () => {
  if (token) {
    return token;
  }
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    token = data.body.access_token;
    spotifyApi.setAccessToken(token);
    return token;
  } catch (error) {
    console.error("Could not get credentials", error);
    throw error;
  }
};

export async function getCategories() {
  await getToken();
  const { body } = await spotifyApi.getCategories({
    country: "AR",
    locale: "es_AR",
    limit: 10,
  });
  const { items } = body?.categories;

  const categories = items
    .map((x) => ({
      id: x.id,
      name: x.name,
      imageUrl: x.icons[0]?.url,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return categories;
}

export async function getPlaylists(categoryId: string) {
  await getToken();
  const { body } = await spotifyApi.getPlaylistsForCategory(categoryId, {
    country: "AR",
    limit: 10,
  });

  const { items } = body.playlists;

  const playlists = items
    .filter((x) => x)
    .map((x) => ({
      id: x.id,
      name: x.name,
      imageUrl: x.images[0]?.url,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return playlists;
}

export async function getPlaylistItems(playlistId: string, quantity: number) {
  await getToken();
  const { body } = await spotifyApi.getPlaylistTracks(playlistId, {
    limit: quantity,
  });

  const { items } = body;

  const tracks = items
    .filter((x) => x.track)
    .map(({ track }) => ({
      id: track.id,
      name: track.name,
      artist: { id: track.artists[0]?.id, name: track.artists[0]?.name },
      image: track.album?.images[0].url,
      url: track.preview_url,
      playlist: playlistId,
    }));

  return tracks;
}
