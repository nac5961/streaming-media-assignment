// Requires
const fs = require('fs'); // File system module
const path = require('path'); // path module to work with files and paths

// Function to get the byte range
const getByteInfo = (request, stats) => {
  // Get the range from the headers
  let { range } = request.headers;

  // If there wasn't a range header, start at the beginning of the file (start from byte 0)
  if (!range) {
    range = 'bytes=0-';
  }

  // Get an array of the range (start range and end range),
  // by removing 'bytes=' and splitting on the '-'range.replace(/bytes=/, '').split('-');
  const positions = range.replace(/bytes=/, '').split('-');

  // Parse the start range into an int
  let start = parseInt(positions[0], 10);

  // Get the total number of bytes in the file
  const total = stats.size;

  // If an end range was given, parse it into an int,
  // else set the end range to the end of the file
  const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

  // If the start range is greater than the end range, then reset the start range
  if (start > end) {
    start = end - 1;
  }

  // Set how big this range is in bytes
  const chunksize = (end - start) + 1;

  return {
    start,
    end,
    total,
    chunksize,
  };
};

// Function to get the byte stream
const getStream = (response, file, byteInfo) => {
  // Create a file stream for the video (This is a read stream)
  // Parameters: 1) file object 2) object containing start and end points in bytes
  const stream = fs.createReadStream(file, byteInfo);

  // Set a callback function for when the stream is in an 'open' state
  stream.on('open', () => {
    stream.pipe(response);
  });

  // Set a callback function for when the stream is in an 'error' state
  // End the response to tell the browser stop listening for bytes (we also return a stream error)
  stream.on('error', (streamErr) => {
    response.end(streamErr);
  });

  return stream;
};

// Function to stream a file
const streamFile = (request, response, filePath, contentType) => {
  // Create a file object based on the file path
  // Parameters: 1) Directory 2) Relative path of file from that directory
  const file = path.resolve(__dirname, filePath);

  fs.stat(file, (err, stats) => {
    // If an error occurred
    if (err) {
      // Check if error code is 'Error No Entry'. If so send 404 status code.
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }

      // Send error back to the client
      return response.end(err);
    }

    // Get the range from the headers
    const byteInfo = getByteInfo(request, stats);

    // Send the appropriate headers in the response with the appropriate status code
    response.writeHead(206, {
      'Content-Range': `bytes ${byteInfo.start}-${byteInfo.end}/${byteInfo.total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': byteInfo.chunksize,
      'Content-Type': contentType,
    });

    return getStream(response, file, byteInfo);// { start: byteInfo.start, end: byteInfo.end });
  });
};

// Function to stream the party video in the response
const getParty = (request, response) => {
  streamFile(request, response, '../client/party.mp4', 'video/mp4');
};

// Function to stream the bling image in the response
const getBling = (request, response) => {
  streamFile(request, response, '../client/bling.mp3', 'audio/mpeg');
};

// Function to stream the bird video in the response
const getBird = (request, response) => {
  streamFile(request, response, '../client/bird.mp4', 'video/mp4');
};

// Export the function (make it public)
module.exports.getParty = getParty;
module.exports.getBling = getBling;
module.exports.getBird = getBird;
