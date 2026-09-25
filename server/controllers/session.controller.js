const Session = require("../models/session.models");
const Question = require("../models/question.models");

//@desc   Create a new session and linked questions
//@route  POST /api/sessions/create
//@access Private
exports.createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions = []} = req.body;
    const userId = req.user._id;

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const createdQuestion = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });

        return createdQuestion;
      }),
    );

    session.questions = questionDocs.map((doc) => doc._id);
    await session.save();
    await session.populate("questions");

    res.status(201).json({ success: true, session });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//@desc  Get all sessions for the logged-in user
//@route GET /api/sessions/my-sessions
//@access Private
exports.getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .populate("questions")

        res.status(200).json(sessions);

    } catch (error) {
        res.status(500).json({ succes: false, message: "Sever Error" });
    }
};

//@desc   Get all sessions for the logged-in user
//@route  GET /api/sessions/:id
//@access Private
exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id).populate({
            path: "questions",
            options: { sort: { isPinned: -1, createdAt: 1 }}
        }).exec();

        if (!session) {
            return res
            .status(404)
            .json({ success: false, message: "Session not found."});
        }

        res.status(200).json({ success: true, session });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" })
    }
};

//@desc   Delete a session and its questions
//@route  DELETE /api/session/:id
//@access Private
exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: "Session not found."})
        }

        //Check logged-in user owns this sessions
        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to delete this session" })
        }

        //First delete all questions linked to this sessions
        await Question.deleteMany({ session: session._id })

        //Then delete the sessions
        await session.deleteOne()

        res.status(200).json({ message: "Session deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
