const asyncHandler = require("express-async-handler");
const Client = require("../models/clientModel");
const adminIds = JSON.parse(process.env.ADMIN);
const { default: mongoose } = require("mongoose");

//@desc Read all clients
//@route GET /api/client
//@access private
const clientReadAll = asyncHandler(async (req, res) => {
  try {
    let query = {}; // Initialize an empty query object

    // Check if the "name" query parameter is provided
    if (req.query.name) {
      const regex = new RegExp(req.query.name, "i"); // Create a case-insensitive regex pattern
      query = { lastName: regex }; // Set the query to filter by last name
    }

    // Find clients based on the query
    const clients = await Client.find(query);

    const clientsList = clients.map((client) => {
      return {
        _id: client._id,
        firstName: client.firstName,
        lastName: client.lastName,
        phoneNumber: client.phoneNumber,
        email: client.email,
        rent: client.rent,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        __v: client.__v,
      };
    });

    return res.status(200).json(clientsList);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

//@desc Create new client
//@route POST /api/client
//@access private

//@desc Create a new client
//@route POST /api/clients
//@access private

const clientCreate = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, email } = req.body;

  try {
    const client = new Client({
      firstName,
      lastName,
      phoneNumber,
      email,
    });

    await client.save();

    const createdClient = {
      _id: client._id,
      firstName: client.firstName,
      lastName: client.lastName,
      phoneNumber: client.phoneNumber,
      email: client.email,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      __v: client.__v,
    };

    return res.status(201).json(createdClient);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: err.message });
    } else {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
});

//@desc Edit client
//@route PUT /api/client/:id
//@access private

const clientEdit = asyncHandler(async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const { firstName, lastName, phoneNumber, email, rent } = req.body;

    // Update the client object properties
    client.firstName = firstName;
    client.lastName = lastName;
    client.phoneNumber = phoneNumber;
    client.email = email;
    client.rent = rent;

    // Validate the updated client
    const validationError = client.validateSync();
    if (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    const updatedClient = await client.save();

    const editedClient = {
      _id: updatedClient._id,
      firstName: updatedClient.firstName,
      lastName: updatedClient.lastName,
      phoneNumber: updatedClient.phoneNumber,
      email: updatedClient.email,
      rent: updatedClient.rent,
      createdAt: updatedClient.createdAt,
      updatedAt: updatedClient.updatedAt,
      __v: updatedClient.__v,
    };

    return res.status(200).json(editedClient);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

//@desc Delete client
//@route DELETE /api/client/:id
//@access private

const clientDelete = asyncHandler(async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await client.deleteOne({ _id: req.params.id });

    return res.status(200).json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = {
  clientReadAll,
  clientCreate,
  clientEdit,
  clientDelete,
};
