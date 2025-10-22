import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler";

// Create a new contact message
export const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const userId = req.userId; // From auth middleware

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email, subject, and message are required"
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address"
    });
  }

  try {
    const contact = await prisma.contact.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Contact message sent successfully",
      contact
    });
  } catch (error) {
    console.error("Error creating contact message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send contact message"
    });
  }
});

// Get all contact messages for admin (optional)
export const getAllContactMessages = asyncHandler(async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      contacts
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages"
    });
  }
});

// Get contact messages for a specific user
export const getUserContactMessages = asyncHandler(async (req, res) => {
  const userId = req.userId;

  try {
    const contacts = await prisma.contact.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      contacts
    });
  } catch (error) {
    console.error("Error fetching user contact messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your contact messages"
    });
  }
});

// Delete a contact message (optional)
export const deleteContactMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Check if the contact message exists and belongs to the user
    const contact = await prisma.contact.findUnique({
      where: { id }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found"
      });
    }

    if (contact.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own contact messages"
      });
    }

    await prisma.contact.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete contact message"
    });
  }
});