import { PrismaClient, Club, Competition, Competition_has_User, Event, Event_has_Participant, Participant, Participant_has_Competition, Score, User, User_has_Score, Participant_has_Groups, Groups, Event_has_Groups } from '@prisma/client'

const prisma = new PrismaClient()

module.exports = {
  // Club
  createClub,
  getClubById,
  updateClub,
  deleteClub,
  // Competition
  createCompetition,
  getCompetitionById,
  updateCompetition,
  deleteCompetition,
  // Competition_has_User
  createCompetitionHasUser,
  getCompetitionHasUserByIds,
  updateCompetitionHasUser,
  deleteCompetitionHasUser,
  // Event
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  // Event_has_Participant
  createEventHasParticipant,
  getEventHasParticipantByIds,
  updateEventHasParticipant,
  deleteEventHasParticipant,
  // Participant
  createParticipant,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
  // Participant_has_Competition
  createParticipantHasCompetition,
  getParticipantHasCompetitionByIds,
  updateParticipantHasCompetition,
  deleteParticipantHasCompetition,
  // Score
  createScore,
  getScoreById,
  updateScore,
  deleteScore,
  // User
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  // User_has_Score
  createUserHasScore,
  getUserHasScoreByIds,
  updateUserHasScore,
  deleteUserHasScore,
  // Participant_has_Groups
  createParticipantHasGroups,
  getParticipantHasGroupsByIds,
  updateParticipantHasGroups,
  deleteParticipantHasGroups,
  // Groups
  createGroups,
  getGroupsById,
  updateGroups,
  deleteGroups,
  // Event_has_Groups
  createEventHasGroups,
  getEventHasGroupsByIds,
  updateEventHasGroups,
  deleteEventHasGroups
  };

// CRUD operations for Club model
async function createClub(club: Club): Promise<Club> {
  return prisma.club.create({ data: club })
}

async function getClubById(id: number): Promise<Club | null> {
  return prisma.club.findUnique({ where: { idClub: id } })
}

async function updateClub(id: number, clubData: Partial<Club>): Promise<Club> {
  return prisma.club.update({ where: { idClub: id }, data: clubData })
}

async function deleteClub(id: number): Promise<void> {
  await prisma.club.delete({ where: { idClub: id } })
}

// CRUD operations for Competition model
async function createCompetition(competition: Competition): Promise<Competition> {
  return prisma.competition.create({ data: competition })
}

async function getCompetitionById(id: number): Promise<Competition | null> {
  return prisma.competition.findUnique({ where: { idcompetition: id } })
}

async function updateCompetition(id: number, competitionData: Partial<Competition>): Promise<Competition> {
  return prisma.competition.update({ where: { idcompetition: id }, data: competitionData })
}

async function deleteCompetition(id: number): Promise<void> {
  await prisma.competition.delete({ where: { idcompetition: id } })
}

// CRUD operations for Competition_has_User model
async function createCompetitionHasUser(competitionHasUser: Competition_has_User): Promise<Competition_has_User> {
  return prisma.competition_has_User.create({ data: competitionHasUser })
}

async function getCompetitionHasUserByIds(competitionId: number, userId: number): Promise<Competition_has_User | null> {
  return prisma.competition_has_User.findUnique({ where: { Competition_idcompetition_user_iduser: { Competition_idcompetition: competitionId, User_iduser: userId } } })
}

async function updateCompetitionHasUser(competitionId: number, userId: number, competitionHasUserData: Partial<Competition_has_User>): Promise<Competition_has_User> {
  return prisma.competition_has_User.update({ where: { Competition_idcompetition_user_iduser: { Competition_idcompetition: competitionId, User_iduser: userId } }, data: competitionHasUserData })
}

async function deleteCompetitionHasUser(competitionId: number, userId: number): Promise<void> {
  await prisma.competition_has_User.delete({ where: { Competition_idcompetition_user_iduser: { Competition_idcompetition: competitionId, User_iduser: userId } } })
}

// CRUD operations for Event model
async function createEvent(event: Event): Promise<Event> {
  return prisma.event.create({ data: event })
}

