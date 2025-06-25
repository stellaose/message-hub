import request from "supertest";
import app from "../app.js";
import { Contact } from "../models/ContactModel.js";
import { Favourite } from "../models/FavouriteModel.js";


// Mock the Contact model
jest.mock("../models/ContactModel.js", () => ({
  Contact: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));
jest.mock("../models/FavouriteModel.js", () => ({
  Favourite: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));


// # open database before each connection and clear mock before each test
beforeEach(async () => {
  jest.clearAllMocks();
});

// ` create new contact
describe("POST /api/contact/new", () => {
  it("responds with json", async () => {
    Contact.findOne.mockResolvedValue(null);

    // Mock the contact creation
    const mockContact = {
      phoneNumber: "07012284438",
      email: "john@example.com",
    };

    Contact.create.mockResolvedValue(mockContact);

    const res = await request(app)
      .post("/api/contact/new")
      .send({
        phoneNumber: "07012288738",
        email: "john@example.com",
      })
      .set("Accept", "application/json");
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Contact created successfully");
  });
});

// ` get all contacts
describe("GET /api/contact/all", () => {
  it("responds with json", async () => {
    // Mock the chain of methods used by ApiFeatures
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    // Mock the contacts data
    const mockContacts = [
      {
        contactId: "contact-123",
        firstName: "john",
        lastName: "doe",
        phoneNumber: "07012284438",
        email: "john@example.com",
      },
      {
        contactId: "contact-456",
        firstName: "jane",
        lastName: "smith",
        phoneNumber: "07012284439",
        email: "jane@example.com",
      },
    ];

    // Mock Contact.find() to return a chainable query object
    Contact.find.mockReturnValue(mockQuery);
    mockQuery.exec.mockResolvedValue(mockContacts);

    const res = await request(app)
      .get("/api/contact/all")
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
  });
});

// `get one contact
describe("GET /api/contact/one/:contactId", () => {
  it("respond with json", async () => {
    const contactId = "contact-17500829869317dws115m56x";

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

    const res = await request(app)
      .get(`/api/contact/one/${contactId}`)
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ' update contact
describe("PUT /api/contact/one/:contactId", () => {
  it("should update a contact", async () => {
    const contactId = "contact-17500829869317dws115m56x";
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

    const updatedMockContact = {
      contactId: "contact-123",
      firstName: "john",
      lastName: "doe",
      phoneNumber: "07012288738",
      email: "john@example.com",
      profession: "developer",
    };

    Contact.findOneAndUpdate.mockReturnValue(updatedMockContact);

    // $ find one in the favourite model
    Favourite.findOne.mockReturnValue(mockContact);
    
    // ! Update the favourite model
    Favourite.findOneAndUpdate.mockReturnValue(updatedMockContact);
    
    const res = await request(app)
      .put(`/api/contact/one/${contactId}`)
      .send({
        phoneNumber: "07012288738",
        email: "john@example.com",
      })
      .set("Accept", "application/json");
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Contact updated successfully");
  });
});

