io.on("connection", (socket) => {
    // Other event handlers...
  
    socket.on("fetch-judges", async ({ eventId }) => {
      try {
        const judges = await fetchJudgesData(eventId);
        socket.emit("eventJudgesData", judges);
      } catch (error) {
        console.error("Error fetching judges:", error);
        socket.emit("error", "Failed to fetch judges");
      }
    });
  });
  
  async function fetchJudgesData(eventId) {
    // Retrieve the judges for the given event ID
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { judges: true },
    });
  
    return event.judges;
  }
  