const PlaylistService = require('./../services/playlist.service');

class PlaylistController {

  async getPlaylistsByChannelId(req, res) {
    try {
      const channelId = req.params.id;
      const { nextPageToken } = req.query;
      const playlists = await PlaylistService.getPlaylistsByChannelId(channelId, nextPageToken);

      res.status(200).json(playlists);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }

  async createNotionPlaylist(req, res) {
    try {
      const playlistId = req.body.id;
      await PlaylistService.createNotionPlaylist(playlistId);
    
      res.status(201).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error?.message });
    }
  }
  
}

module.exports = new PlaylistController();