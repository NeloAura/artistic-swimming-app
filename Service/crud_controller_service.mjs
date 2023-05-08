
import express from "express";
import bcrypt from 'bcryptjs';
import {PrismaClient} from '@prisma/client'

const router = express.Router();
const prisma = new PrismaClient();

//-----------------------------------------------------------------------------------------------------------------------------

// Create a club
router.post('/clubs', async (req, res) => {
  try {
    const club = await createClub(req.body);
    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create club' });
  }
});

// Get a club by ID
router.get('/clubs/:id', async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const club = await getClubById(clubId);
    if (club) {
      res.json(club);
    } else {
      res.status(404).json({ error: 'Club not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get club' });
  }
});

// Update a club
router.put('/clubs/:id', async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const clubData = req.body;
    const club = await updateClub(clubId, clubData);
    res.json(club);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update club' });
  }
});

// Delete a club
router.delete('/clubs/:id', async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    await deleteClub(clubId);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete club' });
  }
});

//-----------------------------------------------------------------------------------------------------------------------------

// Create a competition
router.post('/competitions', async (req, res) => {
  try {
    const competition = await createCompetition(req.body);
    res.status(201).json(competition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create competition' });
  }
});

// Get a competition by ID
router.get('/competitions/:id', async (req, res) => {
  try {
    const competitionId = parseInt(req.params.id);
    const competition = await getCompetitionById(competitionId);
    if (competition) {
      res.json(competition);
    } else {
      res.status(404).json({ error: 'Competition not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get competition' });
  }
});

// Update a competition
router.put('/competitions/:id', async (req, res) => {
  try {
    const competitionId = parseInt(req.params.id);
    const competitionData = req.body;
    const competition = await updateCompetition(competitionId, competitionData);
    res.json(competition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update competition' });
  }
});

// Delete a competition
router.delete('/competitions/:id', async (req, res) => {
  try {
    const competitionId = parseInt(req.params.id);
    await deleteCompetition(competitionId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete competition' });
  }
});

//-----------------------------------------------------------------------------------------------------------------------------

// Create a competitionHasUser
router.post('/competition_has_users', async (req, res) => {
  try {
    const competitionHasUser = await createCompetitionHasUser(req.body);
    res.status(201).json(competitionHasUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create competitionHasUser' });
  }
});

// Get a competitionHasUser by IDs
router.get('/competition_has_users/:competitionId/:userId', async (req, res) => {
  try {
    const competitionId = parseInt(req.params.competitionId);
    const userId = parseInt(req.params.userId);
    const competitionHasUser = await getCompetitionHasUserByIds(competitionId, userId);
    if (competitionHasUser) {
      res.json(competitionHasUser);
    } else {
      res.status(404).json({ error: 'CompetitionHasUser not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get competitionHasUser' });
  }
});

// Update a competitionHasUser
router.put('/competition_has_users/:competitionId/:userId', async (req, res) => {
  try {
    const competitionId = parseInt(req.params.competitionId);
    const userId = parseInt(req.params.userId);
    const competitionHasUserData = req.body;
    const competitionHasUser = await updateCompetitionHasUser(competitionId, userId, competitionHasUserData);
    res.json(competitionHasUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update competitionHasUser' });
  }
});

// Delete a competitionHasUser
router.delete('/competition_has_users/:competitionId/:userId', async (req, res) => {
  try {
    const competitionId = parseInt(req.params.competitionId);
    const userId = parseInt(req.params.userId);
    await deleteCompetitionHasUser(competitionId, userId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete competitionHasUser' });
  }
});

//-----------------------------------------------------------------------------------------------------------------------------

// Create an event
router.post('/events', async (req, res) => {
  try {
    const event = await createEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get an event by ID
router.get('/events/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await getEventById(eventId);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get event' });
  }
});

// Update an event
router.put('/events/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const eventData = req.body;
    const event = await updateEvent(eventId, eventData);
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete an event
router.delete('/events/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    await deleteEvent(eventId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

//-----------------------------------------------------------------------------------------------------------------------------

// Create an eventHasParticipant
router.post('/event_has_participants', async (req, res) => {
  try {
    const eventHasParticipant = await createEventHasParticipant(req.body);
    res.status(201).json(eventHasParticipant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create eventHasParticipant' });
  }
});

// Get an eventHasParticipant by IDs
router.get('/event_has_participants/:eventId/:participantId', async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const participantId = parseInt(req.params.participantId);
    const eventHasParticipant = await getEventHasParticipantByIds(eventId, participantId);
    if (eventHasParticipant) {
      res.json(eventHasParticipant);
    } else {
      res.status(404).json({ error: 'EventHasParticipant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get eventHasParticipant' });
  }
});

// Update an eventHasParticipant
router.put('/event_has_participants/:eventId/:participantId', async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const participantId = parseInt(req.params.participantId);
    const eventHasParticipantData = req.body;
    const eventHasParticipant = await updateEventHasParticipant(eventId, participantId, eventHasParticipantData);
    res.json(eventHasParticipant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update eventHasParticipant' });
  }
});

// Delete an eventHasParticipant
router.delete('/event_has_participants/:eventId/:participantId', async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const participantId = parseInt(req.params.participantId);
    await deleteEventHasParticipant(eventId, participantId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete eventHasParticipant' });
  }
});

//-----------------------------------------------------------------------------------------------------------------------------

// Create a participant
router.post('/participants', async (req, res) => {
  try {
    const participant = await createParticipant(req.body);
    res.status(201).json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create participant' });
  }
});

// Get a participant by ID
router.get('/participants/:id', async (req, res) => {
  try {
    const participantId = parseInt(req.params.id);
    const participant = await getParticipantById(participantId);
    if (participant) {
      res.json(participant);
    } else {
      res.status(404).json({ error: 'Participant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get participant' });
  }
});

// Update a participant
router.put('/participants/:id', async (req, res) => {
  try {
    const participantId = parseInt(req.params.id);
    const participantData = req.body;
    const participant = await updateParticipant(participantId, participantData);
    res.json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update participant' });
  }
});

// Delete a participant
router.delete('/participants/:id', async (req, res) => {
  try {
    const participantId = parseInt(req.params.id);
    await deleteParticipant(participantId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete participant' });
  }
});

//-----------------------------------------------------------------------------------------------------------------------------

// Create a participantHasCompetition
router.post('/participant_has_competitions', async (req, res) => {
  try {
    const participantHasCompetition = await createParticipantHasCompetition(req.body);
    res.status(201).json(participantHasCompetition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create participantHasCompetition' });
  }
});

// Get a participantHasCompetition by IDs
router.get('/participant_has_competitions/:participantId/:competitionId', async (req, res) => {
  try {
    const participantId = parseInt(req.params.participantId);
    const competitionId = parseInt(req.params.competitionId);
    const participantHasCompetition = await getParticipantHasCompetitionByIds(participantId, competitionId);
    if (participantHasCompetition) {
      res.json(participantHasCompetition);
    } else {
      res.status(404).json({ error: 'ParticipantHasCompetition not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get participantHasCompetition' });
  }
});

// Update a participantHasCompetition
router.put('/participant_has_competitions/:participantId/:competitionId', async (req, res) => {
  try {
    const participantId = parseInt(req.params.participantId);
    const competitionId = parseInt(req.params.competitionId);
    const participantHasCompetitionData = req.body;
    const participantHasCompetition = await updateParticipantHasCompetition(participantId, competitionId, participantHasCompetitionData);
    res.json(participantHasCompetition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update participantHasCompetition' });
  }
});

// Delete a participantHasCompetition
router.delete('/participant_has_competitions/:participantId/:competitionId', async (req, res) => {
  try {
    const participantId = parseInt(req.params.participantId);
    const competitionId = parseInt(req.params.competitionId);
    await deleteParticipantHasCompetition(participantId, competitionId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete participantHasCompetition' });
  }
});


//-----------------------------------------------------------------------------------------------------------------------------

// Create a score
router.post('/scores', async (req, res) => {
  try {
    const score = await createScore(req.body);
    res.status(201).json(score);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create score' });
  }
});

// Get a score by ID
router.get('/scores/:id', async (req, res) => {
  try {
    const scoreId = parseInt(req.params.id);
    const score = await getScoreById(scoreId);
    if (score) {
      res.json(score);
    } else {
      res.status(404).json({ error: 'Score not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get score' });
  }
});

// Update a score
router.put('/scores/:id', async (req, res) => {
  try {
    const scoreId = parseInt(req.params.id);
    const scoreData = req.body;
    const score = await updateScore(scoreId, scoreData);
    res.json(score);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

// Delete a score
router.delete('/scores/:id', async (req, res) => {
  try {
    const scoreId = parseInt(req.params.id);
    await deleteScore(scoreId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete score' });
  }
});

//-----------------------------------------------------------------------------------------------------------------------------


// Create a user
router.post('/users', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get a user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update a user
router.put('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userData = req.body;
    const user = await updateUser(userId, userData);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await deleteUser(userId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

//-----------------------------------------------------------------------------------------------------------------------------

// Create a user has score relationship
router.post('/user-has-scores', async (req, res) => {
  try {
    const userHasScore = await createUserHasScore(req.body);
    res.status(201).json(userHasScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user has score relationship' });
  }
});

// Get a user has score relationship by user ID and score ID
router.get('/user-has-scores/:userId/:scoreId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const scoreId = parseInt(req.params.scoreId);
    const userHasScore = await getUserHasScoreByIds(userId, scoreId);
    if (userHasScore) {
      res.json(userHasScore);
    } else {
      res.status(404).json({ error: 'User has score relationship not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get user has score relationship' });
  }
});

// Update a user has score relationship
router.put('/user-has-scores/:userId/:scoreId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const scoreId = parseInt(req.params.scoreId);
    const userHasScoreData = req.body;
    const userHasScore = await updateUserHasScore(userId, scoreId, userHasScoreData);
    res.json(userHasScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user has score relationship' });
  }
});

// Delete a user has score relationship
router.delete('/user-has-scores/:userId/:scoreId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const scoreId = parseInt(req.params.scoreId);
    await deleteUserHasScore(userId, scoreId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user has score relationship' });
  }
});


//-----------------------------------------------------------------------------------------------------------------------------

// Create a participant has groups relationship
router.post('/participant-has-groups', async (req, res) => {
  try {
    const participantHasGroups = await createParticipantHasGroups(req.body);
    res.status(201).json(participantHasGroups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create participant has groups relationship' });
  }
});

// Get a participant has groups relationship by participant ID and groups ID
router.get('/participant-has-groups/:participantId/:groupsId', async (req, res) => {
  try {
    const participantId = parseInt(req.params.participantId);
    const groupsId = parseInt(req.params.groupsId);
    const participantHasGroups = await getParticipantHasGroupsByIds(participantId, groupsId);
    if (participantHasGroups) {
      res.json(participantHasGroups);
    } else {
      res.status(404).json({ error: 'Participant has groups relationship not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get participant has groups relationship' });
  }
});

// Update a participant has groups relationship
router.put('/participant-has-groups/:participantId/:groupsId', async (req, res) => {
  try {
    const participantId = parseInt(req.params.participantId);
    const groupsId = parseInt(req.params.groupsId);
    const participantHasGroupsData = req.body;
    const participantHasGroups = await updateParticipantHasGroups(participantId, groupsId, participantHasGroupsData);
    res.json(participantHasGroups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update participant has groups relationship' });
  }
});

// Delete a participant has groups relationship
router.delete('/participant-has-groups/:participantId/:groupsId', async (req, res) => {
  try {
    const participantId = parseInt(req.params.participantId);
    const groupsId = parseInt(req.params.groupsId);
    await deleteParticipantHasGroups(participantId, groupsId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete participant has groups relationship' });
  }
});

//-----------------------------------------------------------------------------------------------------------------------------

// Create a groups
router.post('/groups', async (req, res) => {
  try {
    const groups = await createGroups(req.body);
    res.status(201).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create groups' });
  }
});

// Get a groups by ID
router.get('/groups/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const groups = await getGroupsById(id);
    if (groups) {
      res.json(groups);
    } else {
      res.status(404).json({ error: 'Groups not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get groups' });
  }
});

// Update a groups
router.put('/groups/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const groupsData = req.body;
    const groups = await updateGroups(id, groupsData);
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update groups' });
  }
});

// Delete a groups
router.delete('/groups/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await deleteGroups(id);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete groups' });
  }
});

//-----------------------------------------------------------------------------------------------------------------------------

// Create an event_has_groups
router.post('/event-has-groups', async (req, res) => {
  try {
    const eventHasGroups = await createEventHasGroups(req.body);
    res.status(201).json(eventHasGroups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event_has_groups' });
  }
});

// Get an event_has_groups by IDs
router.get('/event-has-groups/:eventId/:groupId', async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const groupId = parseInt(req.params.groupId);
    const eventHasGroups = await getEventHasGroupsByIds(eventId, groupId);
    if (eventHasGroups) {
      res.json(eventHasGroups);
    } else {
      res.status(404).json({ error: 'Event_has_Groups not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get event_has_groups' });
  }
});

// Update an event_has_groups
router.put('/event-has-groups/:eventId/:groupId', async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const groupId = parseInt(req.params.groupId);
    const eventHasGroupsData = req.body;
    const eventHasGroups = await updateEventHasGroups(eventId, groupId, eventHasGroupsData);
    res.json(eventHasGroups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update event_has_groups' });
  }
});

// Delete an event_has_groups
router.delete('/event-has-groups/:eventId/:groupId', async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const groupId = parseInt(req.params.groupId);
    await deleteEventHasGroups(eventId, groupId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete event_has_groups' });
  }
});

//-----------------------------------------------------------------------------------------------------------------------------