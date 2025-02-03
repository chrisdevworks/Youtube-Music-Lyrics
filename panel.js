document.addEventListener("DOMContentLoaded", () => {
  const getSongAndFetchLyricsButton = document.getElementById("video-btn");
  const songInfoDisplay = document.getElementById("song-info-display-0");
  const songInfoDisplay1 = document.getElementById("song-info-display-1");
  const songInfoDisplay2 = document.getElementById("song-info-display-2");
  const songInfoDisplay3 = document.getElementById("song-info-display-3");
  const songInfoDisplay4 = document.getElementById("song-info-display-4");
  const authorInfoDisplay = document.getElementById("author-info-display");
  const lyricsDisplay = document.getElementById("lyrics-display");


  

  let currentSong = "";
  let currentArtist = "";

  // Event listener for "Get Song and Fetch Lyrics" button
  getSongAndFetchLyricsButton.addEventListener("click", () => {
    // chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    // Get the song and artist from the current page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => {
            // Extract song and artist from the current webpage
            const inputElement = document.querySelector("#title > h1 > yt-formatted-string");

            const input = inputElement.textContent;
            
            const parts = input.split(/[:\-]/);
            // let parts = input.split(/\s*[:\-]\s*/);

            const artist = parts[0];
            const song = parts[1];

            console.log(artist);  // "Ne-Yo"
            console.log(song);  // "Mad"

            // const songElement = song.replace(/(?:\s(ft\.|featuring|feat\.).*)/i, "").replace(/\[[^\]]*\]/, "").trim();
            const songElement = song.replace(/\s*\([^()]*\)\s*/g, "").replace(/(?:\s(ft\.|featuring|feat\.).*)/i, "").replace(/\[[^\]]*\]/, "").trim();
            const artistElement = artist.replace(/,.*$/, "").replace(/\bthe\b/i, "").trim();

            console.log(encodeURIComponent(artistElement));
            console.log(encodeURIComponent(songElement));

            // let songElement = songTitle.split(" ft.")[0];

            console.log("Author:", artistElement);
            console.log("Song:", songElement);

            return {
              songName: songElement,
              artistName: artistElement,
            };
          },
        },
        (results) => {
          if (results && results[0]?.result) {
            const { songName, artistName} = results[0].result;

            if (songName && artistName) {
              // songInfoDisplay.textContent = `Now Playing: "${songName}"`;
              songInfoDisplay.innerHTML  = `${songName}&nbsp;&nbsp;&nbsp;🎵&nbsp;&nbsp;&nbsp;`;
              songInfoDisplay1.innerHTML  = `${songName}&nbsp;&nbsp;&nbsp;🎵&nbsp;&nbsp;&nbsp;`;
              songInfoDisplay2.innerHTML  = `${songName}&nbsp;&nbsp;&nbsp;🎵&nbsp;&nbsp;&nbsp;`;
              songInfoDisplay3.innerHTML  = `${songName}&nbsp;&nbsp;&nbsp;🎵&nbsp;&nbsp;&nbsp;`;
              songInfoDisplay4.innerHTML  = `${songName}&nbsp;&nbsp;&nbsp;🎵&nbsp;&nbsp;&nbsp;`;

              authorInfoDisplay.innerHTML  = `by "${artistName}"`;
              fetchLyrics(songName, artistName);
            } else {
              songInfoDisplay.textContent = "Song or artist information not found.";
            }
          }
        }
      );
    });
  });

  // Function to fetch lyrics from the API
  function fetchLyrics(songName, artistName) {
    if (!songName || !artistName) {
      alert("Please provide song and artist information.");
      return;
    }

    const encodedSongName = encodeURIComponent(songName);
    const encodedArtistName = encodeURIComponent(artistName);
    
    const url = `https://api.lyrics.ovh/v1/${encodedArtistName}/${encodedSongName}`;
    // const url = `https://api.textyl.co/api/lyrics?q=${encodedArtistName}${encodedSongName}`;
    // const url = `https://www.stands4.com/services/v2/lyrics.php?uid=13005&tokenid=PyMr47BCeO2TiU08&term=${encodedSongName}&artist=${encodedArtistName}&format=json`;
    // https://api.textyl.co/api/lyrics?q=the%20beatles%20norwegian%20wood

    // console.log(`Fetching lyrics for: ${songName} by ${artistName}`);
    // alert(url);
    // Fetch lyrics from the API
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.lyrics) {
          console.log("Fetched Lyrics:", data.lyrics);
          displayLyrics(data.lyrics);
        } else {
          console.error("No lyrics found");
          displayLyrics("Error: No lyrics found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching lyrics:", error);
        displayLyrics("Error fetching lyrics: " + error.message);
      });
  }

  // Function to display lyrics in the HTML
  function displayLyrics(lyricsText) {
    if (lyricsDisplay) {
      // Replace newline characters with <br> tags
      const formattedLyrics = lyricsText.replace(/\r\n|\n/g, "<br>");
      lyricsDisplay.innerHTML = formattedLyrics; // Use innerHTML to interpret <br> tags
    } else {
      console.error("Lyrics display element not found.");
    }
  }
});



