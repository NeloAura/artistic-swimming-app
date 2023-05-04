import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

module.exports = {
  createClub,
  createCompetition,
  createEvent,
  createParticipant,
  createScore,
  createUser,
  getAllClubs,
  getAllCompetitions,
  getAllEvents,
  getAllParticipants,
  getAllScores,
  getAllUsers,
  getClubById,
  getCompetitionById,
  getEventById,
  getParticipantById,
  getUserById,
  updateClub,
  updateCompetition,
  updateEvent,
  updateParticipant,
  getScoreById,
  updateUser,
  deleteClub,
  deleteCompetition,
  deleteEvent,
  deleteParticipant,
  deleteScore,
  deleteUser
};



//Club CRUD
// CREATE a new club
async function createClub(name: any, cellPhone: any, email: any) {
  const club = await prisma.club.create({
    data: {
      Name: name,
      CellPhone: cellPhone,
      Email: email,
    },
  });
  return club;
}

// READ all clubs
async function getAllClubs() {
  const clubs = await prisma.club.findMany({
    include: {
      Participants: true,
    },
  });
  return clubs;
}

// READ a single club by ID
async function getClubById(id: any) {
  const club = await prisma.club.findUnique({
    where: { idClub: id },
    include: {
      Participants: true,
    },
  });
  return club;
}

// UPDATE a club
async function updateClub(id: any, name: any, cellPhone: any, email: any) {
  const club = await prisma.club.update({
    where: { idClub: id },
    data: {
      Name: name,
      CellPhone: cellPhone,
      Email: email,
    },
  });
  return club;
}

// DELETE a club
async function deleteClub(id: any) {
  const club = await prisma.club.delete({
    where: { idClub: id },
  });
  return club;
}

 //-----------------------------------------------------------------------------------------------------------------------------

//Competition CRUD
// CREATE a new competition
async function createCompetition(name: any) {
    const competition = await prisma.competition.create({
      data: {
        Name: name,
      },
    });
    return competition;
  }
  
  // READ all competitions
  async function getAllCompetitions() {
    const competitions = await prisma.competition.findMany({
      include: {
        Participants: true,
        Competition_has_User: true,
        Participant_has_Competition: true,
      },
    });
    return competitions;
  }
  
  // READ a single competition by ID
  async function getCompetitionById(id: any) {
    const competition = await prisma.competition.findUnique({
      where: { idcompetition: id },
      include: {
        Participants: true,
        Competition_has_User: true,
        Participant_has_Competition: true,
      },
    });
    return competition;
  }
  
  // UPDATE a competition
  async function updateCompetition(id: any, name: any) {
    const competition = await prisma.competition.update({
      where: { idcompetition: id },
      data: {
        Name: name,
      },
    });
    return competition;
  }
  
  // DELETE a competition
  async function deleteCompetition(id: any) {
    const competition = await prisma.competition.delete({
      where: { idcompetition: id },
    });
    return competition;
  }

 //-----------------------------------------------------------------------------------------------------------------------------

  // Event CRUD
  // CREATE a new event
async function createEvent(name: any) {
    const event = await prisma.event.create({
      data: {
        Event: name,
      },
    });
    return event;
  }
  
  // READ all events
  async function getAllEvents() {
    const events = await prisma.event.findMany({
      include: {
        Event_has_Participant: true,
      },
    });
    return events;
  }
  
  // READ a single event by ID
  async function getEventById(id: any) {
    const event = await prisma.event.findUnique({
      where: { idEvent: id },
      include: {
        Event_has_Participant: true,
      },
    });
    return event;
  }
  
  // UPDATE an event
  async function updateEvent(id: any, name: any) {
    const event = await prisma.event.update({
      where: { idEvent: id },
      data: {
        Event: name,
      },
    });
    return event;
  }
  
  // DELETE an event
  async function deleteEvent(id: any) {
    const event = await prisma.event.delete({
      where: { idEvent: id },
    });
    return event;
  }

  //-----------------------------------------------------------------------------------------------------------------------------

  // Participant CRUD
  // CREATE a new participant
async function createParticipant(data: any) {
    const participant = await prisma.participant.create({
      data: data,
    });
    return participant;
  }
  
  // READ all participants
  async function getAllParticipants() {
    const participants = await prisma.participant.findMany({
      include: {
        Club: true,
        Competitions: true,
        Scores: true,
        Event_has_Participant: true,
        Participant_has_Competition: true,
      },
    });
    return participants;
  }
  
  // READ a single participant by ID
  async function getParticipantById(id: any) {
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
    return participant;
  }
  
  // UPDATE a participant
  async function updateParticipant(id: any, data: any) {
    const participant = await prisma.participant.update({
      where: { idParticipant: id },
      data: data,
    });
    return participant;
  }
  
  // DELETE a participant
  async function deleteParticipant(id: any) {
    const participant = await prisma.participant.delete({
      where: { idParticipant: id },
    });
    return participant;
  }

   //-----------------------------------------------------------------------------------------------------------------------------

  //Score CRUD
  // CREATE a new score
async function createScore(data: any) {
    const score = await prisma.score.create({
      data: data,
    });
    return score;
  }
  
  // READ all scores
  async function getAllScores() {
    const scores = await prisma.score.findMany({
      include: {
        Participant: true,
        User_has_Score: true,
      },
    });
    return scores;
  }
  
  // READ a single score by ID
  async function getScoreById(id: any) {
    const score = await prisma.score.findUnique({
      where: { idScore: id },
      include: {
        Participant: true,
        User_has_Score: true,
      },
    });
    return score;
  }
  
  // UPDATE a score
  async function updateScore(id: any, data: any) {
    const score = await prisma.score.update({
      where: { idScore: id },
      data: data,
    });
    return score;
  }
  
  // DELETE a score
  async function deleteScore(id: any) {
    const score = await prisma.score.delete({
      where: { idScore: id },
    });
    return score;
  }

 //-----------------------------------------------------------------------------------------------------------------------------

  //User CRUD
// CREATE a new user
async function createUser(data: any) {
  const user = await prisma.user.create({
    data: data,
  });
  return user;
}

// READ all users
async function getAllUsers() {
  const users = await prisma.user.findMany({
    include: {
      User_has_Score: true,
      Competition_has_User: true,
    },
  });
  return users;
}

// READ a single user by ID
async function getUserById(id: any) {
  const user = await prisma.user.findUnique({
    where: { iduser: id },
    include: {
      User_has_Score: true,
      Competition_has_User: true,
    },
  });
  return user;
}

// UPDATE a user
async function updateUser(id: any, data: any) {
  const user = await prisma.user.update({
    where: { iduser: id },
    data: data,
  });
  return user;
}

// DELETE a user
async function deleteUser(id: any) {
  const user = await prisma.user.delete({
    where: { iduser: id },
  });
  return user;
}
