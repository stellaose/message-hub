import request from "supertest";
import app from "../app";
import { Contact } from "../models/ContactModel.js";
import { Favourite } from "../models/FavouriteModel.js";


// ! mock the contact model
jest.mock("../models/ContactModel.js", () => ({
  Contact: {
    findOne: jest.fn(),
  },
}));

// ? mock the favourite model
jest.mock("../models/FavouriteModel.js", () => ({
  Favourite: {
    find: jest.fn(),
    create: jest.fn(),
    findOneAndDelete: jest.fn(),
    findOne: jest.fn(),
  },
}));


// # clear mock before each test
beforeEach(async () => {
  jest.clearAllMocks();
});

// ! create favourite test
describe("POST /api/favourite/new/:contactId", () => {
  it("responds with a json", async () => {
    const contactId = "contact-17500829869317dws115m56x";
    Favourite.findOne.mockResolvedValue(null);

    const mockContact = {
      contactId: "contact-123",
      firstName: "john",
      lastName: "doe",
      phoneNumber: "07012284438",
      email: "john@example.com",
      profession: "developer",
    };

    // Mock Contact.findOne() to return an object
    Contact.findOne.mockReturnValue(mockContact);

    // Mock Favourite.findOne() to return null

    Favourite.create.mockResolvedValue(mockContact);

    const res = await request(app)
      .post(`/api/favourite/new/${contactId}`)
      .set("Accept", "application/json");
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Favourite created successfully");
  });
});

// ' get all favourite test
describe("GET api/favourite/all", () => {
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
        favouriteId: "favourite-356",
        firstName: "john",
        lastName: "doe",
        phoneNumber: "07012284438",
        email: "john@example.com",
        isFavourite: true,
      },
      {
        contactId: "contact-456",
        favouriteId: "favourite-596",
        firstName: "jane",
        lastName: "smith",
        phoneNumber: "07012284439",
        email: "jane@example.com",
        isFavourite: true,
      },
    ];

    Favourite.find.mockReturnValue(mockQuery);
    mockQuery.exec.mockResolvedValue(mockContacts);

    const res = await request(app)
      .get("/api/favourite/all")
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
  });
});

// # delete one favourite endpoint
describe("DELETE api/favourite/remove/:favouriteId", () => {
  it("returns a json", async () => {
    const favouriteId = "favourite-1750081706287b7ddcsuhauv";
    
    const mockData = {
      favouriteId,
      contactId: "contact-123",
      firstName: "john",
      lastName: "doe"
    }

    Favourite.findOneAndDelete.mockReturnValue(mockData);

    const res = await request(app)
      .delete(`/api/favourite/remove/${favouriteId}`)
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Favourite deleted successfully");
  }, 18000);
});

