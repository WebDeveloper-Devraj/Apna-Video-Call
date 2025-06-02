import { Meeting } from "../models/meeting.model.js";
import { ExpressError } from "../util/ExpressError.js";
import { wrapAsync } from "../util/wrapAsync.js";

const createMeeting = wrapAsync(async (req, res) => {
  const { hostId, meetingCode, title } = req.body;
  console.log(req.body);
  const existing = await Meeting.findOne({ meetingCode });

  if (existing) {
    throw new ExpressError(400, "Meeting code already in use!");
  }

  const newMeeting = new Meeting({
    host: hostId,
    title,
    meetingCode,
    participants: [hostId],
    startedAt: new Date(),
  });

  await newMeeting.save();

  res.status(201).json({ message: "new meeting created.", success: true });
});

const joinMeeting = wrapAsync(async (req, res) => {
  const { participant, meetingCode } = req.body;

  if (!participant || !meetingCode) {
    throw new ExpressError(
      400,
      "Participant name and meeting code are required"
    );
  }

  const meeting = await Meeting.findOne({ meetingCode });
  if (!meeting) {
    throw new ExpressError(404, "This Meeting Does Not Exist!");
  }

  // Prevent duplicate names
  if (!meeting.participants.includes(participant)) {
    meeting.participants.push(participant);
    await meeting.save();
  }

  res.status(200).json({
    success: true,
    message: "Joined meeting successfully.",
  });
});

export { createMeeting, joinMeeting };