async function getEventById(id: number): Promise<Event | null> {
  return prisma.event.findUnique({ where: { idEvent: id } })
}

async function updateEvent(id: number, eventData: Partial<Event>): Promise<Event> {
  return prisma.event.update({ where: { idEvent: id }, data: eventData })
}

async function deleteEvent(id: number): Promise<void> {
  await prisma.event.delete({ where: { idEvent: id } })
}

// CRUD operations for Event_has_Participant model
async function createEventHasParticipant(eventHasParticipant: Event_has_Participant): Promise<Event_has_Participant> {
  return prisma.event_has_Participant.create({ data: eventHasParticipant })
}

async function getEventHasParticipantByIds(eventId: number, participantId: number): Promise<Event_has_Participant | null> {
  return prisma.event_has_Participant.findUnique({ where: { Event_idEvent_Participant_idParticipant: { Event_idEvent: eventId, Participant_idParticipant: participantId } } })
}

async function updateEventHasParticipant(eventId: number, participantId: number, eventHasParticipantData: Partial<Event_has_Participant>): Promise<Event_has_Participant> {
  return prisma.event_has_Participant.update({ where: { Event_idEvent_Participant_idParticipant: { Event_idEvent: eventId, Participant_idParticipant: participantId } }, data: eventHasParticipantData })
}

async function deleteEventHasParticipant(eventId: number, participantId: number): Promise<void> {
  await prisma.event_has_Participant.delete({ where: { Event_idEvent_Participant_idParticipant: { Event_idEvent: eventId, Participant_idParticipant: participantId } } })
}

// CRUD operations for Participant model
async function createParticipant(participant: Participant): Promise<Participant> {
  return prisma.participant.create({ data: participant })
}

async function getParticipantById(id: number): Promise<Participant | null> {
  return prisma.participant.findUnique({ where: { idParticipant: id } })
}

async function updateParticipant(id: number, participantData: Partial<Participant>): Promise<Participant> {
  return prisma.participant.update({ where: { idParticipant: id }, data: participantData })
}

async function deleteParticipant(id: number): Promise<void> {
  await prisma.participant.delete({ where: { idParticipant: id } })
}

// CRUD operations for Participant_has_Competition model
async function createParticipantHasCompetition(participantHasCompetition: Participant_has_Competition): Promise<Participant_has_Competition> {
  return prisma.participant_has_Competition.create({ data: participantHasCompetition })
}

async function getParticipantHasCompetitionByIds(participantId: number, competitionId: number): Promise<Participant_has_Competition | null> {
  return prisma.participant_has_Competition.findUnique({ where: { Participant_idParticipant_Competition_idcompetition: { Participant_idParticipant: participantId, Competition_idcompetition: competitionId } } })
}

async function updateParticipantHasCompetition(participantId: number, competitionId: number, participantHasCompetitionData: Partial<Participant_has_Competition>): Promise<Participant_has_Competition> {
  return prisma.participant_has_Competition.update({ where: { Participant_idParticipant_Competition_idcompetition: { Participant_idParticipant: participantId, Competition_idcompetition: competitionId } }, data: participantHasCompetitionData })
}

async function deleteParticipantHasCompetition(participantId: number, competitionId: number): Promise<void> {
  await prisma.participant_has_Competition.delete({ where: { Participant_idParticipant_Competition_idcompetition: { Participant_idParticipant: participantId, Competition_idcompetition: competitionId } } })
}

// CRUD operations for Score model
async function createScore(score: Score): Promise<Score> {
  return prisma.score.create({ data: score })
}

async function getScoreById(id: number): Promise<Score | null> {
  return prisma.score.findUnique({ where: { idScore: id } })
}

async function updateScore(id: number, scoreData: Partial<Score>): Promise<Score>{
return prisma.score.update({ where: { idScore: id }, data: scoreData })
}

async function deleteScore(id: number): Promise<void> {
  await prisma.score.delete({ where: { idScore: id } })
}

// CRUD operations for User model
async function createUser(user: User): Promise<User> {
  return prisma.user.create({ data: user })
}

async function getUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { iduser: id } })
}

async function updateUser(id: number, userData: Partial<User>): Promise<User> {
  return prisma.user.update({ where: { iduser: id }, data: userData })
}

