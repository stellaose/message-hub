import request from "supertest";
import app from "../app";
import { Favourite } from "../models/FavouriteModel.js";
import { Contact } from "../models/ContactModel.js";
import { Hidden } from "../models/HiddenModel.js";

// $ mock the contact model
jest.mock("../models/ContactModel.js", () => ({
  Contact: {
    findOne: jest.fn(),
    findOneAndDelete: jest.fn(),
    create: jest.fn(),
  },
}));

// # mock the favourite model
jest.mock("../models/FavouriteModel.js", () => ({
  Favourite: {
    findOneAndDelete: jest.fn(),
  },
}));

// ' mock the hidden model
jest.mock("../models/HiddenModel.js", () => ({
  Hidden: {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findOneAndDelete: jest.fn(),
  },
}));

// + clear mock before each test
beforeEach(async () => {
  jest.clearAllMocks();
});

// ! create hidden test
describe("POST api/hidden/new/:contactId", () => {
  it("responds with a json", async () => {
    const contactId = "contact-17500829869317dws115m56x";

    const mockContact = {
      contactId: "contact-123",
      firstName: "john",
      lastName: "doe",
      phoneNumber: "07012284438",
      email: "john@example.com",
      profession: "developer",
    };

    Contact.findOne.mockReturnValue(mockContact);
    Hidden.findOne.mockResolvedValue(null);

    Hidden.create.mockResolvedValue(mockContact);
    
    // ~ delete from contact and favourite database when contact has been deleted temporarily
    Contact.findOneAndDelete.mockResolvedValue(mockContact);
    Favourite.findOneAndDelete.mockResolvedValue(mockContact);

    const res = await request(app)
      .post(`/api/hidden/new/${contactId}`)
      .set("Accept", "application/json");
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Contact deleted");
  });
});

// ^ get all favourite test
describe("GET api/hidden/all", () => {
  it("responds with json", async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    // mock the favourites data
    const mockContacts = [
      {
        contactId: "contact-123",
        hiddenId: "hidden-356",
        firstName: "john",
        lastName: "doe",
        phoneNumber: "07012284438",
        email: "john@example.com",
        isFavourite: true,
      },
      {
        contactId: "contact-456",
        hiddenId: "hidden-596",
        firstName: "jane",
        lastName: "smith",
        phoneNumber: "07012284439",
        email: "jane@example.com",
        isFavourite: true,
      },
    ];

    Hidden.find.mockReturnValue(mockQuery);
    mockQuery.exec.mockResolvedValue(mockContacts);

    const res = await request(app)
      .get("/api/hidden/all")
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
  });
});
