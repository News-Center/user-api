import { Static, Type } from "@sinclair/typebox";

export const PhaseSchema = Type.Object({
    id: Type.Integer(),
    name: Type.String(),
    description: Type.String(),
    createdAt: Type.Optional(Type.Union([Type.String(), Type.Date()])),
});

export type PhaseType = Static<typeof PhaseSchema>;

export const PhaseBodySchema = Type.Object({
    name: Type.String(),
    description: Type.String(),
});

export type PhaseBodyType = Static<typeof PhaseBodySchema>;

export const PhasesResponseSchema = Type.Object({
    phases: Type.Union([Type.Array(PhaseSchema), Type.Null()]),
});

export type PhasesResponseType = Static<typeof PhasesResponseSchema>;

export const PhaseResponseSchema = Type.Object({
    phase: Type.Union([PhaseSchema, Type.Null()]),
});

export type PhaseResponseType = Static<typeof PhaseResponseSchema>;
