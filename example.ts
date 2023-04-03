import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

router.post("/clubs", async (req, res) => {
  try {
    const { name, cellPhone, email } = req.body;
    const club = await createClub(name, cellPhone, email);
    res.status(201).json(club);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

async function createClub(name: string, cellPhone: string, email: string) {
  const club = await prisma.club.create({
    data: {
      Name: name,
      CellPhone: cellPhone,
      Email: email,
    },
  });
  return club;
}

export default router;

 // // Socket server event handling
        // io.on('connection', (socket) => {
        //   console.log('A client connected');

        //   // Send a test message to the connected client
        //   socket.emit('serverIPAddress', serverIPAddress);

        //   // Handle incoming messages from the client
        //   socket.on('message', (data) => {
        //     console.log('Received message from client:', data);
        //   });
        // });