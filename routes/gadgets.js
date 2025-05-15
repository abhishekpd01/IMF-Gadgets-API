const express = require("express");
const router = express.Router();
const { generateCodename } = require("../utils/generateCodeName");
const { PrismaClient } = require('@prisma/client');
const { getMissionSuccessProbability } = require("../utils/getSuccessProbab");
const prisma = new PrismaClient();

// GET /gadgets?status=Available
router.get("/", async (req, res) => {
  const { status } = req.query;
  const gadgets = await prisma.gadget.findMany({
    where: status ? { status } : {},
  });

  const withProbabilities = gadgets.map((g) => ({
    ...g,
    missionSuccess: getMissionSuccessProbability(),
  }));

  res.json(withProbabilities);
});

// POST /gadgets
router.post("/", async (req, res) => {
  const { name, status } = req.body;
  const gadget = await prisma.gadget.create({
    data: {
      name,
      status,
      codename: generateCodename(),
    },
  });
  res.status(201).json(gadget);
});

// PATCH /gadgets/:id
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const gadget = await prisma.gadget.update({
    where: { id },
    data,
  });

  res.json(gadget);
});

// DELETE /gadgets/:id → mark as decommissioned
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const gadget = await prisma.gadget.update({
    where: { id },
    data: {
      status: "Decommissioned",
      decommissionedAt: new Date(),
    },
  });

  res.json(gadget);
});

// POST /gadgets/:id/self-destruct
router.post("/:id/self-destruct", async (req, res) => {
  const { id } = req.params;

  const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Simulate self-destruct (mark as destroyed)
  const gadget = await prisma.gadget.update({
    where: { id },
    data: {
      status: "Destroyed",
    },
  });

  res.json({ message: "Self-destruct initiated", confirmationCode, gadget });
});

module.exports = router;