async function deleteUser(id: number): Promise<void> {
  await prisma.user.delete({ where: { iduser: id } })
}

// CRUD operations for User_has_Score model
async function createUserHasScore(userHasScore: User_has_Score): Promise<User_has_Score> {
  return prisma.user_has_Score.create({ data: userHasScore })
}

async function getUserHasScoreByIds(userId: number, scoreId: number): Promise<User_has_Score | null> {
  return prisma.user_has_Score.findUnique({ where: { User_iduser_Score_idScore: { User_iduser: userId, Score_idScore: scoreId } } })
}

async function updateUserHasScore(userId: number, scoreId: number, userHasScoreData: Partial<User_has_Score>): Promise<User_has_Score> {
  return prisma.user_has_Score.update({ where: { User_iduser_Score_idScore: { User_iduser: userId, Score_idScore: scoreId } }, data: userHasScoreData })
}

async function deleteUserHasScore(userId: number, scoreId: number): Promise<void> {
  await prisma.user_has_Score.delete({ where: { User_iduser_Score_idScore: { User_iduser: userId, Score_idScore: scoreId } } })
}

// CRUD operations for Participant_has_Groups model
async function createParticipantHasGroups(participantHasGroups: Participant_has_Groups): Promise<Participant_has_Groups> {
  return prisma.participant_has_Groups.create({ data: participantHasGroups })
}

async function getParticipantHasGroupsByIds(participantId: number, groupsId: number): Promise<Participant_has_Groups | null> {
  return prisma.participant_has_Groups.findUnique({ where: { Participant_idParticipant_Groups_idGroups: { Participant_idParticipant: participantId, Groups_idGroups: groupsId } } })
}

async function updateParticipantHasGroups(participantId: number, groupsId: number, participantHasGroupsData: Partial<Participant_has_Groups>): Promise<Participant_has_Groups> {
  return prisma.participant_has_Groups.update({ where: { Participant_idParticipant_Groups_idGroups: { Participant_idParticipant: participantId, Groups_idGroups: groupsId } }, data: participantHasGroupsData })
}

async function deleteParticipantHasGroups(participantId: number, groupsId: number): Promise<void> {
  await prisma.participant_has_Groups.delete({ where: { Participant_idParticipant_Groups_idGroups: { Participant_idParticipant: participantId, Groups_idGroups: groupsId } } })
}

// CRUD operations for Groups model
async function createGroups(groups: Groups): Promise<Groups> {
  return prisma.groups.create({ data: groups })
}

async function getGroupsById(id: number): Promise<Groups | null> {
  return prisma.groups.findUnique({ where: { idGroups: id } })
}

async function updateGroups(id: number, groupsData: Partial <Groups>): Promise<Groups> {
  return prisma.groups.update({ where: { idGroups: id }, data: groupsData })
}
    
async function deleteGroups(id: number): Promise<void> {
  await prisma.groups.delete({ where: { idGroups: id } })
}
    
// CRUD operations for Event_has_Groups model
async function createEventHasGroups(eventHasGroups: Event_has_Groups): Promise<Event_has_Groups> {
  return prisma.event_has_Groups.create({ data: eventHasGroups })
}
    
async function getEventHasGroupsByIds(eventId: number, groupsId: number): Promise<Event_has_Groups | null> {
 return prisma.event_has_Groups.findUnique({ where: { Event_idEvent_Groups_idGroups: { Event_idEvent: eventId, Groups_idGroups: groupsId } } })
}
    
async function updateEventHasGroups(eventId: number, groupsId: number, eventHasGroupsData: Partial<Event_has_Groups>): Promise<Event_has_Groups> {
  return prisma.event_has_Groups.update({ where: { Event_idEvent_Groups_idGroups: { Event_idEvent: eventId, Groups_idGroups: groupsId } }, data: eventHasGroupsData })
}
    
async function deleteEventHasGroups(eventId: number, groupsId: number): Promise<void> {
  await prisma.event_has_Groups.delete({ where: { Event_idEvent_Groups_idGroups: { Event_idEvent: eventId, Groups_idGroups: groupsId } } })
}
    
    