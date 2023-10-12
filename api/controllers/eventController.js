const asyncHandler = require("express-async-handler");
const Event = require("../models/eventModel");
const adminIds = JSON.parse(process.env.ADMIN);
const { default: mongoose } = require("mongoose");

//@desc Read all events
//@route GET /api/event
//@access private
const eventReadAll = asyncHandler(async (req, res) => {
  try {
    // Find all events
    const events = await Event.find();

    const eventsList = events.map((event) => {
      return {
        _id: event._id,
        NameOfEvent: event.NameOfEvent,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        __v: event.__v,
      };
    });

    return res.status(200).json(eventsList);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: err.message });
    } else {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
});

//@desc Create new event
//@route POST /api/event
//@access private
const eventCreate = asyncHandler(async (req, res) => {
  const { NameOfEvent } = req.body;

  try {
    // Create a new Event instance
    const event = new Event({
      NameOfEvent,
    });

    // Save the event to the database
    await event.save();

    return res.status(201).json(event);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(err.message);
    } else {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
});

//@desc Edit event
//@route PUT /api/event/:id
//@access private
const eventEdit = asyncHandler(async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).send("Event not found!");
    }

    const { NameOfEvent } = req.body;

    // Update the event object properties
    event.NameOfEvent = NameOfEvent;

    const validationError = event.validateSync();
    if (validationError) {
      return res.status(400).send(validationError.message);
    }

    // Save the updated event
    const updatedEvent = await event.save();

    return res.status(200).json(updatedEvent);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

//@desc Delete event
//@route DELETE /api/event/:id
//@access private
const eventDelete = asyncHandler(async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).send("Event not found");
    }

    // Check if the event is associated with any other data (e.g., rents)
    // If it is, prevent deletion
    // You can add your own logic here

    // Delete the event if it's not associated with any other data
    await event.deleteOne({ _id: req.params.id });

    return res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = {
  eventReadAll,
  eventCreate,
  eventEdit,
  eventDelete,
};
