import { Static, Type } from "@sinclair/typebox";

export const ChannelSchema = Type.Object({
    id: Type.Integer(),
    name: Type.String(),
    createdAt: Type.Optional(Type.Union([Type.String(), Type.Date()])),
    updatedAt: Type.Optional(Type.Union([Type.String(), Type.Date()])),
    url: Type.String(),
});

export type ChannelType = Static<typeof ChannelSchema>;

export const ChannelBodySchema = Type.Object({
    name: Type.String(),
    url: Type.String(),
});

export type ChannelBodyType = Static<typeof ChannelBodySchema>;

export const ChannelOnUserSchema = Type.Object({
    handle: Type.String(),
    userId: Type.Number(),
    channelId: Type.Number(),
});

export type ChannelOnUserType = Static<typeof ChannelOnUserSchema>;

export const ChannelOnUserBodySchema = Type.Object({
    handle: Type.String(),
});

export type ChannelOnUserBodyType = Static<typeof ChannelOnUserBodySchema>;

export const ChannelResponseSchema = Type.Object({
    channel: Type.Union([ChannelSchema, Type.Null()]),
});

export type ChannelResponseType = Static<typeof ChannelResponseSchema>;

export const ChannelsSchema = Type.Union([
    Type.Object({
        channels: Type.Array(ChannelSchema),
    }),
    Type.Null(),
]);

export type ChannelsResponseType = Static<typeof ChannelsSchema>;

export const ChannelsOnUserSchema = Type.Union([
    Type.Array(
        Type.Object({
            handle: Type.String(),
            channel: ChannelSchema,
        }),
    ),
    Type.Null(),
]);

export type ChannelsOnUserResponseType = Static<typeof ChannelsOnUserSchema>;

export const ErrorResponse = Type.Object({
    error: Type.String(),
});

export type ErrorResponseType = Static<typeof ErrorResponse>;
