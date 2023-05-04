
import express from "express";
import bcrypt from 'bcryptjs';
import {PrismaClient} from '@prisma/client'

const router = express.Router();
const prisma = new PrismaClient();


//#region Club CRUD
router.post("/club", async (req, res) => {
  const { name, cellPhone, email } = req.body;
  const club = await prisma.club.create({
    data: {
      Name: name,
      CellPhone: cellPhone,
      Email: email,
    },
  });
  res.json(club);
});

router.get("/clubs", async (req, res) => {
  const clubs = await prisma.club.findMany({
    include: {
      Participants: true,
    },
  });
  res.json(clubs);
});

router.get("/club/:id", async (req, res) => {
  const { id } = req.params;
  const club = await prisma.club.findUnique({
    where: { idClub: id },
    include: {
      Participants: true,
    },
  });
  res.json(club);
});

router.put("/club/:id", async (req, res) => {
  const { id } = req.params;
  const { name, cellPhone, email } = req.body;
  const club = await prisma.club.update({
    where: { idClub: id },
    data: {
      Name: name,
      CellPhone: cellPhone,
      Email: email,
    },
  });
  res.json(club);
});

router.delete("/club/:id", async (req, res) => {
  const { id } = req.params;
  const club = await prisma.club.delete({
    where: { idClub: id },
  });
  res.json(club);
});
//#endregion

//-----------------------------------------------------------------------------------------------------------------------------

//#region Competition CRUD
router.post("/competition", async (req, res) => {
  const { name } = req.body;
  const competition = await prisma.competition.create({
    data: {
      Name: name,
    },
  });
  res.json(competition);
});

router.get("/competitions", async (req, res) => {
  const competitions = await prisma.competition.findMany({
    include: {
      Participants: true,
      Competition_has_User: true,
      Participant_has_Competition: true,
    },
  });
  res.json(competitions);
});

router.get("/competition/:id", async (req, res) => {
  const { id } = req.params;
  const competition = await prisma.competition.findUnique({
    where: { idcompetition: id },
    include: {
      Participants: true,
      Competition_has_User: true,
      Participant_has_Competition: true,
    },
  });
  res.json(competition);
});

router.put("/competition/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const competition = await prisma.competition.update({
    where: { idcompetition: id },
    data: {
      Name: name,
    },
  });
  res.json(competition);
});

router.delete("/competition/:id", async (req, res) => {
  const { id } = req.params;
  const competition = await prisma.competition.delete({
    where: { idcompetition: id },
  });
  res.json(competition);
});
//#endregion

//-----------------------------------------------------------------------------------------------------------------------------

//#region Event CRUD
router.get("/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        Event_has_Participant: true,
      },
    });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/events/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { idEvent: parseInt(id) },
      include: {
        Event_has_Participant: true,
      },
    });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.put("/events/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedEvent = await prisma.event.update({
      where: { idEvent: parseInt(id) },
      data: { Event: name },
    });
    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/events/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvent = await prisma.event.delete({
      where: { idEvent: parseInt(id) },
    });
    res.json(deletedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
//#endregion

//-----------------------------------------------------------------------------------------------------------------------------

//#region Participant CRUD
router.post("/", async (req, res) => {
  try {
    const participant = await prisma.participant.create({
      data: req.body,
    });
    res.json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating participant" });
  }
});

router.get("/", async (req, res) => {
  try {
    const participants = await prisma.participant.findMany({
      include: {
        Club: true,
        Competitions: true,
        Scores: true,
        Event_has_Participant: true,
        Participant_has_Competition: true,
      },
    });
    res.json(participants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving participants" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const participant = await prisma.participant.findUnique({
      where: { idParticipant: id },
      include: {
        Club: true,
        Competitions: true,
        Scores: true,
        Event_has_Participant: true,
        Participant_has_Competition: true,
      },
    });
    if (participant) {
      res.json(participant);
    } else {
      res.status(404).json({ error: "Participant not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving participant" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const participant = await prisma.participant.update({
      where: { idParticipant: id },
      data: data,
    });
    res.json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating participant" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const participant = await prisma.participant.delete({
      where: { idParticipant: id },
    });
    res.json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting participant" });
  }
});
//#endregion

//-----------------------------------------------------------------------------------------------------------------------------

//#region Score CRUD
// CREATE a new score
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const score = await prisma.score.create({
      data,
      include: {
        Participant: true,
        User_has_Score: true,
      },
    });
    res.json(score);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create score" });
  }
});

// READ all scores
router.get("/", async (req, res) => {
  try {
    const scores = await prisma.score.findMany({
      include: {
        Participant: true,
        User_has_Score: true,
      },
    });
    res.json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve scores" });
  }
});

// READ a single score by ID
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const score = await prisma.score.findUnique({
      where: { idScore: id },
      include: {
        Participant: true,
        User_has_Score: true,
      },
    });
    if (score) {
      res.json(score);
    } else {
      res.status(404).json({ error: "Score not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve score" });
  }
});

// UPDATE a score
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;
  try {
    const score = await prisma.score.update({
      where: { idScore: id },
      data,
      include: {
        Participant: true,
        User_has_Score: true,
      },
    });
    res.json(score);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update score" });
  }
});

// DELETE a score
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const score = await prisma.score.delete({
      where: { idScore: id },
    });
    res.json(score);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete score" });
  }
});
//#endregion

//-----------------------------------------------------------------------------------------------------------------------------

//#region User CRUD
// CREATE a new user
router.post("/users", async (req, res) => {
  const { data } = req.body;

  try {
    const user = await prisma.user.create({
      data: data,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// READ all users
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        User_has_Score: true,
        Competition_has_User: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// READ a single user by ID
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { iduser: Number(id) },
      include: {
        User_has_Score: true,
        Competition_has_User: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: `User with id ${id} not found` });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// UPDATE a user
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  try {
    const user = await prisma.user.update({
      where: { iduser: Number(id) },
      data: data,
    });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// DELETE a user
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.delete({
      where: { iduser: Number(id) },
    });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});
//#endregion

export { router };
